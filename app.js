const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listeningsRoutes = require('./routes/listings');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const port = 3000;
const dbUrl = process.env.MONGO_URI;

// Connect to MongoDB Atlas
main().catch(err => console.log("❌ MongoDB connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB (Atlas)");
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 3600 // Time period in seconds
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,  
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

/* app.get('/demouser', async (req, res) => {
  const user = new User({ username: 'demouser', email: 'demouser@example.com' });
  let registeredUser = await User.register(user, 'password');
  res.send('Demo user created', registeredUser);
}); */

// Use the routes
app.use('/listings', listeningsRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong' } = err;
  res.render('error', { err });
  //res.status(status).send(message);
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
}); 
