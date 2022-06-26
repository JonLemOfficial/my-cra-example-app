const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require("passport-jwt");
const { Strategy: LocalStrategy } = require("passport-local");
const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');
const { users, /* Tokens */ } = require('./../../config/db/models');

const jwtCookieExtractor = /* async */ ( req ) => {
  let refreshToken = null;
  if ( req && req.cookies ) {
    refreshToken = req.cookies['jwt'] || null;
  }
  
  return refreshToken;

  // if ( !refreshToken ) {
  //   return refreshToken;
  // } else {
  //   try {
  //     const { dataValues: foundToken } = await Tokens.findOne({ where: { token: refreshToken } });
  //     if ( !foundToken ) return null; //Forbidden 
  //     console.log('Printing refreshToken:', foundToken.token);
  //     return foundToken.token;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

};

module.exports = function (passport) {
  
  passport.use('refresh_token', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([ jwtCookieExtractor ]),
    // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'my-cra-app'
  }, async ( jwtPayload, done ) => {

    try {
      const { dataValues: user } = await users.findOne({
        where: {
          id: jwtPayload.id
        }
      });

      if ( user ) {
        let { id, username, fullname, email } = user;
        return done(null, { id, username, fullname, email });
      }
      
      return done(null, false);
    } catch (err) {
      done(err, false);
    }
  }));

  passport.use('access_token', new JWTStrategy({
    // jwtFromRequest: ExtractJWT.fromExtractors([ jwtCookieExtractor ]),
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'my-cra-app-accs',
    ignoreExpiration: false
  }, async ( jwtPayload, done ) => {
    
    try {
      const { dataValues: user } = await users.findOne({
        where: {
          id: jwtPayload.id
        }
      });

      if ( user ) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  }));

  passport.use("local", new LocalStrategy({
    usernameField: "username",
    passwordField: "password"
  }, async ( username, password, done) => {

    const info = {
      wrongUserOrPass: { type: 'error', msg: 'Wrong username or password' },
      databaseConnectionError: { type: 'error', msg: 'Could not connect to database' },
      success: { type: 'success', msg: 'Log in successfully'}
    };

    try {
      const user = await users.findOne({
        where: {
          [Op.or]: [
            { username },
            { email: username }
          ]    
        }
      });

      if ( user ) {
        if ( bcryptjs.compareSync(password, user.dataValues.password) ) {
          let { id, username, fullname, email } = user.dataValues;
          done(null, { id, username, fullname, email }, info.success);
        } else {
          done(null, false, info.wrongUserOrPass);
        }
      } else {
        done(null, false, info.wrongUserOrPass);
      }
    } catch ( err ) {
      done(null, false, info.databaseConnectionError);
    }
  
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const { dataValues: { username, fullname, email } } = await users.findByPk(id);
    
    done(null, {
      id,
      username,
      fullname,
      email
    });
  });

  return passport;
}