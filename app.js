const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet')

const app = express();
const movies = require('./movie-data-small')
app.use(cors());
app.use(morgan('common'));
//app.use(handleApiToken);
app.use(helmet())
require('dotenv').config(); 

console.log(process.env.API_TOKEN);
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })
  

app.get('/movie', (req, res)=>{
    let { genre, country, avg_vote } = req.query;
    let muteMovies = movies;
    if(genre){
        muteMovies= muteMovies.filter(movie=>movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    if(country){
        muteMovies= muteMovies.filter(movie=>movie.country.toLowerCase().includes(country.toLowerCase()));
    }
    if(avg_vote){
        if(isNaN(avg_vote)|| avg_vote <1 || avg_vote >10 ){
            return res
            .status(400)
            .send('Sort must be a number between 1 and 10');
        }
        muteMovies= muteMovies.filter((movie) => Number(movie.avg_vote) >= Number(avg_vote));
    }
    
    res.send(muteMovies);
})

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});