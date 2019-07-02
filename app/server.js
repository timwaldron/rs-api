const rsapi = require("./rsapi.js");
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 5000;

// Serve static files from the React frontend app

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
})

// app.use(express.static(__dirname, 'client/build')); // Anything that doesn't match the above, send back index.html
// //app.use(express.static("public"));
// app.use(express.json());
// app.use(cors());

// app.use((req, res, next) => {
//   console.log("LOG:", req.method, req.path, req.ip);
//   next();
// });

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/views/index.html");
// });

// app.get("/about", (req, res) => {
//   res.sendFile(__dirname + "/views/about.html");
// });

// app.get("/docs", (req, res) => {
//   res.sendFile(__dirname + "/views/docs.html");
// });

// app.get("/examples", (req, res) => {
//   res.sendFile(__dirname + "/views/examples.html");
// });

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
      res.json({"error": `'${req.params.game}' is an invalid gametype`});
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
      res.json({"error": `'${req.params.game}' is an invalid gametype`});
      return;
  }

  res.json({url: apiList.osrsHiscores});
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
