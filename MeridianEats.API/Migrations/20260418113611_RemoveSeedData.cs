using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MeridianEats.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 8);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
