// CartDtos.cs
using System.ComponentModel.DataAnnotations;

namespace MeridianEats.API.DTOs;

public class AddToCartDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid food item.")]
    public int FoodItemId { get; set; }

    [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100.")]
    public int Quantity { get; set; } = 1;
}

public class UpdateCartDto
{
    [Range(0, 100, ErrorMessage = "Quantity must be between 0 and 100.")]
    public int Quantity { get; set; }
}

public class CartItemDto
{
    public int     Id         { get; set; }
    public int     FoodItemId { get; set; }
    public string  Name       { get; set; } = string.Empty;
    public decimal Price      { get; set; }
    public string  ImageUrl   { get; set; } = string.Empty;
    public int     Quantity   { get; set; }
    public decimal Subtotal   { get; set; }
}