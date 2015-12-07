var express = require('express');
var router = express.Router();
var passport = require('passport')
var usersController = require('../controllers/usersController');
var profilesController = require('../controllers/profilesController');

function authenticatedUser(req, res, next) {
  console.log(req.isAuthenticated())
  // If the user is authenticated, then we continue the execution
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.route('/profiles')
  .get(profilesController.getProfiles)
  .post(profilesController.addProfile)

router.route('/')
  .get(profilesController.getProfiles)
  .post(profilesController.addProfile)

router.route('/profiles/:id')
  .get(profilesController.getProfile)
  .patch(profilesController.updateProfile)
  .delete(profilesController.deleteProfile)

router.route('/profiles/:id/stamps')
  .get(profilesController.getStamps)
  .post(profilesController.addStamp)

router.route('/auth/github')
  .get(passport.authenticate('github'))

router.route('/auth/github/callback')
  .get(passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

router.route('/login')
  .get(usersController.login)

module.exports = router;
