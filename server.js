var express = require('express');
var jwt = require('jwt-simple');
var app = express();

var _ = require('lodash');
var bcrypt = require('bcrypt');

app.use(require('body-parser').json());

var secretkey = 'mysecretkey';
var users = [{username: 'tomi' , password: '$2a$10$C503Ai1d7CDQ8mvLSYhqsOcPLvZCezEu85ZfwpHsFLYvD4oVTvtAW'}]

function findUserByUsername (username) {
	return _.find(users, {username: username});
}

function validateUser (user, password, callback) {
	bcrypt.compare(password, user.password, callback);
	//return user.password === password;
}


app.post('/session', function (request, response) {
	var user = findUserByUsername(request.body.username);
	validateUser(user, request.body.password, function (error, valid) {
		if (error || !valid) {
			response.status(401);
			return response.send("Authentication unsuccessful");
		}
		var token = jwt.encode({username: user.username}, secretkey);
		response.json(token);
	});
})

app.get('/user', function (request, response) {
	var token = request.headers['x-auth'];
	var user = jwt.decode(token, secretkey);
	//Get user info from database here
	response.json(user);
})

app.listen(3000);