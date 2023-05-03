/* This file defines our schema and model interface for the account data.

   We first import bcrypt and mongoose into the file. bcrypt is an industry
   standard tool for encrypting passwords. Mongoose is our tool for
   interacting with our mongo database.
*/
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

/* When generating a password hash, bcrypt (and most other password hash
   functions) use a "salt". The salt is simply extra data that gets hashed
   along with the password. The addition of the salt makes it more difficult
   for people to decrypt the passwords stored in our database. saltRounds
   essentially defines the number of times we will hash the password and salt.
*/
const saltRounds = 10;

let AccountModel = {};

/* Our schema defines the data we will store. A username (string of alphanumeric
   characters), a password (actually the hashed version of the password created
   by bcrypt), and the created date.
*/
const AccountSchema = new mongoose.Schema({
  //username of the user
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  //password of the user
  password: {
    type: String,
    required: true,
  },
  //credit card number of the user
  creditCardNumber: {
    type: String,
    default: "0000000000000000",
    required: true,
  },
  //premium status of the user
  isPremium:{
    type: Boolean,
    default: false,
    required: true
  },
  //profile picture of the user
  pfp:{
    type: String,
    default: "missing",
    required: true,
  },
  //date user was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  isPremium: doc.isPremium,
  pfp: doc.pfp,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

/* Helper function for authenticating a password against one already in the
   database. Essentially when a user logs in, we need to verify that the password
   they entered matches the one in the database. Since the database stores hashed
   passwords, we need to get the hash they have stored. We then pass the given password
   and hashed password to bcrypt's compare function. The compare function hashes the
   given password the same number of times as the stored password and compares the result.
*/
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }
    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountSchema.statics.changePassword = async (req, res) => {
  username = req.session.account.username;
  pass = `${req.body.pass}`;
  pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }
  if (pass !== pass2) {
    return res.status(400).json({
      error: 'Passwords do not match'
    });
  }
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const hash = await bcrypt.hash(pass, saltRounds);
    doc.password = hash;
    doc.save();
  } catch (err) {
    return callback(err);
  }
};

AccountSchema.statics.changePremium = async (req, res) => {
  const username = req.session.account.username;
  const cardNumbers = `${req.body.cardNumber}`;
  if (!cardNumbers) {
    return res.status(400).json({
      error: 'Card details are required'
    });
  }
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const hash = await bcrypt.hash(cardNumbers, saltRounds);
    doc.creditCardNumber = hash;
    doc.isPremium = true;
    doc.save();
  } catch (err) {
    return callback(err);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
