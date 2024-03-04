var express = require('express');
var router = express.Router();
const db = require('../db');
const { verifyToken } = require('../modules/token.js');

/**
 * @swagger
 * /user/hints:
 *  get:
 *    summary: Get hints for the user
 *    description: Get hints for the user
 *    responses:
 *      '200':
 *        description: Hints retrieved successfully
 *      '500':
 *        description: Could not retrieve hints
 */
router.get('/hints', verifyToken, async function (req, res) {
  const connection = db.connectToServer();
  const query = `UPDATE userStats SET num_requests = num_requests + 1 WHERE user_id = '${req.decoded.id}';`;
  connection.query(query);

  const redisClient = await db.startRedis();
  //replace with redist variables

  let data = await redisClient.get(req.decoded.id.toString())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error retrieving data from Redis:", error);
    });

  data = JSON.parse(data);

  res.json({ hint: data.hint });

  db.disconnectFromServer(connection);
});

/**
 * @swagger
 * /user/tokens:
 *  get:
 *    summary: Get token count for the user
 *    description: Get token count for the user
 *    responses:
 *      '200':
 *        description: Tokens retrieved successfully
 *      '500':
 *        description: User does not exist
 */
router.get('/tokens', verifyToken, function (req, res) {
  //res.setHeader('Cache-Control', 'no-cache');
  const connection = db.connectToServer();
  const query = `CALL getUserStats('${req.decoded.id}');`;
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json("User does not exist");
      return;
    }

    res.json({ tokens: result[0][0].num_tokens, requests: result[0][0].num_requests, correct: result[0][0].correct_answers, incorrect: result[0][0].incorrect_answers });
  });

  db.disconnectFromServer(connection);
});

/**
 * @swagger
 * /user/delete:
 *   delete:
 *      summary: Delete the currently logged-in user by ID as an admin
 *      description: Delete the currently logged-in user by ID as an admin
 *      responses:
 *          '200':
 *              description: User deleted successfully
 *          '403':
 *              description: You are not an admin
 *          '500':
 *              description: Could not delete user or server error
 */
router.delete('/delete', verifyToken, function (req, res) {
  const username = req.decoded.id.toString();
  console.log(username)

  const connection = db.connectToServer();
  const query = `DELETE FROM user WHERE user_id = '${username}';`;
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
 * /user/submit:
 *  patch:
 *      summary: Submit answer
 *      description: Submit answer for geussing the correct images
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          animal:
 *                              type: string
 *                              description: Animal name
 *                          transport:
 *                              type: string
 *                              description: Transport name
 *                          action:
 *                              type: string
 *                              description: Action name
 *      responses:
 *          '200':
 *              description: Correct answer
 *          '500':
 *              description: Incorrect answer
 */
router.patch("/submit", verifyToken, async function (req, res) {
  const connection = db.connectToServer();
  const query = `CALL updateUserStats('${req.decoded.id}');`;

  connection.query(query);

  const redisClient = await db.startRedis();
  //replace with redist variables

  let data = await redisClient.get(req.decoded.id.toString())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error retrieving data from Redis:", error);
    });

  data = JSON.parse(data);

  let animal;
  let transport;
  let action;

  if (data != null) {
    animal = data.animal;
    transport = data.transport;
    action = data.action;
  }
  else {
    res.status(500).send("Could not find redis data");
    return;
  }

  let numCorrect = 0;
  if (req.body.animal == animal) {
    numCorrect++;
  }
  if (req.body.transport == transport) {
    numCorrect++;
  }
  if (req.body.action == action) {
    numCorrect++;
  }

  let query2;
  if (numCorrect == 3) {
    query2 = `CALL updateUserStatsCorrect('${req.decoded.id}');`
  }
  else {
    query2 = `CALL updateUserStatsIncorrect('${req.decoded.id}');`
  }

  connection.query(query2);

  let query3 = `CALL getTokens('${req.decoded.id}');`;

  connection.query(query3, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
      return;
    }

    let tokens = result[0][0].num_tokens; 

    if (data.numberOfGuesses == 0) {
      redisClient.del(req.decoded.id.toString());
      res.json({ numCorrect: numCorrect, remainingTokens: tokens, gameOver: true })
    } else {
      data.numberOfGuesses--;
      console.log("Number of guesses left ", data.numberOfGuesses);
      redisClient.set(req.decoded.id.toString(), JSON.stringify(data), 'EX', 10);
      res.json({ numCorrect: numCorrect, remainingTokens: tokens, gameOver: false });
    }
  });

  db.disconnectFromServer(connection);
});

module.exports = router;
