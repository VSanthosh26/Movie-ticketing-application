using AngularAPI.Context;
using AngularAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AngularAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public ActionResult<Booking> PostBooking(Booking booking)
        {
            try
            {
                _context.Bookings.Add(booking);
                _context.SaveChanges();

                return CreatedAtAction("GetBooking", new { Id = booking.Id }, booking);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{Id}")]
        public ActionResult<Booking> GetBooking(int Id)
        {
            var booking = _context.Bookings.Find(Id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }
    }
}
