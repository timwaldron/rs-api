const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const app = express();

const osrsWebOrder = [
  "overall", "attack", "defence", "strength", "hitpoints", "ranged", "prayer",
  "magic", "cooking", "woodcutting", "fletching", "fishing", "firemaking", "crafting",
  "smithing", "mining", "herblore", "agility", "thieving", "slayer", "farming",
  "runecrafting", "hunter", "construction", "bounty_hunter", "bounty_hunter_rouge",
  "clue_scrolls_all", "clue_scrolls_beginner", "clue_scrolls_easy", "clue_scrolls_medium",
  "clue_scrolls_hard", "clue_scrolls_elite", "clue_scrolls_master", "last_man_standing"
];

const apiList = {
  osrs: {
    main: "https://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=",
    im: "https://services.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=",
    hc: "https://services.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player=",
    uim: "https://services.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=",
    dmm: "https://services.runescape.com/m=hiscore_oldschool_deadman/index_lite.ws?player=",
    sdmm: "https://services.runescape.com/m=hiscore_oldschool_seasonal/index_lite.ws?player=",
    dmmt: "https://services.runescape.com/m=hiscore_oldschool_tournament/index_lite.ws?player=",
  },
};

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("LOG:", req.method, req.path, req.ip);
  next();
});

const fetchOSRSHiscore = async(params) => {
  let player = {username: params.username, combat_level: 0, skills: {}, minigames: {clue_scrolls: {}}};
  let response = await fetch(apiList[params.game][params.category] + params.username);

  if (response.status == 404) return { error: "Returned 404 from the endpoint " + params.game + "/" + params.category + "/" + params.username };

  let data = await response.text();

  data.split("\n").forEach((entry, index) => {
    if (entry === "") return;
    
    let entryStat = entry.split(",");

    if (entryStat.length === 3) {
      player.skills[osrsWebOrder[index]] = {
        experience: parseInt(entryStat[0]),
        level: parseInt(entryStat[1]),
        rank: parseInt(entryStat[2])
      };
    } else {
      if (osrsWebOrder[index].toLowerCase().startsWith("clue")) {
        let clueDifficulty = osrsWebOrder[index].split("_")[2]; // Clue difficulty
        player.minigames.clue_scrolls[clueDifficulty] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else {
        player.minigames[osrsWebOrder[index]] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      }
    }
  });

  player.combat_level = calculateCombatLevel(player);
  return player;
}

const calculateCombatLevel = (playerObject) => {
  let hitpoints = playerObject.skills.hitpoints.level;
  let attack = playerObject.skills.attack.level;
  let strength = playerObject.skills.strength.level;
  let defence = playerObject.skills.defence.level;
  let ranged = playerObject.skills.ranged.level;
  let magic = playerObject.skills.magic.level;
  let prayer = playerObject.skills.prayer.level;

  let base = 0.25 * Math.floor(defence + hitpoints + (prayer / 2));
  let melee = 0.325 * (attack + strength);
  let range = 0.325 * Math.floor((ranged / 2) + ranged);
  let mage = 0.325 * Math.floor((magic / 2) + magic);

  let combat_stats = [melee, range, mage];
  let max_stat = combat_stats.reduce((a, b) => Math.max(a, b));

  let final = Math.floor(base + max_stat);

  return final;
}

app.get("/api/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:game/:username", (req, res) => {
  let params = {
    game: req.params.game.toLowerCase(),
    category: "main",
    username: req.params.username.toLowerCase().replace(" ", "_"),
  }

  switch(params.game) {
    case "osrs":
      fetchOSRSHiscore(params).then((result) => res.json(result));
      return;

    case "rs3":

      break;

    default:
      res.json({"error": `'${req.params.game} is an invalid gametype`});
      return;
  }

  res.json({url: apiList.osrsHiscores});
});

app.get("/api/:game/:category/:username", (req, res) => {
  let params = {
    game: req.params.game.toLowerCase(),
    category: req.params.category.toLowerCase(),
    username: req.params.username.toLowerCase().replace(" ", "_"),
  }

  switch(params.game) {
    case "osrs":
      fetchOSRSHiscore(params).then((result) => res.json(result));
      return;

    case "rs3":

      break;

    default:
      res.json({"error": `'${req.params.game} is an invalid gametype`});
      return;
  }

  res.json({url: apiList.osrsHiscores});
})

// app.get("/api/:game/:username/:item", (req, res) => {
//   console.log(req.params);
//   res.json({url: apiList.osrsHiscores});
// })

app.listen(3000, () => console.log("Server listing on port 3000..."))