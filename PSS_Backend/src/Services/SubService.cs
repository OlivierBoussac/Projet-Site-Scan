using Microsoft.EntityFrameworkCore;
using PSS_Backend.src.Data;
using PSS_Backend.src.DTOs;
using PSS_Backend.src.Models;

namespace PSS_Backend.src.Services
{
    public class SubService : ISubService
    {
        private readonly ApplicationDbContext _context;

        public SubService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SubDto>> GetAllAsync()
        {
            return await _context.Subs
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<IEnumerable<SubDto>> GetByUserIdAsync(int userId)
        {
            return await _context.Subs
                .Where(s => s.UserId == userId)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<SubDto?> GetByIdAsync(int id)
        {
            var sub = await _context.Subs.FindAsync(id);
            return sub == null ? null : MapToDto(sub);
        }

        public async Task<SubDto?> GetByUserAndMangaAsync(int userId, string idManga)
        {
            var sub = await _context.Subs
                .FirstOrDefaultAsync(s => s.UserId == userId && s.IdManga == idManga);
            return sub == null ? null : MapToDto(sub);
        }

        public async Task<SubDto> CreateAsync(CreateSubDto dto)
        {
            var sub = new Sub
            {
                UserId = dto.UserId,
                IdManga = dto.IdManga,
                NameManga = dto.NameManga,
                LastChapterRead = dto.LastChapterRead
            };

            _context.Subs.Add(sub);
            await _context.SaveChangesAsync();

            return MapToDto(sub);
        }

        public async Task<SubDto?> UpdateAsync(int id, UpdateSubDto dto)
        {
            var sub = await _context.Subs.FindAsync(id);
            if (sub == null) return null;

            if (!string.IsNullOrEmpty(dto.LastChapterRead))
                sub.LastChapterRead = dto.LastChapterRead;

            await _context.SaveChangesAsync();
            return MapToDto(sub);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sub = await _context.Subs.FindAsync(id);
            if (sub == null) return false;

            _context.Subs.Remove(sub);
            await _context.SaveChangesAsync();
            return true;
        }

        private static SubDto MapToDto(Sub sub)
        {
            return new SubDto
            {
                Id = sub.Id,
                UserId = sub.UserId,
                IdManga = sub.IdManga,
                NameManga = sub.NameManga,
                LastChapterRead = sub.LastChapterRead
            };
        }
    }
}
