using AngularAPI.Context;
using AngularAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreensController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScreensController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Screens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Screens>>> GetScreens()
        {
            return await _context.Screens.ToListAsync();
        }

        // GET: api/Screens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Screens>> GetScreens(int id)
        {
            var screens = await _context.Screens.FindAsync(id);

            if (screens == null)
            {
                return NotFound();
            }

            return screens;
        }

        // PUT: api/Screens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScreens(int id, Screens screens)
        {
            if (id != screens.ScreenId)
            {
                return BadRequest();
            }

            _context.Entry(screens).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScreensExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Screens
        [HttpPost]
        public async Task<ActionResult<Screens>> PostScreens(Screens screens)
        {
            _context.Screens.Add(screens);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScreens", new { id = screens.ScreenId }, screens);
        }

        // DELETE: api/Screens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScreens(int id)
        {
            var screens = await _context.Screens.FindAsync(id);
            if (screens == null)
            {
                return NotFound();
            }

            _context.Screens.Remove(screens);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScreensExists(int id)
        {
            return _context.Screens.Any(e => e.ScreenId == id);
        }

        // GET: api/theatres/getTheatresByCities/5
        [HttpGet("getTheatresByMovies/{MovieId}")]
        public ActionResult<IEnumerable<Theatre>> GetTheatresByMovies(int MovieId)
        {
            var theatres = _context.Screens.Where(t => t.MovieId == MovieId).ToList();
            return Ok(theatres);
        }

        [HttpGet("movie/{movieId}")]
        public IActionResult GetScreensForMovie(int movieId)
        {
            var screens = _context.Screens
                .Include(screen => screen.Theatre)
                .Include(screen => screen.Movie)
                .Where(screen => screen.MovieId == movieId)
                .Select(screen => new
                {
                    screen.ScreenId,
                    screen.ScreenName,
                    screen.Theatre.TheatreName,
                    screen.Theatre.Location
                })
                .ToList();
            return Ok(screens);
        }
    }
}
