var express = require('express');
var jwt = require('jwt-simple');
var app = express();

app.use(require('body-parser').json());

var secretkey = 'mysecretkey';

app.post('/session', function (request, response) {
	var username = request.body.username;
	//Validate password here
	var token = jwt.encode({username: username}, secretkey);

	response.json(token);
})

app.get('/user', function (request, response) {
	var token = request.headers['x-auth'];
	var user = jwt.decode(token, secretkey);
	//Get user info from database here
	response.json(user);
})

app.listen(3000);