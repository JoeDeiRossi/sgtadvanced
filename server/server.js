//load the express library into the file
const express = require('express');

const server = express();

server.use(express.static(__dirname + '/html'));

var insults = [
    'Your father smelt of elderberries',
    'You program on an altaire',
    'I bet you still use var',
    'One line functions are for chumps'
]

//2 arguments: the path to listen for, AND the callback function to call once that path has been received
server.get('/', function(request, response) {
    //an object representing all of the data coming from the client to the server
    //an object representing all of the data going from the server to the client
    response.send('Hello, World.');
});

server.get('/time', (request, response) => {
    var now = new Date();
    response.send(now.toLocaleDateString());
})

server.get('/insult', (request, response) => {
    var randomIndex = Math.floor(Math.random() * insults.length);
    var randomInsult = insults[randomIndex];
    response.send(randomInsult);
})





server.listen(3001, ()=> {
    //console.log('server is running on port 3001');
    console.log('carrier has arrived');
})