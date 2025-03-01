// const exp = require("express");
// const app = exp();
// require("dotenv").config();
// const mongoose = require("mongoose");
// const userApp = require("./APIs/userAPI");
// const adminApp = require("./APIs/adminAPI");
// const authorApp = require("./APIs/authorAPI");
// const cors = require("cors");
// app.use(cors());
// app.set("trust proxy", true);
// const port = process.env.PORT || 4000;

// app.get("/", (req, res) => {
//   res.send("koushikvlog API is running");
// });

// mongoose
//   .connect(process.env.DBURL)

//   .then(() => {
//     app.listen(port, "0.0.0.0", () => console.log("Connected to server", port));
//     console.log("Database connection successful");
//   })
//   .catch((err) => {
//     console.log("Error in db connection", err);
//   });

// app.use(exp.json());
// app.use("/user-api", userApp);
// app.use("/author-api", authorApp);
// app.use("/admin-api", adminApp);

// app.use((err, req, res, next) => {
//   console.log("err object in express error handler:", err);
//   res.send({ message: err.message });
// });



const exp = require("express");
const app = exp();
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const userApp = require("./APIs/userAPI");
const adminApp = require("./APIs/adminAPI");
const authorApp = require("./APIs/authorAPI");
const cors = require("cors");

app.use(cors());
app.set("trust proxy", true);
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("koushikvlog API is running");
});

// Connect to MongoDB
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(port, "0.0.0.0", () => console.log("Connected to server", port));
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Error in db connection", err);
  });

app.use(exp.json());

// API Routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);

// Serve React Frontend
app.use(exp.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.log("Error object in express error handler:", err);
  res.status(500).send({ message: err.message });
});
