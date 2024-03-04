drop database if exists `ISA`;
CREATE DATABASE IF NOT EXISTS `ISA`;
use ISA;

CREATE TABLE IF NOT EXISTS role
(
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user
(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_role INT NOT NULL,
    FOREIGN KEY (user_role) REFERENCES role(role_id)
);

CREATE TABLE IF NOT EXISTS userStats
(
    user_id INT NOT NULL,
    num_tokens INT DEFAULT 20,
    num_requests INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    incorrect_answers INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

INSERT IGNORE INTO role (role_name) VALUES ('admin'), ('user');

DELIMITER //

CREATE TRIGGER createUserStats AFTER INSERT ON user
    FOR EACH ROW
    BEGIN
        INSERT INTO userStats (user_id) VALUES (NEW.user_id);
    END;

CREATE PROCEDURE createUser(IN username VARCHAR(255), IN password VARCHAR(255), IN email VARCHAR(255)) 
    BEGIN
        INSERT INTO user (user_name, user_password, user_email, user_role) VALUES (username, password, email, 2);
    END;

CREATE PROCEDURE updateUserStats(IN p_user_id INT)
    BEGIN
        UPDATE userStats SET num_requests = num_requests + 1 WHERE user_id = p_user_id;
        UPDATE userStats SET num_tokens = num_tokens - 1 WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE updateUserStatsCorrect(IN p_user_id INT)
    BEGIN
        UPDATE userStats SET correct_answers = correct_answers + 1 WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE updateUserStatsIncorrect(IN p_user_id INT)
    BEGIN
        UPDATE userStats SET incorrect_answers = incorrect_answers + 1 WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE getUser(IN p_user_email VARCHAR(255))
    BEGIN
        SELECT * FROM user WHERE user_email = p_user_email;
    END;

CREATE PROCEDURE getUserById(IN p_user_id VARCHAR(255))
    BEGIN
        SELECT * FROM user WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE getUserStats(IN p_user_id INT)
    BEGIN
        SELECT * FROM userStats WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE getTokens(IN p_user_id INT)
    BEGIN
        SELECT num_tokens FROM userStats WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE getUserById(IN p_user_id VARCHAR(255))
    BEGIN
        SELECT * FROM userstats WHERE user_id = p_user_id;
    END;

CREATE PROCEDURE delete(IN p_user_id INT)
    BEGIN
        DELETE FROM user WHERE user_id = p_user_id;
    END;
DELIMITER;