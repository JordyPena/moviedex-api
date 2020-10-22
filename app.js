require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan("dev"))
app.use(helmet())
app.use(cors())


app.use(function authorization(req, res, next) {
  
  const apiToken = process.env.API_TOKEN

  const authToken = req.get("Authorization")

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request"})
  }

  next()
})

app.get('/movie', (req, res) => {
  const {genre, country, avg_vote} = req.query
  //dont want to mess with original MOVIES arr, so now filter is all movies
  let filteredMovies = [...MOVIES]

  if (genre) {
    filteredMovies = filteredMovies.filter(movie => {
      return movie.genre.toLowerCase().includes(genre.toLowerCase())
    })
  }

  if (country) {
    filteredMovies = filteredMovies.filter(movie => {
      return movie.country.toLowerCase().includes(country.toLowerCase())
    })
  }

  if (avg_vote) {
    filteredMovies = filteredMovies.filter(movie => {
      return Number(movie.avg_vote) >= Number(avg_vote)
    })
  }
  res.json(filteredMovies)

})

const PORT = 8000
app.listen(PORT, () => {
  console.log('Server started on PORT 8000')
})