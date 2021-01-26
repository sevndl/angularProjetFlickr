var express = require("./FlickrPhotoSearchAPI/node_modules/express");
var mongo = require("./FlickrPhotoSearchAPI/node_modules/mongoose");
var bodyParser = require("./FlickrPhotoSearchAPI/node_modules/body-parser"); 
var cors = require("./FlickrPhotoSearchAPI/node_modules/cors");
var app = express();
const PORT = 7000;
const LOCAL_DB = "mongodb://localhost:27017";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

var imageSchema = mongo.Schema({
  tag: String,
  url: [{type: String}],
  auteur: [{type: String}],
  titre: [{type: String}],
  datepost: [{type: String}]
});
var Image = mongo.model('Image', imageSchema, 'images');

var db = mongo.connect(LOCAL_DB, (err) => {
  if (err) { console.log(err); }
  else { console.log('Connecté à mongodb localement.'); }
});

app.get("/images", async (req, res) => {
  await Image.find((err, images) => {
    if (err) { console.log(err); }
    else { res.json(images); }
  });
});

app.get("/images/:tag", async (req, res) => {
  await Image.find({ tag: req.params.tag }, (err, images) => {
    if (err) { console.log(err); }
    else { res.json(images); }
  });
});

app.post("/images", async (req, res) => {
  var image = new Image();
  image.tag = req.body.tag;
  image.url = req.body.url;
  image.auteur = req.body.auteur;
  image.titre = req.body.titre;
  image.datepost = req.body.datepost;
  await image.save((err) => {
    if (err) { res.send(err); }
    else { res.send("Nouveau set d'images ajouté à la base"); }
  })
});

app.listen(PORT);