var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /logout:
 *  post:
 *      summary: Used to logout user or admin, also clears the cookies
 *      description: Logout
 *      requestBody:
 *          required: false
 *      responses:
 *          '200':
 *              description: Logout successful
 */
router.post('/', function(req, res, next) {
  // Assuming you are storing the token in a cookie named 'token'
  res.clearCookie('token', { path: '/', domain: process.env.SERVER_URL, secure: true, sameSite: 'none' });
  res.status(200).send("Logout successful");
});

module.exports = router;
