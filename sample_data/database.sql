--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS pk_vote_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS fk_planet_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS fk_user_id CASCADE;


DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id            SERIAL    NOT NULL,
    username      VARCHAR   UNIQUE,
    password      VARCHAR   NOT NULL
);


DROP TABLE IF EXISTS public.planet_votes;
DROP SEQUENCE IF EXISTS public.planet_votes_id_seq;
CREATE TABLE planet_votes (
    id              SERIAL NOT NULL,
    planet_id       INTEGER NOT NULL,
    planet_name     VARCHAR,
    user_id         INTEGER,
    submission_time TIMESTAMP WITHOUT TIME ZONE
);


ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT pk_vote_id PRIMARY KEY (id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


INSERT INTO users VALUES (0, 'admin', 'pbkdf2:sha256:50000$LZ3hlfQh$01794aea0012f2b639e58f12f38653a007c372296103cab57864b2e3aac33cdf');
SELECT pg_catalog.setval('users_id_seq', 0, true);
