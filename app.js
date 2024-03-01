
const express = require("express");
const movies = require("./movies.json");
const crypto = require("crypto");
const cors = require("cors");
const validateMovie = require("./schema/movies");
const validatePartialMovie = require("./schema/movies");

const app= express();



app.use(express.json() , (req, res, next) => {
   
    express.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    
    next();
});


//origin viene de la cabecera const origin = req.header("Origin")
// el navegador no envia nunca el header de origin cuando refrescamos una pagina que ya habiamos cargado
// el paquete cors ya lo hace automaticamente
app.use(cors({origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:1234',
        'https://movies.com',
        'https://midu.dev'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))


app.disable("x-powered-by");// desactivamos el x-powered-by por cuestiones de seguridad



app.get("/", (req, res) => {
   
    res.send("Hello World!");
});

app.get("/movies", (req, res) => {
// el navegador no envia nunca el header de origin cuando refrescamos una pagina que ya habiamos cargado
//el navegar no envia cuando la peticion es del mismo Origin
//     const origin = req.header("Origin");
// if (ACCEPTED_ORIGINS.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
// }


    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    // para reparar el error de CORS que lanza el navegador
    const {genre} = req.query;
    if(genre){
        const filteredMovies = movies.filter((movie)=> movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        return res.json(filteredMovies);
    }
    return res.json(movies);
})

app.get("/movies/:id", (req, res) => {
    const {id} = req.params;
    const movie = movies.find(m => m.id === id);
  
    if(movie){
      return  res.json(movie);
    }else{
        res.status(404).send("Movie not found");
    }
})


app.post("/movies", (req, res) => {
const result= validateMovie(req.body);    
express.json();
console.log('====================================');
console.log('bodyyyy',req.body);
console.log(result);
console.log('====================================');


    const newMovie = {
        id:crypto.randomUUID(),
      ...result.data
    }
        
    if(result.success){
        movies.push(newMovie);
        return res.status(201).json(newMovie)
    }else{
        return res.status(400).send({error: JSON.parse(result.error)})
    }

    
    
    
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
  
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
  
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    const updateMovie = {
      ...movies[movieIndex],
      ...result.data
    }
  
    movies[movieIndex] = updateMovie
  
    return res.json(updateMovie)
  })

// app.options("/movies/:id", (req, res) => {
//     const origin = req.header("Origin");
// if (ACCEPTED_ORIGINS.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
// }
// res.send(200)
// })

app.delete("/movies/:id", (req, res) => {
    const {id} = req.params;
    const movieIndex = movies.findIndex(m => m.id === id);

    if(movieIndex !== -1){
        movies.splice(movieIndex, 1);// splice remueve elementos de un array, el numero indica cuantos elementos se remueven
        return res.status(204).send( "Movie deleted");
    }
})

app.listen(3000, () => {
    console.log(" Server running on port http://localhost:3000");
})