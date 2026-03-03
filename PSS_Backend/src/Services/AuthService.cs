using Microsoft.EntityFrameworkCore;
using PSS_Backend.src.Data;
using PSS_Backend.src.DTOs;
using PSS_Backend.src.Models;

namespace PSS_Backend.src.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;

        public AuthService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            if (user == null || !VerifyPassword(dto.Password, user.Password))
            {
                return null;
            }

            // Mettre à jour la dernière connexion
            user.LastConnection = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                User = MapToUserDto(user),
                Token = GenerateToken(user)
            };
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            // Vérifier si l'email existe déjà
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                return null;
            }

            var user = new User
            {
                Email = dto.Email,
                Password = HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow,
                LastConnection = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                User = MapToUserDto(user),
                Token = GenerateToken(user)
            };
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        private static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private static string GenerateToken(User user)
        {
            // TODO: Implémenter JWT en production
            // Pour l'instant, un simple token basé sur l'ID et la date
            var tokenData = $"{user.Id}:{user.Email}:{DateTime.UtcNow.Ticks}";
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(tokenData));
        }

        private static UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                LastConnection = user.LastConnection
            };
        }
    }
}
