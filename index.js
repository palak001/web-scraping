const express = require('express');
const scraper = require('./scraper');
const app = express();

app.get('/', (req, res) => {
    res.send('web scraping');
})

app.get('/search/:title', (req, res) => {
    scraper.searchMovies(req.params.title)
    .then(movies => {
        res.json(movies);
    })
})

app.get('/movie/:imdbID', (req, res) => {
    scraper.getMovie(req.params.imdbID)
    .then(movie => {
        res.json(movie);
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})