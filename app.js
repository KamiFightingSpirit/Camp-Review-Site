/* 
* if we are running in the dev environment, permits us access to the .env file's variables
* accessed via process.env.VARIABLE_NAME
*/
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//SET LOCAL PORT
const port = 3000;

//ROUTE VARIABLE DECLARATIONS:
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//CONECT TO MONGODB:
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

//SET UP EJS
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); //gives access to req.body
//METHOD OVERRIDE
app.use(methodOverride('_method'));
//SERVE STATIC FILES
app.use(express.static(path.join(__dirname, 'public'))); //this allows us to reference files in public directory without a relative path
//SETUP SESSION COOKIE
const sessionConfig = {
    secret: 'thisWillChange',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
//SETUP FLASH
app.use(flash());
//SETUP PASSPORT
app.use(passport.initialize());
app.use(passport.session()); //must come after session
passport.use(new LocalStrategy(User.authenticate()));

//how to store and unstore a user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//ROUTE SUFFIXES
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
})

//404 SETUP
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//DEFAULT ERROR HANDLING
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(status).render('error', { err });
})


//TERMINAL CONNECTED MSG
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})
