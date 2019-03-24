
//Load the express library into the file
const express = require('express');
//Load the mysql library into the file
const mysql = require('mysql');
//Load the credentials from a local file for mysql
const mysqlcredentials = require('./mysqlcreds.js');
//Using the credentials that we loaded, establish a PRELIMINARY connection to the database
const db = mysql.createConnection(mysqlcredentials);

const server = express();

//Tells express to look for /html folder in the current directory (server). __dirname=current working directory
server.use(express.static(__dirname + '/html'));
//Have express pull body data that is urlencoded and place it in an object called 'body'
server.use(express.urlencoded({extended: false}));

//Make an endpoint to handle retrieving the grades of all students
server.get('/api/grades', (req, res) => {
    //Establish the connection to the database and call the callback (parameter) when connection is made
    db.connect( () => {
        //Create a mysql query for our desired operation
        const query = 'SELECT `id`, CONCAT(`given_name`, " ", `surname`) AS `name`, `course`, `grade` FROM `grades`';
        //Send the data to the database, and call the given callback once the data is retrieved, or an error occurs
        db.query(query, (error, data) => {
            //Create an output object to be sent back to the client
            const output = {
                success: false
            }
            //If error is null, no error occurred, so send the data
            if (!error) {
                //Notify the client that we were successful
                output.success = true;
                //Attach the data from the database to the output object
                output.data = data;
            } else {
                //Error occurred; attach the error to the output so we can see what happened
                output.error = error;
            }
            //Send the data back to the client
            res.send(output);
        })
    })
})

//Make an endpoint to handle adding a new student
server.post('/api/grades', (request, response) => {
    //Check the body object and see if any data was not sent
    if (request.body.name === undefined || request.body.course === undefined || request.body.grade === undefined) {
        //If data was not sent, respond to client with appropriate error message
        response.send({
            success: false,
            error: 'invalid name, course, or grade'
        })
        return;
    }
    //Establish the connection to the database and call the callback (parameter) when connection is made
    db.connect( () => {
        //Create variables from request.body to be used in the query string
        const name = request.body.name.split(' ');
        const course = request.body.course;
        const grade = request.body.grade;
        //Create a mysql query for our desired operation
        const query = "INSERT INTO `grades` SET `surname` = '" + name.slice(1).join(" ") + "', `given_name` = '" + name[0] + "', `course` = '" + course + "', `grade` = " + grade + ", `added` = NOW()";
        //Send the data to the database, and call the given callback once the data is retrieved, or an error occurs
        db.query(query, (error, result) => {
            //If error is null, no error occurred, so send the data
            if (!error) {
                response.send({
                    //Notify the client that we were successful and include the new id
                    success: true,
                    new_id: result.insertId
                })
            } else {
                //Error occurred; notify the client and attach the error
                response.send({
                    success: false,
                    error
                })
            }
        })
    })
})

//Make an endpoint to handle deleting a student
server.delete('/api/grades', (request, response) => {
    //Check the query object and see if an id was sent
    if (request.query.student_id === undefined) {
        //If no id was sent, send a response indicating that an id must be provided
        response.send({
            success: false,
            error: 'Must provide a student id for delete'
        });
        return;
    }
    //Establish the connection to the database and call the callback (parameter) when connection is made
    db.connect( () => {
        //Create mysql query
        const query = "DELETE FROM `grades` WHERE `id` = " + request.query.student_id;
        //Send the data to the database, and call the given callback once the data is retrieved, or an error occurs
        db.query(query, (error, result) => {
            //If error is null, no error occurred, so send a confirmation that the student was deleted
            if (!error) {
                response.send({
                    success: true
                })
            } else {
                //Error occurred; notify the client and attach the error
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
