using AngularAPI.Context;
using AngularAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AngularAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheatreController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TheatreController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Theatre
        [HttpGet]
        public IActionResult GetTheatres()
        {
            var theatres = _context.Theatre;
            return Ok(theatres);
        }

        // GET: api/Theatre/{id}
        [HttpGet("{id}")]
        public IActionResult GetTheatre(int id)
        {
            var theatre = _context.Theatre.Find(id);

            if (theatre == null)
            {
                return NotFound();
            }

            return Ok(theatre);
        }

        // POST: api/theatre
        [HttpPost]
        public IActionResult Createtheatre([FromBody] Theatre theatre)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Theatre.Add(theatre);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetTheatre), new { id = theatre.TheatreId }, theatre);
        }

        // PUT: api/theatre/{id}
        [HttpPut("{id}")]
        public IActionResult Updatetheatre(int id, [FromBody] Theatre theatre)
        {
            if (id != theatre.TheatreId)
            {
                return BadRequest();
            }

            _context.Entry(theatre).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/theatre/{id}
        [HttpDelete("{id}")]
        public IActionResult Deletetheatre(int id)
        {
            var theatre = _context.Theatre.Find(id);

            if (theatre == null)
            {
                return NotFound();
            }

            _context.Theatre.Remove(theatre);
            _context.SaveChanges();

            return NoContent();
        }

    }
}
