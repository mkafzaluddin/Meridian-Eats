using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MeridianEats.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FoodItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<double>(type: "float", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FoodItems_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    State = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ZipCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FoodItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_FoodItems_FoodItemId",
                        column: x => x.FoodItemId,
                        principalTable: "FoodItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    FoodItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_FoodItems_FoodItemId",
                        column: x => x.FoodItemId,
                        principalTable: "FoodItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "ImageUrl", "Name" },
                values: new object[,]
                {
                    { 1, "menu_1.png", "Salad" },
                    { 2, "menu_2.png", "Rolls" },
                    { 3, "menu_3.png", "Deserts" },
                    { 4, "menu_4.png", "Sandwich" },
                    { 5, "menu_5.png", "Cake" },
                    { 6, "menu_6.png", "Pure Veg" },
                    { 7, "menu_7.png", "Pasta" },
                    { 8, "menu_8.png", "Noodles" }
                });

            migrationBuilder.InsertData(
                table: "FoodItems",
                columns: new[] { "Id", "CategoryId", "Description", "ImageUrl", "IsAvailable", "Name", "Price", "Rating" },
                values: new object[,]
                {
                    { 1, 1, "Food provides essential nutrients for overall health and well-being", "food_1.png", true, "Greek salad", 12m, 4.0 },
                    { 2, 1, "Food provides essential nutrients for overall health and well-being", "food_2.png", true, "Veg salad", 18m, 4.0 },
                    { 3, 1, "Food provides essential nutrients for overall health and well-being", "food_3.png", true, "Clover Salad", 16m, 4.0 },
                    { 4, 1, "Food provides essential nutrients for overall health and well-being", "food_4.png", true, "Chicken Salad", 24m, 4.0 },
                    { 5, 2, "Food provides essential nutrients for overall health and well-being", "food_5.png", true, "Lasagna Rolls", 14m, 4.0 },
                    { 6, 2, "Food provides essential nutrients for overall health and well-being", "food_6.png", true, "Peri Peri Rolls", 12m, 4.0 },
                    { 7, 2, "Food provides essential nutrients for overall health and well-being", "food_7.png", true, "Chicken Rolls", 20m, 4.0 },
                    { 8, 2, "Food provides essential nutrients for overall health and well-being", "food_8.png", true, "Veg Rolls", 15m, 4.0 },
                    { 9, 3, "Food provides essential nutrients for overall health and well-being", "food_9.png", true, "Ripple Ice Cream", 14m, 4.0 },
                    { 10, 3, "Food provides essential nutrients for overall health and well-being", "food_10.png", true, "Fruit Ice Cream", 22m, 4.0 },
                    { 11, 3, "Food provides essential nutrients for overall health and well-being", "food_11.png", true, "Jar Ice Cream", 10m, 4.0 },
                    { 12, 3, "Food provides essential nutrients for overall health and well-being", "food_12.png", true, "Vanilla Ice Cream", 12m, 4.0 },
                    { 13, 4, "Food provides essential nutrients for overall health and well-being", "food_13.png", true, "Chicken Sandwich", 12m, 4.0 },
                    { 14, 4, "Food provides essential nutrients for overall health and well-being", "food_14.png", true, "Vegan Sandwich", 18m, 4.0 },
                    { 15, 4, "Food provides essential nutrients for overall health and well-being", "food_15.png", true, "Grilled Sandwich", 16m, 4.0 },
                    { 16, 4, "Food provides essential nutrients for overall health and well-being", "food_16.png", true, "Bread Sandwich", 24m, 4.0 },
                    { 17, 5, "Food provides essential nutrients for overall health and well-being", "food_17.png", true, "Cup Cake", 14m, 4.0 },
                    { 18, 5, "Food provides essential nutrients for overall health and well-being", "food_18.png", true, "Vegan Cake", 12m, 4.0 },
                    { 19, 5, "Food provides essential nutrients for overall health and well-being", "food_19.png", true, "Butterscotch Cake", 20m, 4.0 },
                    { 20, 5, "Food provides essential nutrients for overall health and well-being", "food_20.png", true, "Sliced Cake", 15m, 4.0 },
                    { 21, 6, "Food provides essential nutrients for overall health and well-being", "food_21.png", true, "Garlic Mushroom", 14m, 4.0 },
                    { 22, 6, "Food provides essential nutrients for overall health and well-being", "food_22.png", true, "Fried Cauliflower", 22m, 4.0 },
                    { 23, 6, "Food provides essential nutrients for overall health and well-being", "food_23.png", true, "Mix Veg Pulao", 10m, 4.0 },
                    { 24, 6, "Food provides essential nutrients for overall health and well-being", "food_24.png", true, "Rice Zucchini", 12m, 4.0 },
                    { 25, 7, "Food provides essential nutrients for overall health and well-being", "food_25.png", true, "Cheese Pasta", 12m, 4.0 },
                    { 26, 7, "Food provides essential nutrients for overall health and well-being", "food_26.png", true, "Tomato Pasta", 18m, 4.0 },
                    { 27, 7, "Food provides essential nutrients for overall health and well-being", "food_27.png", true, "Creamy Pasta", 16m, 4.0 },
                    { 28, 7, "Food provides essential nutrients for overall health and well-being", "food_28.png", true, "Chicken Pasta", 24m, 4.0 },
                    { 29, 8, "Food provides essential nutrients for overall health and well-being", "food_29.png", true, "Buttter Noodles", 14m, 4.0 },
                    { 30, 8, "Food provides essential nutrients for overall health and well-being", "food_30.png", true, "Veg Noodles", 12m, 4.0 },
                    { 31, 8, "Food provides essential nutrients for overall health and well-being", "food_31.png", true, "Somen Noodles", 20m, 4.0 },
                    { 32, 8, "Food provides essential nutrients for overall health and well-being", "food_32.png", true, "Cooked Noodles", 15m, 4.0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_FoodItemId",
                table: "CartItems",
                column: "FoodItemId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_UserId",
                table: "CartItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FoodItems_CategoryId",
                table: "FoodItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_FoodItemId",
                table: "OrderItems",
                column: "FoodItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "FoodItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
