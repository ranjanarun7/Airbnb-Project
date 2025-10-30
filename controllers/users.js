const User = require('../models/user');
module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup');
};

module.exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });
  const registeredUser = await User.register(user, password);
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash('success', 'Welcome to Wanderlust!');
    res.redirect(req.session.returnTo || '/listings');
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.loginUser = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = res.locals.returnTo || '/listings';
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(() => {
    req.flash('success', 'Goodbye!');
    res.redirect('/listings');
  });
};