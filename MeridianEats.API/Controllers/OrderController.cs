using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeridianEats.API.Data;
using MeridianEats.API.DTOs;
using MeridianEats.API.Helpers;
using MeridianEats.API.Models;

namespace MeridianEats.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _db;
    public OrderController(AppDbContext db) => _db = db;

    [HttpPost]
    public async Task<IActionResult> Place(PlaceOrderDto dto)
    {
        var userId = UserHelper.GetUserId(User);
        var cartItems = await _db.CartItems.Include(c => c.FoodItem)
            .Where(c => c.UserId == userId).ToListAsync();

        if (!cartItems.Any()) return BadRequest(new { message = "Cart is empty" });

        var order = new Order
        {
            UserId      = userId,
           TotalAmount = dto.GrandTotal > 0 ? dto.GrandTotal : cartItems.Sum(c => c.FoodItem.Price * c.Quantity),
            Street      = dto.Street, City    = dto.City,
            State       = dto.State,  ZipCode = dto.ZipCode, Phone = dto.Phone,
            OrderItems  = cartItems.Select(c => new OrderItem
            {
                FoodItemId = c.FoodItemId,
                Quantity   = c.Quantity,
                UnitPrice  = c.FoodItem.Price
            }).ToList()
        };

        _db.Orders.Add(order);
        _db.CartItems.RemoveRange(cartItems);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Order placed", orderId = order.Id });
    }
    
    [HttpGet("{id}/track")]
public async Task<IActionResult> TrackOrder(int id)
{
    var userId = UserHelper.GetUserId(User);
    var order  = await _db.Orders
        .Include(o => o.OrderItems).ThenInclude(oi => oi.FoodItem)
        .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

    if (order == null) return NotFound(new { message = "Order not found." });

    return Ok(new
    {
        order.Id,
        order.Status,
        order.CreatedAt,
        order.TotalAmount,
        order.Street,
        order.City,
        order.State,
        Items = order.OrderItems.Select(oi => new
        {
            Name     = oi.FoodItem.Name,
            ImageUrl = oi.FoodItem.ImageUrl,
            oi.Quantity,
            oi.UnitPrice
        })
    });
}

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var userId = UserHelper.GetUserId(User);
        return Ok(await _db.Orders
            .Include(o => o.OrderItems).ThenInclude(oi => oi.FoodItem)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id, CreatedAt = o.CreatedAt, Status = o.Status,
                TotalAmount = o.TotalAmount, Street = o.Street, City = o.City,
                State = o.State, ZipCode = o.ZipCode, Phone = o.Phone,
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    FoodItemId   = oi.FoodItemId, 
                    FoodItemName = oi.FoodItem.Name, ImageUrl = oi.FoodItem.ImageUrl,
                    Quantity = oi.Quantity, UnitPrice = oi.UnitPrice,
                    Subtotal = oi.UnitPrice * oi.Quantity
                }).ToList()
            }).ToListAsync());
    }
}