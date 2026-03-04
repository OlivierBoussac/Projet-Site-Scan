using OpenAI.Chat;
using PSS_Backend.src.DTOs;

namespace PSS_Backend.src.Services
{
    public class MangaAIService : IMangaAIService
    {
        private readonly ChatClient _chatClient;
        private readonly ILogger<MangaAIService> _logger;

        public MangaAIService(IConfiguration configuration, ILogger<MangaAIService> logger)
        {
            _logger = logger;
            var apiKey = configuration["OpenAI:ApiKey"];
            
            if (string.IsNullOrEmpty(apiKey) || apiKey == "VOTRE_CLE_API_OPENAI")
            {
                _logger.LogWarning("OpenAI API Key not configured");
                _chatClient = null!;
            }
            else
            {
                _chatClient = new ChatClient("gpt-4o-mini", apiKey);
            }
        }

        public async Task<MangaRecommendationResponseDto> GetRecommendationsAsync(string description)
        {
            var response = new MangaRecommendationResponseDto();

            if (_chatClient == null)
            {
                response.Message = "Le service IA n'est pas configuré. Veuillez configurer la clé API OpenAI.";
                return response;
            }

            try
            {
                var systemPrompt = @"Tu es un expert en manga avec une connaissance encyclopédique de tous les mangas existants. 
Ton rôle est de recommander des mangas basés sur la description fournie par l'utilisateur.
Tu dois TOUJOURS répondre avec exactement 15 noms de mangas, un par ligne.
Ne donne que les noms des mangas, sans numérotation, sans description, sans explication.
Assure-toi que les mangas recommandés correspondent bien à la description donnée.";

                var userPrompt = $"Voici la description de ce que je recherche : {description}\n\nDonne-moi 15 noms de mangas qui correspondent à cette description.";

                var messages = new List<ChatMessage>
                {
                    new SystemChatMessage(systemPrompt),
                    new UserChatMessage(userPrompt)
                };

                var chatCompletion = await _chatClient.CompleteChatAsync(messages);
                var content = chatCompletion.Value.Content[0].Text;

                // Parser la réponse pour extraire les noms de manga
                var mangaNames = content
                    .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                    .Select(line => line.Trim())
                    .Where(line => !string.IsNullOrWhiteSpace(line))
                    .Select(line => 
                    {
                        // Nettoyer les numéros au début si présents (1. , 1) , 1- , etc.)
                        var cleaned = System.Text.RegularExpressions.Regex.Replace(line, @"^\d+[\.\)\-\s]+", "");
                        return cleaned.Trim();
                    })
                    .Where(name => !string.IsNullOrWhiteSpace(name))
                    .Take(15)
                    .ToList();

                response.Recommendations = mangaNames;
                response.Message = $"{mangaNames.Count} recommandations trouvées";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'appel à OpenAI");
                response.Message = $"Erreur lors de la génération des recommandations: {ex.Message}";
            }

            return response;
        }
    }
}
