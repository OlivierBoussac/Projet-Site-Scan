using Microsoft.AspNetCore.Mvc;
using PSS_Backend.src.DTOs;
using PSS_Backend.src.Services;

namespace PSS_Backend.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubsController : ControllerBase
    {
        private readonly ISubService _subService;

        public SubsController(ISubService subService)
        {
            _subService = subService;
        }

        // GET: api/subs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubDto>>> GetAll()
        {
            var subs = await _subService.GetAllAsync();
            return Ok(subs);
        }

        // GET: api/subs/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<SubDto>>> GetByUserId(int userId)
        {
            var subs = await _subService.GetByUserIdAsync(userId);
            return Ok(subs);
        }

        // GET: api/subs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubDto>> GetById(int id)
        {
            var sub = await _subService.GetByIdAsync(id);
            if (sub == null)
                return NotFound();

            return Ok(sub);
        }

        // GET: api/subs/user/5/manga/{idManga}
        [HttpGet("user/{userId}/manga/{idManga}")]
        public async Task<ActionResult<SubDto>> GetByUserAndManga(int userId, string idManga)
        {
            var sub = await _subService.GetByUserAndMangaAsync(userId, idManga);
            if (sub == null)
                return NotFound();

            return Ok(sub);
        }

        // POST: api/subs
        [HttpPost]
        public async Task<ActionResult<SubDto>> Create(CreateSubDto dto)
        {
            var sub = await _subService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = sub.Id }, sub);
        }

        // PUT: api/subs/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SubDto>> Update(int id, UpdateSubDto dto)
        {
            var sub = await _subService.UpdateAsync(id, dto);
            if (sub == null)
                return NotFound();

            return Ok(sub);
        }

        // DELETE: api/subs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _subService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
