CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

DROP TABLE blogs;
DROP TABLE readinglist;
DROP TABLE migrations;
DROP TABLE users;

INSERT INTO users (username, name) VALUES ('ella@makela.co', 'ellamac');
INSERT INTO users (username, name) VALUES ('testi@makela.co', 'testi');

INSERT INTO blogs (author, url, title, user_id) VALUES ('Herra Hakkarainen', 'www.hyvääyötäblogi.com', 'Hyvää yötä', 1);
INSERT INTO blogs (author, url, title, user_id) VALUES ('Nicki Minaj', 'www.nickiminajofficial.com', 'Queen of rap', 1);
INSERT INTO blogs (author, url, title, user_id) VALUES ('Testiiii', 'www.google.com', 'TESTI', 2);


SELECT * from blogs;

