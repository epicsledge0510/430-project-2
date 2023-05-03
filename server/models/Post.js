const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const PostSchema = new mongoose.Schema({
  //content of post
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  //creator of post
  creator: {
    type: String,
    trim: true,
    required: true,
  },
  //account id the post is tied to 
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  //profile picture of poster
  image:{
    type: String,
    default: "missing",
    required: true,
  },
  //posted date of post
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.static.toAPI = (doc) => ({
  name: doc.name,
});

const PostModel = mongoose.model('Post', PostSchema);
module.exports = PostModel;
