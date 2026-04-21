using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeridianEats.API.Data;
using MeridianEats.API.DTOs;
using MeridianEats.API.Helpers;
using MeridianEats.API.Models;

namespace MeridianEats.API.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly AppDbContext _db;
    public CartController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = UserHelper.GetUserId(User);
        return Ok(await _db.CartItems.Include(c => c.FoodItem)
            .Where(c => c.UserId == userId)
            .Select(c => new CartItemDto
            {
                Id = c.Id, FoodItemId = c.FoodItemId,
                Name = c.FoodItem.Name, Price = c.FoodItem.Price,
                ImageUrl = c.FoodItem.ImageUrl, Quantity = c.Quantity,
                Subtotal = c.FoodItem.Price * c.Quantity
            }).ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Add(AddToCartDto dto)
    {
        var userId = UserHelper.GetUserId(User);
        var food = await _db.FoodItems.FindAsync(dto.FoodItemId);
        if (food == null || !food.IsAvailable)
            return BadRequest(new { message = "Item not available" });

        var existing = await _db.CartItems
            .FirstOrDefaultAsync(c => c.UserId == userId && c.FoodItemId == dto.FoodItemId);

        if (existing != null) existing.Quantity += dto.Quantity;
        else _db.CartItems.Add(new CartItem
            { UserId = userId, FoodItemId = dto.FoodItemId, Quantity = dto.Quantity });

        await _db.SaveChangesAsync();
        return Ok(new { message = "Added to cart" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateCartDto dto)
    {
        var userId = UserHelper.GetUserId(User);
        var item = await _db.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item == null) return NotFound(new { message = "Not found" });

        if (dto.Quantity <= 0) _db.CartItems.Remove(item);
        else item.Quantity = dto.Quantity;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Updated" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(int id)
    {
        var userId = UserHelper.GetUserId(User);
        var item = await _db.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (item == null) return NotFound(new { message = "Not found" });

        _db.CartItems.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Removed" });
    }

    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        var userId = UserHelper.GetUserId(User);
        _db.CartItems.RemoveRange(_db.CartItems.Where(c => c.UserId == userId));
        await _db.SaveChangesAsync();
        return Ok(new { message = "Cart cleared" });
    }
}