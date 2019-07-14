const fetch = require("node-fetch");

const osrsWebOrder = [
  "overall", "attack", "defence", "strength", "hitpoints", "ranged", "prayer",
  "magic", "cooking", "woodcutting", "fletching", "fishing", "firemaking", "crafting",
  "smithing", "mining", "herblore", "agility", "thieving", "slayer", "farming",
  "runecrafting", "hunter", "construction", "bounty_hunter", "bounty_hunter_rouge",
  "clue_scrolls_all", "clue_scrolls_beginner", "clue_scrolls_easy", "clue_scrolls_medium",
  "clue_scrolls_hard", "clue_scrolls_elite", "clue_scrolls_master", "last_man_standing"
];

const rs3WebOrder = [
  "overall", "attack","defence", "strength", "constitution", "ranged","prayer",
  "magic", "cooking", "woodcutting", "fletching", "fishing", "firemaking", "crafting",
  "smithing", "mining", "herblore", "agility", "thieving", "slayer", "farming",
  "runecrafting", "hunter", "construction", "summoning", "dungeoneering", "divination",
  "invention", "bounty_hunter", "bounty_hunter_rogues", "dominion_tower", "the_crucible",
  "castle_wars_games", "barbarian_assault_attackers", "barbarian_assault_defenders",
  "barbarian_assault_collectors", "barbarian_assault_healers", "duel_tournament",
  "mobilising_armies", "conquest", "fist_of_guthix", "gielinor_games_athletics",
  "gielinor_games_resource_race", "world_event_2_armadyl_lifetime_contribution",
  "world_event_2_bandos_lifetime_contribution", "world_event_2_armadyl_pvp_kills",
  "world_event_2_bandos_pvp_kills", "heist_guard_level", "heist_robber_level",
  "cfp_5_game_average", "april_fools_cow_tipping", "april_fools_rats", "runescore",
  "clue_scrolls_easy", "clue_scrolls_medium", "clue_scrolls_hard", "clue_scrolls_elite",
  "clue_scrolls_master",
];

const apiUrlList = {
  osrs: {
    main: "https://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=",
    dmm: "https://services.runescape.com/m=hiscore_oldschool_deadman/index_lite.ws?player=",
    sdmm: "https://services.runescape.com/m=hiscore_oldschool_seasonal/index_lite.ws?player=",
    dmmt: "https://services.runescape.com/m=hiscore_oldschool_tournament/index_lite.ws?player=",
  },
  rs3: {
    main: "https://secure.runescape.com/m=hiscore/index_lite.ws?player=",
  }
};

const fetchOSRSHiscore = async(params, returnRawData) => {
  let response = await fetch(apiUrlList[params.game][params.category] + params.username);
  let hiscoreData = await response.text();

  if (returnRawData)
    return hiscoreData;

  if (response.status == 404)
    return { error: "Returned 404 from the endpoint " + params.game + "/" + params.category + "/" + params.username };

  let sortedData = sortHiscoreData(params.username, hiscoreData);
  return sortedData;
}

const fetchRS3Hiscore = async(params, returnRawData) => {
  let response = await fetch(apiUrlList[params.game][params.category] + params.username);
  let hiscoreData = await response.text();

  if (returnRawData)
    return hiscoreData;

  if (response.status == 404)
    return { error: "Returned 404 from the endpoint " + params.game + "/" + params.category + "/" + params.username };

  let sortedData = sortRS3Data(params.username, hiscoreData);
  return sortedData;
}

const sortHiscoreData = (username, rawData) => {
  let player = {
    username: username,
    combat_level: 0,
    skills: {},
    minigames: {
      clue_scrolls: {},
    }
  };

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
      let category = osrsWebOrder[index];

      if (category.startsWith("clue_scroll")) {
        let clueDifficulty = category.replace(/clue_scroll_/g, "");
        
        player.minigames.clue_scrolls[clueDifficulty] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else 
        player.minigames[osrsWebOrder[index]] = { rank: parseInt(entryStat[0]), score: parseInt(entryStat[1]) };
    }
  });

  player.combat_level = calcOSRSCombatLevel(player);

  return player;
}

