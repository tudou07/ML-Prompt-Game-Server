var express = require('express');
var router = express.Router();
const db = require('../db');
const { verifyToken } = require('../modules/token.js');

/**
 * @swagger
 * /admin:
 *   post:
 *      summary: Get all user statistics to the admin
 *      description: Get all user statistics to the admin
 *      requestBody:
 *          required: false
 *      responses:
 *          '200':
 *              description: User statistics retrieved successfully
 *          '403':
 *              description: You are not an admin
 *          '500':
 *              description: Could not retrieve user statistics
 */
router.post('/', verifyToken, function (req, res) {

    if (req.decoded.role !== 1) {
        res.status(403);
        res.send("You are not an admin");
        return;
    }

    const connection = db.connectToServer();

    const query = 
    `SELECT u.user_id, u.user_name, us.num_tokens, us.num_requests, us.correct_answers, us.incorrect_answers
    FROM user u
    JOIN userStats us ON u.user_id = us.user_id;`;

    connection.query(query, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Server error");
            return;
        }

        res.json(result);
    });

    db.disconnectFromServer(connection);
});

/**
 * @swagger
 * /admin:
 *   delete:
 *      summary: Delete a user by ID as an admin
 *      description: Delete a user by ID as an admin
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The username of the user to delete
 *                      required:
 *                          - username
 *      responses:
 *          '200':
 *              description: User deleted successfully
 *          '403':
 *              description: You are not an admin
 *          '500':
 *              description: Could not delete user or server error
 */
router.delete('/', verifyToken, function (req, res, next) {

    const { username } = req.body;
    console.log('User', username);

    if (req.decoded.role !== 1) {
        res.status(403);
        res.send("You are not an admin");
        return;
    }
    const query = `DELETE FROM user WHERE user_id = ${username};`;
    const connection = db.connectToServer();
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Server error");
            return;
        }
        res.json("User deleted");
    });

    db.disconnectFromServer(connection);
});


/**
 * @swagger
 * /admin:
 *   patch:
 *      summary: Update user tokens by ID as an admin
 *      description: Update user tokens by ID as an admin
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_id:
 *                              type: integer
 *                              description: The ID of the user
 *                          num_tokens:
 *                              type: integer
 *                              description: The new number of tokens for the user
 *                      required:
 *                          - user_id
 *                          - num_tokens
 *      responses:
 *          '200':
 *              description: User tokens updated successfully
 *          '403':
 *              description: You are not an admin
 *          '500':
 *              description: Could not update user tokens or server error
 */
router.patch('/', verifyToken, function (req, res, next) 
{
    const uId = req.body.user_id;
    const numTokens = req.body.num_tokens;

    if (req.decoded.role !== 1) {
        res.status(403);
        res.send("You are not an admin");
        return;
    }

    const query = `UPDATE userStats SET num_tokens = ${numTokens} WHERE user_id = ${uId};`;

    const connection = db.connectToServer();
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Server error");
            return;
        }
        res.json("User tokens updated");
    });

    db.disconnectFromServer(connection);
});

module.exports = router;