using Microsoft.AspNetCore.Mvc;
using PSS_Backend.src.DTOs;
using PSS_Backend.src.Services;

namespace PSS_Backend.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            
            if (result == null)
            {
                return Unauthorized("Email ou mot de passe incorrect");
            }

            return Ok(result);
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            
            if (result == null)
            {
                return Conflict("Un utilisateur avec cet email existe déjà");
            }

            return Ok(result);
        }
    }
}
