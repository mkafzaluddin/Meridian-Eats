using Microsoft.EntityFrameworkCore;
using MeridianEats.API.Models;

namespace MeridianEats.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User>      Users      => Set<User>();
    public DbSet<Category>  Categories => Set<Category>();
    public DbSet<FoodItem>  FoodItems  => Set<FoodItem>();
    public DbSet<CartItem>  CartItems  => Set<CartItem>();
    public DbSet<Order>     Orders     => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<FoodItem>()
            .Property(f => f.Price)
            .HasColumnType("numeric(10,2)");

        builder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasColumnType("numeric(10,2)");

        builder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasColumnType("numeric(10,2)");
    }
}