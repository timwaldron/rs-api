const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const app = express();

const osrs_web_order = [
  "overall", "attack", "defence", "strength", "hitpoints", "ranged", "prayer",
  "magic", "cooking", "woodcutting", "fletching", "fishing", "firemaking", "crafting",
  "smithing", "mining", "herblore", "agility", "thieving", "slayer", "farming",
  "runecrafting", "hunter", "construction", "bounty_hunter", "bounty_hunter_rouge",
  "clue_scrolls_all", "clue_scrolls_beginner", "clue_scrolls_easy", "clue_scrolls_medium",
  "clue_scrolls_hard", "clue_scrolls_elite", "clue_scrolls_master", "last_man_standing"
];

const apiList = {
  osrsHiscores: "https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player="
};

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("LOG:", req.method, req.path, req.ip);
  next();
});


const fetchOSRSHiscore = async(username) => {
  let player = {username: username, skills: {}, minigames: {}};

  let response = await fetch(apiList.osrsHiscores + username);
  let data = await response.text();
  

  data.split("\n").forEach((entry, index) => {
    if (entry === "") return;
    
    let entryStat = entry.split(",");

    if (entryStat.length === 3) {
      player.skills[osrs_web_order[index]] = {
        experience: parseInt(entryStat[0]),
        level: parseInt(entryStat[1]),
        rank: parseInt(entryStat[2])
      };
    } else {
      player.minigames[osrs_web_order[index]] = {
        rank: parseInt(entryStat[0]),
        score: parseInt(entryStat[1])
      }
    }
  })

  console.log("Hiscore entries:", player);
  return player;
}

const calculateCombatLevel = async(playerObject) => {
  
}

app.get("/:game/:username", (req, res) => {
  switch(req.params.game.toLowerCase()) {

    case "osrs":
      fetchOSRSHiscore(req.params.username.toLowerCase()).then((result) => res.json(result));
      return;

    case "rs3":

      break;

    default:
      res.json({"error": `'${req.params.game} is an invalid gametype`});
      return;
  }

  console.log(req.params);
  res.json({url: apiList.osrsHiscores});
})

app.get("/:game/:username/:item", (req, res) => {
  console.log(req.params);
  res.json({url: apiList.osrsHiscores});
})

app.listen(3000, () => console.log("Server listing on port 3000..."))