import * as express from "express";
import auth from "./auth/auth";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as jwt from "jsonwebtoken";
import * as mongoose from "mongoose";
import { TaskModel } from "./model/task";
import { User } from "./model/user";

require("dotenv").config();

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true
});
mongoose.connection.on("error", error => console.log(error));

const app = express();

app.use(bodyParser.json());
app.use(auth.initialize());

app.get("/", (req, res) => res.send("hello world"));

app.get("/tasks", auth.authenticate("jwt", { session: false }), async function(
  req,
  res,
  next
) {
  const user = req.user as User;

  const tasks = await TaskModel.find({ user: user._id });
  res.json(tasks);
});

app.post("/tasks", auth.authenticate("jwt", { session: false }), async function(
  req,
  res,
  next
) {
  const user = req.user as User;

  const { title, lane } = req.body;

  const task = await TaskModel.create({ title, lane, user });
  task.save();

  res.statusCode = 201;
  res.end();
});

app.delete(
  "/tasks/:id",
  auth.authenticate("jwt", { session: false }),
  async function(req, res, next) {
    const user = req.user as User;

    const { id } = req.params;

    const task = await TaskModel.deleteOne({ _id: id, user });

    res.statusCode = 204;
    res.end();
  }
);

app.post(
  "/signup",
  auth.authenticate("signup", { session: false }),
  async function(req, res, next) {
    res.json({
      success: true
    });
  }
);

app.post("/login", async (req, res, next) => {
  auth.authenticate("login", async (err, user, info) => {
    try {
      if (!user) {
        return res.json({
          message: "user doesnt fucking exist"
        });
      }
      if (err || !user) {
        console.log(err, user);
        const error = new Error("An Error occurred");
        return next(error);
      }
      req.login(user, { session: false }, async error => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, process.env.SECRET);
        //Send back the token to the user
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

app.listen(process.env.PORT || 3000, () => console.log("🚀 Listening!"));
