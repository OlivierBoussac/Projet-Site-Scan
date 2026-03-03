using PSS_Backend.src.DTOs;

namespace PSS_Backend.src.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
        bool VerifyPassword(string password, string hash);
    }
}
