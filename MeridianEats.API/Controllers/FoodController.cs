using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeridianEats.API.Data;
using MeridianEats.API.DTOs;
using MeridianEats.API.Models;

namespace MeridianEats.API.Controllers;

[ApiController]
[Route("api/food")]
public class FoodController : ControllerBase
{
    private readonly AppDbContext _db;
    public FoodController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var query = _db.FoodItems.Include(f => f.Category).Where(f => f.IsAvailable);
        if (!string.IsNullOrEmpty(category))
            query = query.Where(f => f.Category.Name == category);

        return Ok(await query.Select(f => new FoodItemDto
        {
            Id = f.Id, Name = f.Name, Description = f.Description,
            Price = f.Price, ImageUrl = f.ImageUrl, Rating = f.Rating,
            IsAvailable = f.IsAvailable, CategoryId = f.CategoryId,
            CategoryName = f.Category.Name
        }).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _db.FoodItems.Include(f => f.Category)
            .Where(f => f.Id == id)
            .Select(f => new FoodItemDto
            {
                Id = f.Id, Name = f.Name, Description = f.Description,
                Price = f.Price, ImageUrl = f.ImageUrl, Rating = f.Rating,
                IsAvailable = f.IsAvailable, CategoryId = f.CategoryId,
                CategoryName = f.Category.Name
            }).FirstOrDefaultAsync();

        if (item == null) return NotFound(new { message = "Not found" });
        return Ok(item);
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        return Ok(await _db.Categories
            .Select(c => new { c.Id, c.Name, c.ImageUrl })
            .ToListAsync());
    }
}