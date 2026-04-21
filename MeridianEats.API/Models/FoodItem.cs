namespace MeridianEats.API.Models;

public class FoodItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public double Rating { get; set; } = 4.0;
    public bool IsAvailable { get; set; } = true;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}