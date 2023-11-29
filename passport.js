// passport.js
import passport from "passport";
import { usersManager } from "./dao/managersDB/usersManager.js";
import { usersModel } from "./dao/models/users.model.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { compareData, hashData } from "./utils.js";



// LOCAL

passport.use(
  'signup',
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;
      if (!first_name || !last_name || !email || !password) {
        return done(null, false);
      }
      try {
        const existingUser = await usersManager.findByEmail(email);
        if (existingUser) {
          return done(null, false, { message: 'Ya existe un usuario con ese email' });
        }
        const hashedPassword = await hashData(password);
        const createdUser = await usersManager.createOne({
          ...req.body,
          password: hashedPassword,
        });
        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      console.log('1 strategy called');
      if (!email || !password) {
        return done(null, false, { message: 'Campos incorrectos' });
      }

      try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          let role = "admin";
          return done(null, { email, role });
        }

        const user = await usersManager.findByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
          console.log('5 strategy called');
          return done(null, false, { message: 'Contraseña no válida' });
        }
        let role = "usuario";
        return done(null, { email, first_name: user.first_name, role });
        //return done(null, user)
      } catch (error) {
        return done(error);
      }
    }
  )
);


// GITHUB

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: "Iv1.fb6f4779cfcdb4fc",
      clientSecret: "94355f8df58f2db65aafc5a583f57400769f118c",
      callbackURL: "http://localhost:8080/api/sessions/callback",
      scope: ["user:email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //console.log('Paso 1: GitHub strategy called');

        //const userDB = await usersManager.findByEmail(profile.emails[0].value);

        const userDB = await usersManager.findByEmail(profile._json.email);


        if (userDB) {
          if (userDB.isGithub) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }

        const infoUser = {
          first_name: profile._json.name.split(' ')[0],
          last_name: profile._json.name.split(' ')[1],
          email: profile._json.email,
          password: "ads12c1h%/123DS13*çs",
          isGithub: true,
        };

        const createdUser = await usersManager.createOne(infoUser);
        return done(null, createdUser);
      } catch (error) {
        console.error('Error en la estrategia de GitHub:', error);
        return done(error);
      }
    }
  )
);



// SERIALIZE && DESERIALIZE

passport.serializeUser((user, done) => {
  console.log('Serialize User:', user);
  done(null, { email: user.email, first_name: user.first_name , last_name: user.last_name , role: user.role });
});


passport.deserializeUser(async (serializedUser, done) => {
  //console.log('Deserialize User:', serializedUser);
  try {
    const foundUser = await usersManager.findByEmail(serializedUser.email);
    if (!foundUser) {
      return done(null, false);
    }

    return done(null, foundUser);
  } catch (error) {
    done(error);
  }
});
