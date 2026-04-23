// OrderDtos.cs
using System.ComponentModel.DataAnnotations;

namespace MeridianEats.API.DTOs;

public class PlaceOrderDto
{
    [Required(ErrorMessage = "Street is required.")]
    [StringLength(200, MinimumLength = 5, ErrorMessage = "Street must be 5–200 characters.")]
    public string Street { get; set; } = string.Empty;

    [Required(ErrorMessage = "City is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "City must be 2–100 characters.")]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "State is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "State must be 2–50 characters.")]
    public string State { get; set; } = string.Empty;

    [Required(ErrorMessage = "Zip code is required.")]
    [RegularExpression(@"^\d{5}(-\d{4})?$", ErrorMessage = "Enter a valid zip code (e.g. 60601).")]
    public string ZipCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone is required.")]
    [RegularExpression(@"^\+?[\d\s\-().]{7,15}$", ErrorMessage = "Enter a valid phone number.")]
    public string Phone { get; set; } = string.Empty;
     public decimal GrandTotal { get; set; }
}

public class OrderItemDto
{
    public int     FoodItemId   { get; set; }
    public string  FoodItemName { get; set; } = string.Empty;
    public string  ImageUrl     { get; set; } = string.Empty;
    public int     Quantity     { get; set; }
    public decimal UnitPrice    { get; set; }
    public decimal Subtotal     { get; set; }
}

public class OrderDto
{
    public int            Id          { get; set; }
    public DateTime       CreatedAt   { get; set; }
    public string         Status      { get; set; } = string.Empty;
    public decimal        TotalAmount { get; set; }
    public string         Street      { get; set; } = string.Empty;
    public string         City        { get; set; } = string.Empty;
    public string         State       { get; set; } = string.Empty;
    public string         ZipCode     { get; set; } = string.Empty;
    public string         Phone       { get; set; } = string.Empty;
    public List<OrderItemDto> Items   { get; set; } = new();
}