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