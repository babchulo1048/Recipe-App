const express = require("express");
const mongoose = require("mongoose");
const { AdminRouter } = require("./routers/admins");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/admin", AdminRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/eyu_recipe")
  .then(() => console.log("mongodb connected"))
  .catch((ex) => console.error(ex));

app.listen(3001, () => {
  console.log("server listen to port 3001");
});
