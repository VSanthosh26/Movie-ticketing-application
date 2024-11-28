using AngularAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Reflection.Emit;

namespace AngularAPI.Context
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext>options):base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<City> Cities { get; set; }

        public DbSet<Movie> Movies { get; set; }

        public DbSet<Theatre> Theatre { get; set; }

        public DbSet<Screens> Screens { get; set; }

        public DbSet<Seating> Seating { get; set; }

        public DbSet<Booking> Bookings { get; set; }



        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            modelbuilder.Entity<User>().ToTable("users");
            modelbuilder.Entity<City>().ToTable("cities");
            modelbuilder.Entity<Movie>().ToTable("movies");
            modelbuilder.Entity<Theatre>().ToTable("Theatres");
            modelbuilder.Entity<Screens>().ToTable("Screens");
            modelbuilder.Entity<Seating>().ToTable("Seatings");
            modelbuilder.Entity<Booking>().ToTable("BookingInfo");


            modelbuilder.Entity<Screens>()
                .HasOne(s => s.Movie)
                .WithMany()
                .HasForeignKey(s => s.MovieId)
                .OnDelete(DeleteBehavior.Restrict);

            modelbuilder.Entity<Screens>()
                .HasOne(s => s.Theatre)
                .WithMany()
                .HasForeignKey(s => s.TheatreId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
