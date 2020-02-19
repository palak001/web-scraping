const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = `https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=`;
const movieUrl = `https://www.imdb.com/title/`;

const searchMovies = (searchTerm) => {
    return fetch(`${url}${searchTerm}`)
        .then(response => {return response.text();})
        .then(body => {
            const movies = [];
            const $ = cheerio.load(body);
            $('.findResult').each((i, element) => {
                const image = $(element).find('td a img');
                const title = $(element).find('.result_text a');
                const imdbId = title.attr('href').match(/title\/(.*)\//)[1];
                const movie = {
                    image: image.attr('src'),
                    title: title.text(),
                    imdbId: imdbId
                };
                movies.push(movie);
                
            })
            return movies;
        });
}

const getMovie = (imdbID) => {
    return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body => {
        const $ = cheerio.load(body);
        const title = $('.title_wrapper h1').first().contents().filter(function(){
            return this.type === 'text';
          }).text().trim();
        const time = $('.subtext time').text();
        const rating = $('.ratingValue ').text();
        
        const genreArray = [];
        $('.subtext a').each((i, element) => {
            genreArray.push($(element).text());
        });
        const date = genreArray.pop().trim();
        //returns the object except last
        // const genre = genreArray.slice(0, -1); 
        const genre = genreArray;  

        return {
            title,
            time,
            rating,
            genre: genre.toString(),
            date 
        };
    })
    .catch(err => console.log(err));
}

module.exports = {
    searchMovies,
    getMovie
}
