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
        
        const genre = [];
        $('.subtext a').each((i, element) => {
            genre.push($(element).text());
        });
        const date = genre.pop().trim();
        //returns the object except last
        // const genre = genreArray.slice(0, -1); 
        const poster = $('.poster').find('img').attr('src');
        const summary = $('.summary_text').text();
        // const credit_summary = $('.credit_summary_item');
        const credit = [];
        $('.credit_summary_item').each((i, element) => {
            console.log($(element).text());
            credit.push($(element).text().split(":"));
        })
        const Director = credit[0][1].split(',');
        const Writer = credit[1][1].split(',');
        const Stars = credit[2][1].split('|')[0].split(',');
        // const temp = $('.credit_summary_item').text();
        // console.log($('.credit_summary_item').text().trim());
        const storyLine = $('.canwrap span').text();
        const budget = $('.subheading').first().next().text().trim().split(':')[1];
        const video = $('.slate').find('a');
        const trailer = `www.imdb.com${video.attr('href')}`;
        return {
            title,
            time,
            rating,
            genre,
            date,
            poster,
            summary,
            // credit,
            Director, 
            Writer,
            Stars,
            storyLine,
            budget,
            trailer
            // temp
        };
    })
    .catch(err => console.log(err));
}

module.exports = {
    searchMovies,
    getMovie
}
