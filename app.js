//installing and requiring all packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connecting to mongodb
mongoose.connect("mongodb://localhost:27017/WikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating mongoDB schema and model
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

////////////////Requests targeting ALL articles///////////////////////
app.route("/articles")
  //chained route handlers - a way to specify what happens to a particular route without mentioning it multiple times
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      };
    });
  }) //no semi-colons!

  .post(function(req, res) {

    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err) {
      if (!err) {
        res.send("Successfully saved a new article!");
      } else {
        res.send(err)
      };
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      };
    });
  });

//////////////////////////Requests targeting SPECIFIC articles///////////////////////////////////
app.route("/articles/:articleTitle")

  .get(function(req, res) {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article with this name found");
      };
    });
  })

  .put(function(req, res) {

    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title,
      content: req.body.content},
      {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article!");
      };
    });
  })

  .patch(function(req,res){
    Aticle.update(
      {title: req.params.articleTitle},
      {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article!");
      }else{
        res.send(err);
      };
    });
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted an article");
      };
    });
  });





app.listen(3000, function() {
  console.log("This server is running on port 3000!")
});
