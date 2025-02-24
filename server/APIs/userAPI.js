const exp = require("express");
const userApp = exp.Router();

const userAuthor = require("../models/userAuthorModel");

const expressAsyncHandler=require("express-async-handler")
const createUserOrAuthor=require('../APIs/createUserOrAuthor')
const Article=require("../models/articleModel")

userApp.post("/user",expressAsyncHandler(createUserOrAuthor))

userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{

    const commentObj=req.body;
    console.log(commentObj,req.params.articleId)

   const articleWithComments= await Article.findOneAndUpdate(
        { articleId:req.params.articleId},
        { $push:{ comments:commentObj}},
        {returnOriginal:false})

        console.log(articleWithComments)

    res.status(200).send({message:"comment added",payload:articleWithComments})

}))
module.exports = userApp;

