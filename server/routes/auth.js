const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	if (!email || !password || !name) {
		return res.status(422).json({ error: 'please add all fields' });
	}
	User.findOne({ email: email })
		.then((savedUser) => {
			if (savedUser) {
				return res.status(422).json({ error: 'user exist' });
			}

			bycrypt
				.hash(password, 8)
				.then((hashedPassword) => {
					const user = new User({ email, password: hashedPassword, name });

					user
						.save()
						.then(() => {
							res.json({ message: 'saved successfully' });
						})
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

router.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(422).json({ message: 'Please add email or password' });
	}

	User.findOne({ email })
		.then((savedUser) => {
			if (!savedUser) {
				return res.status(422).json({ error: 'Invalid Email or Password' });
			}

			bycrypt
				.compare(password, savedUser.password)
				.then((doMatch) => {
					if (doMatch) {
						// res.json({ message: 'successfully signin' });
						const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
						const { _id, name, email } = savedUser;
						res.json({ token, user: { _id, name, email } });
					} else {
						return res.status(422).json({ error: 'Invalid Email or Password' });
					}
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

module.exports = router;
