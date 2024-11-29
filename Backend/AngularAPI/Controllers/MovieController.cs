using AngularAPI.Context;
using AngularAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovieController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Movie
        [HttpGet]
        public IActionResult GetMovies()
        {
            var movies = _context.Movies;
            return Ok(movies);
        }

        // GET: api/Movie/{id}
        [HttpGet("{id}")]
        public IActionResult GetMovie(int id)
        {
            var movie = _context.Movies.Find(id);

            if (movie == null)
            {
                return NotFound();
            }

            return Ok(movie);
        }
        [HttpGet("ByCity/{cityID}")]
        public IActionResult GetMoviesByCity(int cityID)
        {
            var movies = _context.Movies
                .Where(m => m.CityID == cityID)
                .Join(
                    _context.Cities,
                    movie => movie.CityID,
                    city => city.CityID,
                    (movie, city) => new
                    {
                        MovieID = movie.MovieId,
                        Title = movie.Title,
                        Language = movie.Language,
                        DurationMinutes = movie.DurationMinutes,
                        CityName = city.CityName, // Include the city name
                        PosterUrl = movie.PosterUrl,
                        ReleaseDate = movie.ReleaseDate
                    }
                )
                .ToList();

            return Ok(movies);
        }


        // POST: api/Movie
        [HttpPost]
        public IActionResult CreateMovie([FromBody] Movie movie, int CityID)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the city with the specified CityID exists
            var city = _context.Cities.Find(CityID);
            if (city == null)
            {
                return NotFound("City not found");
            }

            // Assign the CityID to the movie
            movie.CityID = CityID;

            _context.Movies.Add(movie);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.MovieId }, movie);
        }

        // PUT: api/Movie/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateMovie(int id, [FromBody] Movie movie)
        {
            if (id != movie.MovieId)
            {
                return BadRequest();
            }

            _context.Entry(movie).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Movie/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(int id)
        {
            var movie = _context.Movies.Find(id);

            if (movie == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(movie);
            _context.SaveChanges();

            return NoContent();
        }

    }
}
