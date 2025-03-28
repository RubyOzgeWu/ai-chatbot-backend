import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import users from "../models/users.js";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "account",
      passwordField: "password",
    },
    async (account, password, done) => {
      try {
        const user = await users.findOne({ account });
        if (!user) {
          return done(null, false, { message: "Account does not exist." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Wrong password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
      ignoreExpiration: true,
    },
    async (req, payload, done) => {
      const expired = payload.exp * 1000 < Date.now();
      if (
        expired &&
        req.originalUrl !== "/api/users/extend" &&
        req.originalUrl !== "/api/users/logout"
      ) {
        return done(null, false, { message: "Please login again." });
      }
      const token = req.headers.authorization.split(" ")[1];
      try {
        const user = await users.findById(payload._id);
        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }
        if (user.tokens.indexOf(token) === -1) {
          return done(null, false, { message: "Failed to authenticate." });
        }
        return done(null, { user, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
