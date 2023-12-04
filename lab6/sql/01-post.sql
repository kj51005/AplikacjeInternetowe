SELECT 'Executing 01-post.sql' AS Message;

DROP TABLE IF EXISTS post;

CREATE TABLE IF NOT EXISTS post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);

SELECT 'Script executed successfully' AS Message;
