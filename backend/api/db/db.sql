CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  session_id VARCHAR(32) UNIQUE,
  score INT DEFAULT 0,
  level INT DEFAULT 0,
  wallet VARCHAR(255) DEFAULT 'none',
  available_clicks INT DEFAULT 500,
  referred_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reward VARCHAR(255) NOT NULL,
  reward1 VARCHAR(255),          
  reward2 VARCHAR(255),         
  reward3 VARCHAR(255),          
  reward_symbol VARCHAR(10),
  end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  total_clicks INT DEFAULT 0,
  link VARCHAR(255),
  image_link VARCHAR(255),
  task_list JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  task_id INT,
  status ENUM('joined', 'completed') DEFAULT 'joined',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users_friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, 
    friend_telegram_id INT NOT NULL,
    score INT DEFAULT 0,
    referral_level INT DEFAULT 1,
    referred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referral_link VARCHAR(255) NOT NULL,
    default_reward INT DEFAULT 1000,
    premium_reward INT DEFAULT 20
);


CREATE TABLE leaders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  score INT DEFAULT 0,
  username VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(32),
  score INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER //

CREATE TRIGGER update_game_score
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.score <> OLD.score THEN
    INSERT INTO game_updates (session_id, score, updated_at)
    VALUES (NEW.session_id, NEW.score, NOW());
  END IF;
END //

DELIMITER ;

CREATE INDEX idx_user_id ON user_tasks(user_id);
CREATE INDEX idx_task_id ON user_tasks(task_id);
CREATE INDEX idx_friend_user_id ON friends(friend_user_id);
CREATE INDEX idx_score ON leaders(score);
CREATE INDEX idx_telegram_id ON users(telegram_id);
