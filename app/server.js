const rsapi = require("./rsapi.js");
const express = require("express");
const forceSsl = require('force-ssl-heroku');
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const REQUIRE_SSL = process.env.REQUIRE_SSL || false;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

if (REQUIRE_SSL.toString() == "true") {
  console.log("Forcing SSL");
  app.use(forceSsl);
}

app.use((req, res, next) => {
  console.log("LOG:", req.method, req.path, req.ip);
  next();
});

app.get("/", (req, res) => {
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
      rsapi.fetchOSRSHiscore(params).then((result) => res.json(result));
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
        rsapi.fetchOSRSHiscore(params).then((result) => res.json(result));
      return;

    case "rs3":

      break;

    default:
      res.json({"error": `'${req.params.game} is an invalid gametype`});
      return;
  }

  res.json({url: apiList.osrsHiscores});
})

app.listen(PORT, () => console.log("Server listing on port " + PORT + "..."));