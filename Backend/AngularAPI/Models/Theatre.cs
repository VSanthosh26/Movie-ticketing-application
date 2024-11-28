using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAPI.Models
{
    public class Theatre
    {
        [Key]
        public int TheatreId { get; set; }

        [Required]
        [StringLength(100)]
        public string TheatreName { get; set; }

        [Required]
        [StringLength(100)]
        public string Location { get; set; }

        // Foreign key for City
        public int CityID { get; set; }

        // Navigation property to City
        [ForeignKey("CityID")]
        public City City { get; set; }
    }
}
