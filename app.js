// This line should already exist, but included to help with the context of where to add the code
const express = require("express");

const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://mongo:27017";

// Change this to your own greeting
const MY_MESSAGE = "Hello there visitor, this GIF is for you! Test";


MongoClient.connect(MONGO_URL, (err, db) => {
  if (err) throw err;

  console.log("Database has connected!");
  const gifCollection = db.db("test").collection("gifs");

  // Create our app and configure the view templating engine
  const app = express();
  app.set("view engine", "hbs");
  app.set("views", __dirname + "/views");

  // NOTE - more app setup here, including the .get() and .post()...

  // Add body parsers so our app can read form inputs
  app.use(express.urlencoded({
    extended: true
  }));

  // Add a handler for requests to "/". Simply picks a random image and renders the template.
  app.get("/", async (req, res) => {
  const cursor = gifCollection.aggregate([{ $sample: { size : 1 }}]);
  const data = await cursor.next();
  const imageUrl = (data) ? data.url : "https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif";
  res.render("index", { imageUrl, message: MY_MESSAGE });
  });

  app.post("/add-gif", async (req, res) => {
  const newDocument = { url : req.body.url, default: false };
  await gifCollection.insertOne(newDocument);
  res.redirect("/");
  });

  // Start the webserver on port 3000
  app.listen(3000, () => console.log("Listening on port 3000"));
});

// Some nice cleanup handling to close things down when Docker stops the container
process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());