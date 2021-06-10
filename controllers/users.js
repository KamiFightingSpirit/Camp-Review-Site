/*
* Used for all of the logic for each of our user routes
*/
const User = require('../models/user');
//Get registration form
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}
//register new user
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
//render login form
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}
//login
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!');
    //redurects to the page they were on or campgrounds if they directly clicked login
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectURL);
}
//logout
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}