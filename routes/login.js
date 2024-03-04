
var express = require('express');
var router = express.Router();
const db = require('../db');
var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Used for admin or user authentication using JWT
 *      description: Login to the application.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Email address of the user
 *                          password:
 *                              type: string
 *                              description: Password of the user
 *      responses:
 *          '200':
 *              description: Login successful
 *          '400':
 *              description: Invalid email or password
 *          '500':
 *              description: Could not log in
 */
router.post('/', function(req, res, next) 
{
    const connection = db.connectToServer();

    const email = req.body.email;
    const password = req.body.password;

    const query = `CALL getUser('${email}');`;

    connection.query(query, function(err, result)
    {
        if (err)
        {
            console.log(err);
            //throw err;
            res.status(500).send("Could not log in");
            return;
        }

        if (result[0].length === 0)
        {
            res.status(400).send("Invalid email or password");
            return;
        }

        let user = result[0][0];

        if (bcryptjs.compareSync(password, user.user_password) === false)
        {
            res.status(400).send("Invalid email or password");
        }
        else
        {
            const userToken = {id : user.user_id, role : user.user_role};
            const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: 1800000 });

            res.cookie('token', token, {httpOnly: true, path: "/", secure: true, Domain: process.env.SERVER_URL, sameSite: 'none'});
            if (user.user_role === 1)
            {
                res.json({redirect: '/admin.html'});
            }
            else
            {
                res.json({redirect: `/user.html`});
            }
        }
    });

    db.disconnectFromServer(connection);
});

module.exports = router;
