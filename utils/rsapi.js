const fetch = require("node-fetch");

const osrsWebOrder = [
  "overall", "attack", "defence", "strength", "hitpoints", "ranged", "prayer",
  "magic", "cooking", "woodcutting", "fletching", "fishing", "firemaking", "crafting",
  "smithing", "mining", "herblore", "agility", "thieving", "slayer", "farming",
  "runecrafting", "hunter", "construction", "bounty_hunter", "bounty_hunter_rouge",
  "clue_scrolls_all", "clue_scrolls_beginner", "clue_scrolls_easy", "clue_scrolls_medium",
  "clue_scrolls_hard", "clue_scrolls_elite", "clue_scrolls_master", "last_man_standing"
];

const apiUrlList = {
  osrs: {
    main: "https://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=",
    dmm: "https://services.runescape.com/m=hiscore_oldschool_deadman/index_lite.ws?player=",
    sdmm: "https://services.runescape.com/m=hiscore_oldschool_seasonal/index_lite.ws?player=",
    dmmt: "https://services.runescape.com/m=hiscore_oldschool_tournament/index_lite.ws?player=",
  },
};

const fetchOSRSHiscore = async(params) => {
  let response = await fetch(apiUrlList[params.game][params.category] + params.username);

  if (response.status == 404)
    return { error: "Returned 404 from the endpoint " + params.game + "/" + params.category + "/" + params.username };

  let sortedData = sortHiscoreData(params.username, await response.text());
  return sortedData;
}

const sortHiscoreData = (username, rawData) => {
  let player = {username: username, combat_level: 0, skills: {}, minigames: {clue_scrolls: {}}};

  rawData.split("\n").forEach((entry, index) => {
    if (entry === "") return;
    
    let entryStat = entry.split(",");

    if (entryStat.length === 3) {
      player.skills[osrsWebOrder[index]] = {
        rank: parseInt(entryStat[0]),
        level: parseInt(entryStat[1]),
        experience: parseInt(entryStat[2])
      };
    } else {
      if (osrsWebOrder[index].toLowerCase().startsWith("clue")) {
        let clueDifficulty = osrsWebOrder[index].split("_")[2]; // Clue difficulty
        
        player.minigames.clue_scrolls[clueDifficulty] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else {
        player.minigames[osrsWebOrder[index]] = { rank: parseInt(entryStat[0]), score: parseInt(entryStat[1])
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

module.exports = { fetchOSRSHiscore };