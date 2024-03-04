const fs = require('fs');
const mysql = require('mysql');
const bcryptjs = require("bcryptjs");
const redis = require('redis');

exports.connectToServer = function()
{

    const connection = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: true
    });

    connection.connect(function(err)
    {
        if (err) 
        {
            throw err;
        }
        console.log("Connected!");
    });


    return connection;
}

exports.setUpInitialDatabase = function()
{
    const connection = exports.connectToServer();

    const numSaltRounds = 8;

    const hash = bcryptjs.hashSync("123", numSaltRounds);

    const adminHash = bcryptjs.hashSync("111", numSaltRounds);


    const seedUserTable = `INSERT IGNORE INTO user (user_name, user_password, user_email, user_role) VALUES ('john', '${hash}', 'jimmy@john.com', 2), ('admin', '${adminHash}', 'admin@admin.com', 1);`;

    connection.query(seedUserTable, function(err, result)
    {
        if (err)
        {
            throw err;
        }
        else
        {
            console.log("db created");
        }
    });

    exports.disconnectFromServer(connection);
}

exports.disconnectFromServer = function(connection)
{
    connection.end((err) => 
    {
        if (err) throw err;
        console.log('Connection closed!');
    });
}

exports.startRedis = async function() {
    const redisClient = redis.createClient({
        password: 'VJ6boPTCUH2GQhT91cocoJ245bwudWdz',
        socket: {
            host: 'redis-19336.c53.west-us.azure.cloud.redislabs.com',
            port: 19336
        }
    });
    redisClient.on("error", (error) => console.error(error));
    await redisClient.connect();
    return redisClient;
}

exports.setEnvVar = function()
{
    // process.env.DB_HOST = 'localhost';
    // process.env.DB_USER = 'root';
    // process.env.DB_PASS = 'secret';
    // process.env.DB_NAME = 'isa';
    process.env.DB_HOST = '4537-labs.mysql.database.azure.com';
    process.env.DB_USER = 'traill';
    process.env.DB_PASS = 'bigglesworth!4';
    process.env.DB_NAME = 'ISA';
}