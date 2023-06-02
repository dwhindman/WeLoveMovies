const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list(isShowing){
    if(isShowing === "true"){
        return listOnlyShowing();
    }
    return listAll();
}

function listAll(){
    return knex("movies").select("*");
}

function listOnlyShowing(){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.movie_id", "m.title", "m.runtime_in_minutes", "rating", "description", "image_url")
        .groupBy("m.movie_id")
        .where({ is_showing: true });
}

function read(movieId){
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId }).first();
}

function listTheatersByMovieId(movieId){
    return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .where({"mt.movie_id": movieId})
        .select("*");
}

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
  });

function listReviewsByMovieId(movieId){
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({"r.movie_id": movieId})
        .then(reviews => reviews.map(review => addCritic(review)));
}

module.exports = {
    list,
    read,
    listTheatersByMovieId,
    listReviewsByMovieId,
}
