namespace PSS_Backend.src.DTOs
{
    public class MangaRecommendationRequestDto
    {
        public string Description { get; set; } = string.Empty;
    }

    public class MangaRecommendationResponseDto
    {
        public List<string> Recommendations { get; set; } = new List<string>();
        public string Message { get; set; } = string.Empty;
    }
}
