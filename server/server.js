const exp = require("express");
const app = exp();
require("dotenv").config();
const mongoose = require("mongoose");
const userApp = require("./APIs/userAPI");
const adminApp = require("./APIs/adminAPI");
const authorApp = require("./APIs/authorAPI");
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.DBURL)

  .then(() => {
    app.listen(port, () => console.log("Connected to server", port));
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Error in db connection", err);
  });

app.use(exp.json());
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);

app.use((err, req, res, next) => {
  console.log("err object in express error handler:", err);
  res.send({ message: err.message });
});
