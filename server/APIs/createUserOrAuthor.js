const UserAuthor = require("../models/userAuthorModel");
const Admin = require("../models/adminModel");

async function createUserOrAuthor(req, res) {
  //business logic to create User or Author
  //get user or author object from req
  const newUserAuthor = req.body;
  //find user by email id
  const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });
  const isAdmin = await Admin.findOne({ email: newUserAuthor.email });
  //if user or author existed
  if (userInDb !== null) {
    //check with role
    if (newUserAuthor.role === userInDb.role) {
      res.status(200).send({ message: newUserAuthor.role, payload: userInDb });
    } else {
      res.status(200).send({ message: "Invalid Role" });
    }
  } else {
    if (isAdmin !== null) {
      res.status(200).send({ message: "Admin can't be user/author" });
    } else {
      let newUser = new UserAuthor(newUserAuthor);
      let newUserorAuthorDoc = await newUser.save();
      res
        .status(201)
        .send({
          message: newUserorAuthorDoc.role,
          payload: newUserorAuthorDoc,
        });
    }
  }
}

module.exports = createUserOrAuthor;