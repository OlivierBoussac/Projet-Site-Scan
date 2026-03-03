using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PSS_Backend.src.Models
{
    [Table("SUB")]
    public class Sub
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("id_manga")]
        [MaxLength(255)]
        public string IdManga { get; set; } = string.Empty;

        [Column("name_manga")]
        [MaxLength(255)]
        public string NameManga { get; set; } = string.Empty;

        [Column("last_chapter_read")]
        [MaxLength(255)]
        public string LastChapterRead { get; set; } = string.Empty;

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}
