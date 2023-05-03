const models = require('../models');
const bcrypt = require('bcrypt');

const {
  Account
} = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({
      error: 'All fields are required!'
    });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password!'
      });
    }

    req.session.account = Account.toAPI(account);

    return res.json({
      redirect: '/app'
    });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({
      error: 'All fields are required!'
    });
  }

  if (pass !== pass2) {
    return res.status(400).json({
      error: 'Passwords do not match!'
    });
  }
  const pfpImg = Math.floor(Math.random()*5);
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({
      username,
      password: hash,
      isPremium: false,
      pfp: pfpImg
    });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({
      redirect: '/app'
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Username already in use'
      });
    }
    return res.status(500).json({
      error: 'An error occured!'
    });
  }
};


module.exports = {
  loginPage,
  login,
  logout,
  signup,
};