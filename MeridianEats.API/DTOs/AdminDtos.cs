using System.ComponentModel.DataAnnotations;

namespace MeridianEats.API.DTOs;

// ── Category ──────────────────────────────────────────────────────────
public class CreateCategoryDto
{
    [Required(ErrorMessage = "Category name is required.")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
}

public class UpdateCategoryDto
{
    [Required(ErrorMessage = "Category name is required.")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
}

// ── Food ──────────────────────────────────────────────────────────────
public class CreateFoodDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0.01, 10000, ErrorMessage = "Price must be between $0.01 and $10,000.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Category is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid category.")]
    public int CategoryId { get; set; }

    public bool IsAvailable { get; set; } = true;

    // Image sent as multipart form
    public IFormFile? Image { get; set; }
}

public class UpdateFoodDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(200, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(1000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0.01, 10000, ErrorMessage = "Price must be between $0.01 and $10,000.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Category is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid category.")]
    public int CategoryId { get; set; }

    public bool IsAvailable { get; set; } = true;

    // Optional — only if replacing image
    public IFormFile? Image { get; set; }
}

// ── Order ─────────────────────────────────────────────────────────────
public class UpdateOrderStatusDto
{
    [Required]
    [RegularExpression("Pending|Confirmed|Preparing|Dispatched|Delivered|Cancelled",
        ErrorMessage = "Invalid status.")]
    public string Status { get; set; } = string.Empty;
}

// ── Dashboard ─────────────────────────────────────────────────────────
public class DashboardStatsDto
{
    public int     TotalOrders    { get; set; }
    public int     TotalCustomers { get; set; }
    public decimal TotalRevenue   { get; set; }
    public int     PendingOrders  { get; set; }
    public List<TopItemDto>      TopItems      { get; set; } = new();
    public List<RecentOrderDto>  RecentOrders  { get; set; } = new();
}

public class TopItemDto
{
    public string Name       { get; set; } = string.Empty;
    public string ImageUrl   { get; set; } = string.Empty;
    public int    TotalSold  { get; set; }
    public decimal Revenue   { get; set; }
}

public class RecentOrderDto
{
    public int      Id          { get; set; }
    public string   CustomerName { get; set; } = string.Empty;
    public decimal  TotalAmount { get; set; }
    public string   Status      { get; set; } = string.Empty;
    public DateTime CreatedAt   { get; set; }
}