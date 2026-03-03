using PSS_Backend.src.DTOs;

namespace PSS_Backend.src.Services
{
    public interface ISubService
    {
        Task<IEnumerable<SubDto>> GetAllAsync();
        Task<IEnumerable<SubDto>> GetByUserIdAsync(int userId);
        Task<SubDto?> GetByIdAsync(int id);
        Task<SubDto?> GetByUserAndMangaAsync(int userId, string idManga);
        Task<SubDto> CreateAsync(CreateSubDto dto);
        Task<SubDto?> UpdateAsync(int id, UpdateSubDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
