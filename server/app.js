const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const { MONGOURI } = require('./keys');

mongoose.connect(MONGOURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
	console.log('connected to mongodb');
});
mongoose.connection.on('error', (error) => {
	console.log(error);
});

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);
