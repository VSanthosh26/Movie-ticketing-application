using AngularAPI.Context;
using AngularAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatingController : ControllerBase
    {
        private readonly AppDbContext _context; 

        public SeatingController(AppDbContext context) 
        {
            _context = context;
        }

        // GET: api/Seating
        [HttpGet]
        public ActionResult<IEnumerable<Seating>> GetSeating()
        {
            return _context.Seating.ToList();
        }

        // GET: api/Seating/5
        [HttpGet("{id}")]
        public ActionResult<Seating> GetSeating(int id)
        {
            var seating = _context.Seating.Find(id);

            if (seating == null)
            {
                return NotFound();
            }

            return seating;
        }

        // POST: api/Seating
        [HttpPost]
        public ActionResult<Seating> PostSeating(Seating seating)
        {
            _context.Seating.Add(seating);
            _context.SaveChanges();

            return CreatedAtAction("GetSeating", new { id = seating.SeatId }, seating);
        }

        // POST: api/Seating/AddSeats/{screenId}
        [HttpPost("AddSeats/{ScreenId}")]
        public async Task<IActionResult> AddSeats(int screenId, [FromBody] List<Seating> seats)
        {
            // Check if the screen exists
            var screen = await _context.Screens.Include(s => s.seatings)
                .FirstOrDefaultAsync(s => s.ScreenId == screenId);

            if (screen == null)
            {
                return NotFound(); // Return a 404 Not Found response if the screen is not found.
            }

            // Add the seats to the screen
            foreach (var seat in seats)
            {
                seat.ScreenId = screen.ScreenId;
                screen.seatings.Add(seat);
            }

            try
            {
                await _context.SaveChangesAsync(); // Save changes to the database
                return Ok(); // Return a 200 OK response if the seats are added successfully.
            }
            catch (DbUpdateException)
            {
                return BadRequest("Failed to add seats."); // Return a 400 Bad Request response in case of an error.
            }
        }


        // PUT: api/Seating/5
        [HttpPut("{id}")]
        public IActionResult PutSeating(int id, Seating seating)
        {
            if (id != seating.SeatId)
            {
                return BadRequest();
            }

            _context.Entry(seating).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatingExists(id))
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

        // DELETE: api/Seating/5
        [HttpDelete("{id}")]
        public ActionResult<Seating> DeleteSeating(int id)
        {
            var seating = _context.Seating.Find(id);
            if (seating == null)
            {
                return NotFound();
            }

            _context.Seating.Remove(seating);
            _context.SaveChanges();

            return seating;
        }

        private bool SeatingExists(int id)
        {
            return _context.Seating.Any(e => e.SeatId == id);
        }
    }
}
