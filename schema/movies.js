const z = require("zod");



const schemaMovie = z.object({
    
    title: z.string(),
    year: z.number(
        {message: "The year must be a number"}
    ).positive().min(1900).max(2024),
    director: z.string(),
    duration: z.number().positive(),
    poster: z.string().url(),
    genre: z.array(z.string()),
    rate: z.number().min(0).max(10),


})

function validateMovie(movie){
    return schemaMovie.safeParse(movie);
}

function validatePartialMovie(movie){
    return schemaMovie.partial().safeParse(movie);
}

module.exports = validateMovie 
module.exports = validatePartialMovie