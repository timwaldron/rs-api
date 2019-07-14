const rsapi = require("./utils/rsapi");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'))
});

app.get("/api/:game/:username", (req, res) => {

  let params = {
    game: req.params.game.toLowerCase(),
    category: "main",
    username: req.params.username.toLowerCase().replace(" ", "_"),
  }

  switch(params.game) {
    case "osrs":
      rsapi.fetchOSRSHiscore(params).then((result) => res.status(200).json(result));
      return;

    case "rs3":
      rsapi.fetchRS3Hiscore(params).then((result) => res.status(200).json(result))
      break;

    default:
      res.json({"error": `'${req.params.game}' is an invalid gametype`});
      return;
  }

  // res.json({url: apiList.osrsHiscores});
});

app.get("/api/raw/:game/:username", (req, res) => {
  console.log("Hit the /api/raw endpoint!");

  let params = {
    game: req.params.game.toLowerCase(),
    category: "main",
    username: req.params.username.toLowerCase().replace(" ", "_"),
  }

  switch(params.game) {
    case "osrs":
      rsapi.fetchOSRSHiscore(params, true).then((result) => res.json(result));
      return;

    case "rs3":
      break;

    default:
      res.json({"error": `'${req.params.game}' is an invalid gametype`});
      return;
  }

  res.json({url: apiList.osrsHiscores});
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
