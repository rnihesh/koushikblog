const exp = require("express");
const authorApp = exp.Router();

const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");

const {requireAuth}=require("@clerk/express")
require('dotenv').config()

authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));

authorApp.post(
  "/article",
  expressAsyncHandler(async (req, res) => {
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "Article published", payload: articleObj });
  })
);

authorApp.get(
  "/articles",requireAuth({signInUrl:"unauthorized"}),
  expressAsyncHandler(async (req, res) => {
    let listOfArticles = await Article.find();
    res.status(200).send({ message: "articles", payload: listOfArticles });
  })
);

authorApp.get('/unauthorized',(req,res)=>{
  res.send({message:"Unauthorized request plzz ..login"})
})

authorApp.put(
  "/article/:articleId",requireAuth({signInUrl:"unauthorized"}),
  expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const dbRes = await Article.findByIdAndUpdate(
      modifiedArticle._id,
      { ...modifiedArticle },
      { returnoriginal: false }
    );
    res.status(200).send({ message: "Article modified", payload: dbRes });
  })
);

authorApp.put(
    "/articles/:articleId",
    expressAsyncHandler(async (req, res) => {
      const modifiedArticle = req.body;
      const dbRes = await Article.findByIdAndUpdate(
        modifiedArticle._id,
        { ...modifiedArticle },
        { returnoriginal: false }
      );
      res.status(200).send({ message: "Article deleted or restored", payload: dbRes });
    })
  );
module.exports = authorApp;
