using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAPI.Models
{
    public class Movie
    {
        [Key]
        public int MovieId { get; set; }    
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [Required]
        [StringLength(50)]
        public string Language { get; set; }
        public int DurationMinutes { get; set; }

        public DateTime ReleaseDate { get; set; }

        [StringLength(1000)]
        public string PosterUrl { get; set; }

        // Foreign key for City
        public int CityID { get; set; }

        // Navigation property to City
        [ForeignKey("CityID")]
        public City City { get; set; }
    }
}
