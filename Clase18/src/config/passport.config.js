import local from 'passport-local';
import passport from 'passport';
import { UserModel } from '../dao/mongo/models/users.model.js';
import { createHash, isValidPassword } from '../Utils/validations.js';
import fetch from 'node-fetch';
import GitHubStrategy from 'passport-github2';
import { entorno } from '../config.js';
import { logger } from '../Utils/logger.js';
import CustomError from '../services/errors/custom-error.js';
import EErros from '../services/errors/enum.js';
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: entorno.GITHUB_CLIENTID,
        clientSecret: entorno.GITHUB_CLIENTSECRET,
        callbackURL: entorno.GITHUB_CALLBACKURL,
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(
              CustomError.createError({
                name: 'Github Passport User Email Error',
                cause: 'Please contact development team',
                message: e,
                code: EErros.GITHUB_VALID_EMAIL_ERROR,
              })
            );
          }
          profile.email = emailDetail.email;

          let user = await UserModel.findOne({ email: profile.email }); //ROMINA! handle when MEMORY is runnning, create users.memory.js
          //let user;
          if (!user) {
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              user: 'user',
              password: 'nopass',
            };
            let userCreated = await UserModel.create(newUser); //ROMINA! handle when MEMORY is runnning, create users.memory.js
            return done(null, userCreated);
          } else {
            return done(null, user);
          }
        } catch (e) {
          return done(
            CustomError.createError({
              name: 'Github Passport Error',
              cause: 'Please contact development team',
              message: e,
              code: EErros.GITHUB_PASSPORT_ERROR,
            })
          );
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username }); //ROMINA! handle when MEMORY is runnning, create users.memory.js
          //const user = '';
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age } = req.body;
          let user = await UserModel.findOne({ email: username }); //ROMINA! handle when MEMORY is runnning, create users.memory.js
          //let user;
          if (user) {
            logger.debug(`passport register user already exists`);
            return done(null, false);
          }
          const newUser = {
            email: username,
            firstName,
            lastName,
            age,
            isAdmin: false,
            password: createHash(password),
          };
          let userCreated = await UserModel.create(newUser); //ROMINA! handle when MEMORY is runnning, create users.memory.js
          //let userCreated;
          logger.debug(
            `passport User Registration succesful userCreated: ${userCreated}`
          );
          return done(null, userCreated);
        } catch (e) {
          logger.error(`passport Error in register : ${e}`);
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id); //ROMINA! handle when MEMORY is runnning, create users.memory.js
    //let user = 'dummy';
    done(null, user);
  });
}
