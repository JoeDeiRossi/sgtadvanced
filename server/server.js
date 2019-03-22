
//Load the express library into the file
const express = require('express');
const mysql = require('mysql');
const mysqlcredentials = require('./mysqlcreds.js');

const db = mysql.createConnection(mysqlcredentials);

const server = express();

//Tells express to look for an index.html file in the specified directory (__dirname points to current folder, server)
server.use(express.static(__dirname + '/html'));
server.use(express.urlencoded({extended: false}));

server.get('/api/grades', (req, res) => {
    db.connect( () => {
        const query = 'SELECT `id`, CONCAT(`given_name`, " ", `surname`) AS `name`, `course`, `grade` FROM `grades`';
        db.query(query, (error, data) => {
            const output = {
                success: false
            }
            if (!error) {
                output.success = true;
                output.data = data;
            } else {
                output.error = error;
            }
            res.send(output);
        })
    })
})

server.post('/api/grades', (request, response) => {
    
})

//In terminal, "npm test" initiates the server, should log the following string
server.listen(3001, ()=> {
    console.log('server is running on port 3001');
})
