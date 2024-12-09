using AngularAPI.Context;
using AngularAPI.Migrations;
using AngularAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Text;
using AngularAPI.Helpers;
using Microsoft.EntityFrameworkCore;

namespace AngularAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _authcontext;

        public UserController(AppDbContext appDbContext)
        {
            _authcontext = appDbContext;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
            {
                return BadRequest("Invalid request. User object is null.");
            }

            var user = await _authcontext.Users.FirstOrDefaultAsync(x => x.Username == userObj.Username);

            if (user == null)
            {
                return NotFound(new
                {
                    Message = "User Not Found"
                });
            }

            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Password))
            {
                return BadRequest(new { Message = "Password is incorrect" });
            }

            user.Token = CreateJwt(user);

            return Ok(new
            {
                Token = user.Token,
                Message = "Login Success"
            });
        }

        [HttpPost("register")]

        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();

            //Check Username
            if (await CheckUserNameExistAsync(userObj.Username))
            {
                return BadRequest(new { Message = "Username already exists!!" });
            }



            //Check Email
            if (await CheckEmailExistAsync(userObj.Email))
            {
                return BadRequest(new { Message = "Email already exists!!" });
            }




            //Check Password Strength

            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new { Message = pass.ToString() });



            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = "";
            await _authcontext.Users.AddAsync(userObj);
            await _authcontext.SaveChangesAsync();
            return Ok(new
            {
                Message = "User Registered"
            });
        }

        private Task<bool> CheckUserNameExistAsync(string username)
        => _authcontext.Users.AnyAsync(x => x.Username == username);


        private Task<bool> CheckEmailExistAsync(string email)
=> _authcontext.Users.AnyAsync(x => x.Email == email);


        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();

            // Minimum length check
            if (password.Length < 8)
                sb.Append("Minimum password length should be 8." + Environment.NewLine);

            // Alphanumeric requirement check
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should contain at least one lowercase letter, one uppercase letter, and one digit." + Environment.NewLine);

            // Special character requirement check
            string specialCharacters = "!@#$%^&*()_+-={}[]|\\:;\"'<>,.?/~`";
            if (!password.Any(c => specialCharacters.Contains(c)))
                sb.Append("Password should contain at least one special character: " + specialCharacters + Environment.NewLine);

            return sb.ToString();
        }

        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("this is my custom Secret key for authentication");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name,$"{user.FirstName}", user.LastName),
            });

            var Credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = Credentials
            };
            try
            {
                var token = jwtTokenHandler.CreateToken(tokenDescriptor);
                return jwtTokenHandler.WriteToken(token);
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                throw;
            }

            ;
        }


        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok(await _authcontext.Users.ToListAsync());
        }

    }
}
