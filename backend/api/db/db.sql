CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  session_id VARCHAR(32) UNIQUE,
  score INT DEFAULT 0,
  level INT DEFAULT 0,
  wallet VARCHAR(255),
  available_clicks INT DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reward DECIMAL(10, 0) NOT NULL,
  reward1 DECIMAL(10, 0),
  reward2 DECIMAL(10, 0),
  reward3 DECIMAL(10, 0),
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


CREATE TABLE friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  friend_user_id INT,
  score INT DEFAULT 0,
  default_reward DECIMAL(10, 2) DEFAULT 20000.00,
  premium_reward DECIMAL(10, 2) DEFAULT 35000.00,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_user_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
