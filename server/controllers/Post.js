const models = require('../models');

const { Post } = models;

const appPage = (req, res) => res.render('app');

const makePost = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'text is required!' });
  }
  const postData = {
    name: req.body.name,
    creator: req.session.account.username,
    image: req.session.account.pfp,
    owner: req.session.account._id,
  };
  try {
    if(postData.name){}
    const newPost = new Post(postData);
    newPost.save();
    return res.status(201).json({ name: newPost.name, creator: newPost.creator, image: newPost.image });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists' });
    }
    return res.status(500).json({ error: 'An error occured making post!' });
  }
};

const getPosts = async (req, res) => {
  try {
    const query = { };
    const docs = await Post.find(query).select('name creator image').lean().exec();
    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Post.find(query).select('name creator image').lean().exec();

    return res.json({ posts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

module.exports = {
  appPage,
  makePost,
  getPosts,
  getMyPosts
};
