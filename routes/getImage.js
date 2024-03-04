var express = require('express');
var router = express.Router();
const { getAnimal, getTransport, getAction } = require('./constant');
const db = require('../db');
const { verifyToken } = require('../modules/token.js');

/**
 * @swagger
 * /getImage:
 *  get:
 *    summary: Get image from Hugging Face API
 *    description: Get image from Hugging Face API
 *    responses:
 *      '200':
 *        description: Image retrived
 *      '500':
 *        description: Could not retrieve image
 */
router.get('/', verifyToken, async function (req, res, next) {
	// prmpt is a string of 3 words
	const redisClient = await db.startRedis();

	const username = req.decoded.id.toString();

	const randomWords = getRandomWords();

	const data = {
		animal: randomWords[0],
		transport: randomWords[1],
		action: randomWords[2],
		numberOfGuesses: 20,
		selectedWords: [randomWords[3], randomWords[4], randomWords[5]],
		hint: "none"
	};

	  // get random property from data
	  let randomProperty = function (obj) {
		let keys = Object.keys(obj);
		return obj[keys[keys.length * Math.random() << 0]];
	  };
	
	  data.hint = randomProperty({ animal: randomWords[0], transport: randomWords[1], action: randomWords[2] });

	console.log(username);
	const stringValue = JSON.stringify(data);
	redisClient.set(username, stringValue, 'EX', 10);

	console.log('Prompt is  :', randomWords[0] + ' ' + randomWords[1] + ' ' + randomWords[2]);
	query({ "inputs": randomWords[0] + ' ' + randomWords[1] + ' ' + randomWords[2] }).then((response) => {

		response.arrayBuffer().then((buf) => {
			res.json({image: Buffer.from(buf), animals: randomWords[3], transports: randomWords[4], actions: randomWords[5]})
		});
	});
});

function getRandomWords() {
	// Array of 10 animals, 10 transports, and 10 actions
	const animals = getAnimal();
	const transports = getTransport();
	const actions = getAction();

	function getRandomWordFromArray(array) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	const randomAnimal = getRandomWordFromArray(animals);
	const randomTransport = getRandomWordFromArray(transports);
	const randomAction = getRandomWordFromArray(actions);

	return [randomAnimal, randomTransport, randomAction , animals, transports, actions];
}

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}

module.exports = router;