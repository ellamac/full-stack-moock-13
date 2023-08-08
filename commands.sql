CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Herra Hakkarainen', 'www.hyvääyötäblogi.com', 'Hyvää yötä');
INSERT INTO blogs (author, url, title) VALUES ('Nicki Minaj', 'www.nickiminajofficial.com', 'Queen of rap');

SELECT * from blogs;