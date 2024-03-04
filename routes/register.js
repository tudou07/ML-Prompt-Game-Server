var express = require('express');
var router = express.Router();
const db = require('../db');
var bcryptjs = require("bcryptjs");

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Used to register users
 *      description: Registration
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: Username of the user
 *                          email:
 *                              type: string
 *                              description: Email address of the user
 *                          password:
 *                              type: string
 *                              description: Password of the user
 *      responses:
 *          '200':
 *              description: User registered successfully
 *          '500':
 *              description: User already exists
 */
router.post('/', function(req, res, next) 
{
    //register user
    const connection = db.connectToServer();

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const numSaltRounds = 1;
    
    const hash = bcryptjs.hashSync(password, numSaltRounds);

    const query = `CALL createUser('${username}', '${hash}', '${email}');`;

    connection.query(query, function(err, result)
    {
        if (err)
        {
            res.status(500).json({message: "User already exists"});
            return;
            //throw err;  
        }

        res.json({message: "User registered successfully"});
    });

    db.disconnectFromServer(connection);
});

module.exports = router;
