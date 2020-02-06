import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions
} from "passport-jwt";
import {
  Strategy as LocalStrategy,
  IStrategyOptionsWithRequest,
  VerifyFunctionWithRequest,
  IVerifyOptions
} from "passport-local";
import passport = require("passport");
import { UserModel, User } from "../model/user";

const options: StrategyOptions = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(
  new JWTStrategy(options, function(payload, done) {
    try {
      //Pass the user details to the next middleware
      return done(null, payload.user);
    } catch (error) {
      done(error);
    }
  })
);

const localStrategyOptions: IStrategyOptionsWithRequest = {
  passReqToCallback: true,
  usernameField: "email",
  passwordField: "password"
};

passport.use("signup", new LocalStrategy(localStrategyOptions, signup));

passport.use("login", new LocalStrategy(localStrategyOptions, login));

async function signup(
  req: Express.Request,
  email: string,
  password: string,
  done: (error: any, user?: any, options?: IVerifyOptions) => void
) {
  try {
    const user = await UserModel.create({ email, password });
    return done(null, user);
  } catch (err) {
    done(err);
  }
}

async function login(req: Express.Request, email, password, done) {
  try {
    const user = (await UserModel.findOne({ email })) as User;
    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    const validate = await user.isValidPassword(password);
    if (!validate) {
      return done(null, false, { message: "Wrong Password" });
    }
    //Send the user information to the next middleware
    return done(null, user, { message: "Logged in Successfully" });
  } catch (err) {
    return done(err);
  }
}

export default passport;
