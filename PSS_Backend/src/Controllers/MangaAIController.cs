using Microsoft.AspNetCore.Mvc;
using PSS_Backend.src.DTOs;
using PSS_Backend.src.Services;

namespace PSS_Backend.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MangaAIController : ControllerBase
    {
        private readonly IMangaAIService _mangaAIService;

        public MangaAIController(IMangaAIService mangaAIService)
        {
            _mangaAIService = mangaAIService;
        }

        // POST: api/mangaai/recommendations
        [HttpPost("recommendations")]
        public async Task<ActionResult<MangaRecommendationResponseDto>> GetRecommendations([FromBody] MangaRecommendationRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest(new MangaRecommendationResponseDto 
                { 
                    Message = "La description ne peut pas être vide" 
                });
            }

            var result = await _mangaAIService.GetRecommendationsAsync(request.Description);
            return Ok(result);
        }
    }
}
