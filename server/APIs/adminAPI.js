const exp = require("express");

const adminApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createAdmin = require("./createAdmin.js");
const UserAuthor = require("../models/userAuthorModel.js");

adminApp.post("/admin", expressAsyncHandler(createAdmin));

adminApp.get(
  "/users",
  expressAsyncHandler(async (req, res) => {
    //read all users
    const listOfUsers = await UserAuthor.find();
    // console.log(listOfUsers)
    res.status(200).send({ message: "users", payload: listOfUsers });
  })
);

adminApp.put(
  "/user/:userid",
  expressAsyncHandler(async (req, res) => {
    const modifiedUser = req.body;
    const dbRes = await UserAuthor.findByIdAndUpdate(
      modifiedUser._id,
      {
        isActive: modifiedUser.isActive,
      },
      {
        returnOriginal: false,
      }
    );
    //send res
    res.status(200).send({ message: "updated", payload: dbRes });
  })
);

module.exports = adminApp;