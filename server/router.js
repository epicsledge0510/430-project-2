const { models } = require('mongoose');
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);

  app.get('/myPosts', mid.requiresLogin, controllers.Post.getMyPosts);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/app', mid.requiresLogin, controllers.Post.appPage);
  app.post('/app', mid.requiresLogin, controllers.Post.makePost);

  app.post('/newpass', mid.requiresLogin, models.Account.changePassword);
  app.post('/signupPremium', mid.requiresLogin,  models.Account.changePremium);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
