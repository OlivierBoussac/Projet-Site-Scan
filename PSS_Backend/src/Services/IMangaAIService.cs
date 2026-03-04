using PSS_Backend.src.DTOs;

namespace PSS_Backend.src.Services
{
    public interface IMangaAIService
    {
        Task<MangaRecommendationResponseDto> GetRecommendationsAsync(string description);
    }
}
