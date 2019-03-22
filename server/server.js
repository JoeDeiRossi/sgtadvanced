
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
    if (request.body.name === undefined || request.body.course === undefined || request.body.grade === undefined) {
        response.send({
            success: false,
            error: 'invalid name, course, or grade'
        })
        return;
    }
    db.connect( () => {
        const name = request.body.name.split(' ');
        const course = request.body.course;
        const grade = request.body.grade;
        const query = "INSERT INTO `grades` SET `surname` = '" + name.slice(1).join(" ") + "', `given_name` = '" + name[0] + "', `course` = '" + course + "', `grade` = " + grade + ", `added` = NOW()";
        db.query(query, (error, result) => {
            if (!error) {
                response.send({
                    success: true,
                    new_id: result.insertId
                })
            } else {
                response.send({
                    success: false,
                    error
                })
            }
        })
    })
})

server.delete('/api/grades', (request, response) => {
    if (request.query.student_id === undefined) {
        response.send({
            success: false,
            error: 'Must provide a student id for delete'
        });
        return;
    }
    db.connect( () => {
        const query = "DELETE FROM `grades` WHERE `id` = " + request.query.student_id;
        db.query(query, (error, result) => {
            if (!error) {
                response.send({
                    success: true
                })
            } else {
                response.send({
                    success: false,
                    error
                })
            }
        })
    })
})

//In terminal, "npm test" initiates the server, should log the following string
server.listen(3001, ()=> {
    console.log('server is running on port 3001');
})
