var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    summary: Default route
 *    description: Default route
 *    responses:
 *      '200':
 *        description: Default route
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
