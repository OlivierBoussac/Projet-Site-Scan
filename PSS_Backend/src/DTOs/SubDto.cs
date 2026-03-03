namespace PSS_Backend.src.DTOs
{
    public class SubDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string IdManga { get; set; } = string.Empty;
        public string NameManga { get; set; } = string.Empty;
        public string LastChapterRead { get; set; } = string.Empty;
    }

    public class CreateSubDto
    {
        public int UserId { get; set; }
        public string IdManga { get; set; } = string.Empty;
        public string NameManga { get; set; } = string.Empty;
        public string LastChapterRead { get; set; } = string.Empty;
    }

    public class UpdateSubDto
    {
        public string? LastChapterRead { get; set; }
    }
}
