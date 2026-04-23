using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeridianEats.API.Data;

namespace MeridianEats.API.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Categories
            .OrderBy(c => c.Id)
            .Select(c => new {
                c.Id,
                c.Name,
                c.ImageUrl  // ← add this
            })
            .ToListAsync());
}