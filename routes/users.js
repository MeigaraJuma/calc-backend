const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Hist = require('../models/history')

/* ===============================  U S E R     R O U T E S   ===============================*/

// Sign Up
router.post('/signup', (req, res, next) => {
    const usernameExist = req.body.username;

    let newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    User.getUserByUsername(usernameExist, (err, user) => {
        if (err) throw err;
        if (!user) {

            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to sign up' });
                } else {
                    res.json({ success: true, msg: 'User registered' });
                }
            });
        } else {
            return res.json({ success: false, msg: 'Username already exist!' })
        }
    });
});

// Authenticate user
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 86400 // expires in 1 day
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user.id,
                        username: user.username,
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong Password' });
            }
        });
    });
});

// Get user data
router.get('/calculator', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

/* ==============================  H I S T O R Y     R O U T E S   ==============================*/

// Read all calculation history
router.get('/history', (req, res, next) => {

    Hist.getAllHistory({}, (err, history) => {
        if (err) throw err;
        if (history) {
            res.json({ history: history });
        }
    })
});

// Find history by the id
router.get('/history/:id', (req, res, next) => {
    const ID = req.params.id;

    Hist.getHistoryById(ID, (err, id) => {
        if (err) throw err;
        if (id) {
            return res.json({ id });
        }
    });
});

// Create history when clear button on calculator pressed
router.post('/history', (req, res, next) => {
    let newHistory = new Hist(
        {
            id: req.body.id,
            history: req.body.history
        }
    );

    Hist.addHistory(newHistory, (err, history) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to add history' });
        } else {
            res.json({ success: true, msg: 'History added' });
        }
    });
});

// Update / edit history
router.put('/history/:id', (req, res, next) => {
    const ID = req.params.id;
    bool = true;
    let history = req.body.history;

    Hist.updateHistory(ID, history, bool, (err, history) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to add history' });
        } else {
            res.json({ success: true, msg: 'History updated' });
        }
    });
});

// Delete history by id
router.delete('/history/:id', (req, res, next) => {
    const ID = req.params.id;

    Hist.deleteHistoryById(ID, (err, id) => {
        if (err) throw err;
        if (id) {
            return res.json({ msg: 'Deleted history id : ', id: id });
        }
    });
});

// Delete all history
router.delete('/history/', (req, res, next) => {

    Hist.deleteAllHistory({}, (err, history) => {
        if (err) throw err;
        if (history) {
            return res.json({ msg: 'All history deleted' });
        }
    });
});

module.exports = router;