const sortRS3Data = (username, rawData) => {
  let player = {
    username: username,
    combat_level: 0,
    runescore: {},
    skills: {},
    minigames: {
      barbarian_assault: {},
      bounty_hunter: {},
      world_event_2: {},
      heist: {},
      april_fools: {},
      clue_scrolls: {},
    }
  };

  rawData.split("\n").forEach((entry, index) => {
    if (entry === "") return;
    
    let entryStat = entry.split(",");
    
    if (entryStat.length === 3) {
      player.skills[rs3WebOrder[index]] = {
        rank: parseInt(entryStat[0]),
        level: parseInt(entryStat[1]),
        experience: parseInt(entryStat[2])
      };
    } else {
      // TODO: Refactor, need to put the minigame subcategories in an array and iterate through it
      // instead of using like 5 if statements.

      let category = rs3WebOrder[index];

      if (category.startsWith("barbarian_assault")) {
        let baRole = category.replace(/barbarian_assault_/g, "");

        player.minigames.barbarian_assault[baRole] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else if (category.startsWith("bounty_hunter")) {
        if (category.includes("rogue")) {
          player.minigames.bounty_hunter["rouge"] = {
            rank: parseInt(entryStat[0]),
            score: parseInt(entryStat[1])
          }
        } else {
          player.minigames.bounty_hunter = {
            rank: parseInt(entryStat[0]),
            score: parseInt(entryStat[1])
          }
        }
      } else if (category.startsWith("world_event_2")) {
        let we2 = category.replace(/world_event_2_/g, "");
        
        player.minigames.world_event_2[we2] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else if (category.startsWith("heist")) {
        let heistRole = category.replace(/heist_/g, "");
        
        player.minigames.heist[heistRole] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else if (category.startsWith("april_fools")) {
        let afAnimal = category.replace(/april_fools_/g, "");
        
        player.minigames.april_fools[afAnimal] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else if (category.startsWith("clue_scroll")) {
        let clueDifficulty = category.replace(/clue_scroll_/g, "");
        
        player.minigames.clue_scrolls[clueDifficulty] = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else if (category === "runescore") {
        player.runescore = {
          rank: parseInt(entryStat[0]),
          score: parseInt(entryStat[1])
        }
      } else
        player.minigames[rs3WebOrder[index]] = { rank: parseInt(entryStat[0]), score: parseInt(entryStat[1]) };
    }
  });

  player.combat_level = calcRS3CombatLevel(player);

  return player;
}

const calcOSRSCombatLevel = (playerObject) => {
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

const calcRS3CombatLevel = (playerObject) => {
  let constitution = playerObject.skills.constitution.level;
  let attack = playerObject.skills.attack.level;
  let strength = playerObject.skills.strength.level;
  let defence = playerObject.skills.defence.level;
  let ranged = playerObject.skills.ranged.level;
  let magic = playerObject.skills.magic.level;
  let prayer = playerObject.skills.prayer.level;
  let summoning = playerObject.skills.summoning.level;

  // Pulled this formula from the LUA script at https://runescape.wiki/w/Module:Combat_level

  let attStr = attack + strength;
  let lvl = (Math.max(attStr, magic * 2, ranged * 2) * 1.3 + defence + constitution + Math.floor(prayer * 0.5) + Math.floor(summoning *0.5)) * 0.25;

  // Leaving this block of code here incase I decide to implement another
  // skill object in the player to do with required levels to X combat level

  // let HpDef = Math.ceil((1 - (lvl % 1)) * 4);
  // let PraySumm = Math.ceil((1 - (lvl % 1)) * 8);
  // let Melee, Mage, Range;
  // let cbtype;

  // if (attstr >= 2*magic && attstr >= 2*ranged) {
  //   cbtype = "melee";
  //   Melee = Math.ceil((1 - (lvl % 1)) / 0.325);
  //   Mage = Math.ceil((attstr - magic * 2) / 2 + (1 - (lvl % 1)) / 0.65);
  //   Range = Math.ceil((attstr - ranged * 2) / 2 + (1 - (lvl % 1)) / 0.65);
  // } else {
  //   Melee = Math.max(ranged, magic) * 2 - attstr + Math.ceil((1 - (lvl % 1)) / 0.325);
  //   Mage = Math.ceil((1 - (lvl % 1)) / 0.65);

  //   if (ranged > magic) {
  //       cbtype = 'ranged'
  //       Range = Mage;
  //       Mage = ranged - magic + Range;
  //     } else {
  //       cbtype = 'magic'
  //       Range = magic - ranged + Mage;
  //   }
  // }

  return Math.floor(lvl);
}

module.exports = { fetchOSRSHiscore, fetchRS3Hiscore };