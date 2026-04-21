using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeridianEats.API.Data;
using MeridianEats.API.DTOs;
using MeridianEats.API.Models;
using MeridianEats.API.Services;

namespace MeridianEats.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext      _db;
    private readonly CloudinaryService _cloudinary;

    public AdminController(AppDbContext db, CloudinaryService cloudinary)
    {
        _db         = db;
        _cloudinary = cloudinary;
    }

    // ── Dashboard ─────────────────────────────────────────────────────

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var totalOrders    = await _db.Orders.CountAsync();
        var totalCustomers = await _db.Users.CountAsync(u => u.Role == "Customer");
        var totalRevenue   = await _db.Orders
            .Where(o => o.Status == "Delivered")
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
        var pendingOrders  = await _db.Orders
            .CountAsync(o => o.Status == "Pending");

        var topItems = await _db.OrderItems
            .Include(oi => oi.FoodItem)
            .GroupBy(oi => new { oi.FoodItemId, oi.FoodItem.Name, oi.FoodItem.ImageUrl })
            .Select(g => new TopItemDto
            {
                Name      = g.Key.Name,
                ImageUrl  = g.Key.ImageUrl,
                TotalSold = g.Sum(x => x.Quantity),
                Revenue   = g.Sum(x => x.Quantity * x.UnitPrice)
            })
            .OrderByDescending(x => x.TotalSold)
            .Take(5)
            .ToListAsync();

        var recentOrders = await _db.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(10)
            .Select(o => new RecentOrderDto
            {
                Id           = o.Id,
                CustomerName = o.User.Name,
                TotalAmount  = o.TotalAmount,
                Status       = o.Status,
                CreatedAt    = o.CreatedAt
            })
            .ToListAsync();

        return Ok(new DashboardStatsDto
        {
            TotalOrders    = totalOrders,
            TotalCustomers = totalCustomers,
            TotalRevenue   = totalRevenue,
            PendingOrders  = pendingOrders,
            TopItems       = topItems,
            RecentOrders   = recentOrders
        });
    }

    // ── Categories ────────────────────────────────────────────────────

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() =>
        Ok(await _db.Categories.OrderBy(c => c.Name).ToListAsync());

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory(
        [FromForm] CreateCategoryDto dto,
        IFormFile? image)
    {
        var imageUrl = "";
        if (image != null)
            imageUrl = await _cloudinary.UploadImageAsync(image, "categories");

        var category = new Category { Name = dto.Name, ImageUrl = imageUrl };
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return Ok(category);
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        [FromForm] UpdateCategoryDto dto,
        IFormFile? image)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return NotFound(new { message = "Category not found." });

        category.Name = dto.Name;
        if (image != null)
            category.ImageUrl = await _cloudinary.UploadImageAsync(image, "categories");

        await _db.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return NotFound(new { message = "Category not found." });

        var hasFoods = await _db.FoodItems.AnyAsync(f => f.CategoryId == id);
        if (hasFoods)
            return BadRequest(new { message = "Cannot delete category with existing food items." });

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Category deleted." });
    }

    // ── Food Items ────────────────────────────────────────────────────

    [HttpGet("foods")]
    public async Task<IActionResult> GetFoods() =>
        Ok(await _db.FoodItems
            .Include(f => f.Category)
            .OrderBy(f => f.CategoryId).ThenBy(f => f.Name)
            .Select(f => new FoodItemDto
            {
                Id           = f.Id,
                Name         = f.Name,
                Description  = f.Description,
                Price        = f.Price,
                ImageUrl     = f.ImageUrl,
                Rating       = f.Rating,
                IsAvailable  = f.IsAvailable,
                CategoryId   = f.CategoryId,
                CategoryName = f.Category.Name
            })
            .ToListAsync());

    [HttpPost("foods")]
    public async Task<IActionResult> CreateFood([FromForm] CreateFoodDto dto)
    {
        var imageUrl = "";
        if (dto.Image != null)
            imageUrl = await _cloudinary.UploadImageAsync(dto.Image, "foods");

        var food = new FoodItem
        {
            Name        = dto.Name,
            Description = dto.Description,
            Price       = dto.Price,
            CategoryId  = dto.CategoryId,
            IsAvailable = dto.IsAvailable,
            ImageUrl    = imageUrl
        };
        _db.FoodItems.Add(food);
        await _db.SaveChangesAsync();
        return Ok(food);
    }

    [HttpPut("foods/{id}")]
    public async Task<IActionResult> UpdateFood(int id, [FromForm] UpdateFoodDto dto)
    {
        var food = await _db.FoodItems.FindAsync(id);
        if (food == null) return NotFound(new { message = "Food item not found." });

        food.Name        = dto.Name;
        food.Description = dto.Description;
        food.Price       = dto.Price;
        food.CategoryId  = dto.CategoryId;
        food.IsAvailable = dto.IsAvailable;

        if (dto.Image != null)
            food.ImageUrl = await _cloudinary.UploadImageAsync(dto.Image, "foods");

        await _db.SaveChangesAsync();
        return Ok(food);
    }

    [HttpDelete("foods/{id}")]
    public async Task<IActionResult> DeleteFood(int id)
    {
        var food = await _db.FoodItems.FindAsync(id);
        if (food == null) return NotFound(new { message = "Food item not found." });

        _db.FoodItems.Remove(food);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Food item deleted." });
    }

    // ── Orders ────────────────────────────────────────────────────────

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders(
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.FoodItem)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => new
            {
                o.Id, o.CreatedAt, o.Status, o.TotalAmount,
                o.Street, o.City, o.State, o.ZipCode, o.Phone,
                Customer = o.User.Name,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.FoodItem.Name,
                    oi.Quantity,
                    oi.UnitPrice
                })
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, orders });
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound(new { message = "Order not found." });

        order.Status = dto.Status;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Status updated.", status = order.Status });
    }
}