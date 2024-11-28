using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAPI.Models
{
    public class Screens
    {
        [Key]
        public int ScreenId { get; set; }

        public string ScreenName { get; set; }

        public int MovieId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        public int TheatreId { get; set; }

        [ForeignKey("TheatreId")]
        public Theatre Theatre { get; set; }

        public List<Seating> seatings { get; set; }

    }
}
