using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AngularAPI.Models
{
    public class Seating
    {
        [Key]
        public int SeatId {get; set;}
        public string SeatName { get; set; }
        public SeatType SeatType { get; set; }
        public Boolean isBooked { get; set; }
        public double Price { get; set; }


        public int ScreenId { get; set; }
        [ForeignKey("ScreenId")]
        public Screens Screens { get; set; }
    }

    public enum SeatType
    {
        PREMIUMSOFA,
        PREMIUMBALCONY,
        PREMIUMFIRSTCLASS,
        SECONDCLASS
    }
}
