const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const { Op } = require('sequelize')
const { messages, users, tokens } = require('../config/db/models');

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({ msg: "API Working" });
});

apiRouter.get('/chat', passport.authenticate('access_token'), (req, res) => {
  res.json({
    msg: "Welcome to the chat, select one of your contacts to start chatting."
  });
});

apiRouter.get('/settings', passport.authenticate('access_token'), (req, res) => {
  res.json({
    msg: "This is the settings page"
  });
});

apiRouter.get('/refresh', (req, res) => {

  const authenticate = passport.authenticate('refresh_token', { session: false }, async ( err, user, info ) => {

    if ( !user || err ) {
      if ( req.cookies['jwt'] && info.name === 'TokenExpiredError' ) {
        try {
          const { dataValues: foundToken } = await tokens.findOne({ where: { token: req.cookies['jwt'] } });
          if ( foundToken ) {
            tokens.update({ status: 'expired', closed_at: new Date(Date.now()) }, {
              where: { token: foundToken.token }
            });
            res.clearCookie('jwt', {
              httpOnly: true,
              path: '/',
              secure: process.env.NODE_ENV === 'production' ? true : false
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
      return res.json({
        isAuthenticated: false,
        error: { hasError: true, ...info }
      });
    }

    req.logIn(user, err => {
      if ( err ) throw err;
      const accessToken = jwt.sign(user, 'my-cra-app-accs', { expiresIn: '60s' });
      
      res.json({
        isAuthenticated: true,
        accessToken,
        user
      });
    });
  });

  authenticate(req, res);
});

apiRouter.post("/login", (req, res) => {

  const authenticate = passport.authenticate('local', { session: false }, ( err, user, info ) => {
    if ( !user || err ) {
      return res.json({
        isAuthenticated: false,
        error: { hasError: true, ...info }
      });
    }
    req.logIn(user, err => {
      if ( err ) throw err;
      const refreshToken = jwt.sign(user, 'my-cra-app', {
        expiresIn: req.body.rememberMe ? '90d' : '7d'
      });
      const accessToken = jwt.sign(user, 'my-cra-app-accs', { expiresIn: '2h'});
      tokens.create({
        token: refreshToken,
        type: 'authentication',
        expires_in: new Date(Date.now() + (1000 * 60 * 60 * 24 * (req.body.rememberMe ? 365 : 1) )),
        extended: req.body.rememberMe ? true : false,
        status: 'opened',
        generated_by: user.id,
        sent_as: 'cookie'
      });
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        path: '/',
        ...process.env.NODE_ENV === 'production' ? { sameSite: 'None' } : {},
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 1000 * 60 * 60 * 90  // 90 days
      });
      return res.json({
        info,
        accessToken,
        user
      });
    })
  });

  authenticate(req, res);
});

// apiRouter.post("/register", async (req, res) => {

//   const {
//     fullname,
//     username,
//     email,
//     password
//   } = req.body;

//   try {
//     const user = await users.findOne({
//       where: {
//         [Op.or]: [
//           { username },
//           { email }
//         ]    
//       }
//     });

//     if ( !user ) {
//       let hashedPassword = bcryptjs.hashSync(
//         password,
//         bcryptjs.genSaltSync(10)
//       );
      
//       let newUser = await users.create({
//         fullname,
//         username,
//         email,
//         password: hashedPassword,
//         role: 'client'
//       });

//       res.json({
//         newUser
//       });
//     } else {
//       // throw 'user exists' error
//       res.json({
//         error: {
//           hasError: true,
//           msg: 'Registry failed, User already exists',
//         }
//       });
//     }
//   } catch ( err ) {
//     console.log(err);
//   }
// });

apiRouter.get('/logout', (req, res) => {
  
  let refreshToken = null;
  if ( req && req.cookies ) {
    refreshToken = req.cookies['jwt'] || null;
  }
  tokens.update({ status: 'closed', closed_at: new Date(Date.now()) }, {
    where: {
      token: refreshToken
    }
  });
  res.clearCookie('jwt', { httpOnly: true, path: '/', secure: false });
  res.sendStatus(204);
});

apiRouter.get('/contacts/:id', async (req, res) => {
  const contacts = await users.findAll({
    where: {
      id: {
        [ Op.not ]: req.params.id
      }
    },
    attributes: [
      'id',
      'username'
    ]
  });

  console.log(contacts);

  res.json(contacts);

});

apiRouter.get('/messages', async (req, res) => {
  const { from, to } = req.query;
  const msgs = await messages.findAll({
    where: {
      author: {
        [Op.or]: [ from, to ]
      },
      receiver: {
        [Op.or]: [ from, to ]
      }
    }
  });

  res.json(msgs);

});

apiRouter.post('/messages/add', async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messages.create({
      message,
      author: from,
      receiver: to,
    });

    if ( data ) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
});

module.exports = apiRouter;
