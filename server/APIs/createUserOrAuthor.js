const userAuthor = require("../models/userAuthorModel");
const UserAuthor = require("../models/userAuthorModel");

async function createUserOrAuthor(req, res) {
  const newUserAuthor = req.body;

  const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });
  if (userInDb != null) {
    if (newUserAuthor.role == userInDb.role) {
      res.status(200).send({ message: newUserAuthor.role, payload: userInDb });
    } else {
      res.status(200).send({ message: "Invalid role" });
    }
  } else {
    let newUser = new userAuthor(newUserAuthor);
    let newUserorAuthorDoc = await newUser.save();
    res
      .status(201)
      .send({
        message:  newUserorAuthorDoc.role ,
        payload:  newUserorAuthorDoc ,
      });
  }
}

module.exports = createUserOrAuthor;
