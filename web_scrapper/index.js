const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const PORT = process.env.PORT || 3000

const app = express()

const url = 'https://www.imdb.com/search/title/?title_type=feature&year=2023-01-01,2023-12-31'

app.get('/', (req, res) => {
    res.json('Welcome to my web scraper')
})

app.get('/movies', (req, res) => {
axios(url).then(response => {
  const html = response.data;
  const $ = cheerio.load(html);

  const movie = '.lister-item'; 

  const movies = []

  $(movie).each(function() {
    const title = $(this).find(".lister-item-header").text().replace(/\n/g, "").substring(18).replace(/\s+/g, ' ').replace('(2023)',"").trim();
    const genre = $(this).find(".genre").text().replace(/\n/g, "").substring(0,25).trim();
    const poster = $(this).find(".loadlate").attr("src");
    const directorUrl = $(this).find("a[href^='/name/']").attr("href");
    const director = $(this).find(`a[href='${directorUrl}']`).text().trim();
    const actorUrls = $(this).find("a[href^='/name/']").slice(1, 6).map(function() { return $(this).attr("href"); }).get();
    const actors = $(this).find(`a[href='${actorUrls.join("'], a[href='")}']`).map(function() { return $(this).text().trim(); }).get();
    const synopsis = $(this).find(".ratings-bar+.text-muted, .text-muted+.text-muted").text().replace(/\n/g, "").trim();
    movies.push({
      title,
      genre,
      poster,
      synopsis,
      director,
      actors,
    });

  })
  console.log(movies);
  res.json(movies);
}).catch(err => console.log(err))
      
})    

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})