// seed.js — run with: node seed.js
// Make sure your backend is running on port 5101 first
const API = "http://localhost:5101/api";
const fs = require("fs");
const path = require("path");

// ── 1. Login as admin to get token ───────────────────────────────────
async function getToken() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "khaja@gmail.com", // ← change this to your admin email
      password: "Admin@12345", // ← change this to your password
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Login failed: " + data.message);
  console.log("✅ Logged in as", data.name);
  return data.token;
}

// ── 2. Create categories ─────────────────────────────────────────────
const categories = [
  { name: "Salad", image: "menu_1.png" },
  { name: "Rolls", image: "menu_2.png" },
  { name: "Deserts", image: "menu_3.png" },
  { name: "Sandwich", image: "menu_4.png" },
  { name: "Cake", image: "menu_5.png" },
  { name: "Pure Veg", image: "menu_6.png" },
  { name: "Pasta", image: "menu_7.png" },
  { name: "Noodles", image: "menu_8.png" },
];

async function seedCategories(token) {
  const created = {};
  for (const cat of categories) {
    const imgPath = path.join(__dirname, "src", "assets", cat.image);
    const imgBlob = new Blob([fs.readFileSync(imgPath)], { type: "image/png" });

    const fd = new FormData();
    fd.append("name", cat.name);
    fd.append("image", imgBlob, cat.image);

    const res = await fetch(`${API}/admin/categories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(`⚠️  Category "${cat.name}" skipped:`, data.message);
    } else {
      created[cat.name] = data.id;
      console.log(`✅ Category "${cat.name}" created (id: ${data.id})`);
    }
  }
  return created;
}

// ── 3. Create food items ─────────────────────────────────────────────
const foods = [
  { name: "Greek salad", category: "Salad", price: 12, image: "food_1.png" },
  { name: "Veg salad", category: "Salad", price: 18, image: "food_2.png" },
  { name: "Clover Salad", category: "Salad", price: 16, image: "food_3.png" },
  { name: "Chicken Salad", category: "Salad", price: 24, image: "food_4.png" },
  { name: "Lasagna Rolls", category: "Rolls", price: 14, image: "food_5.png" },
  {
    name: "Peri Peri Rolls",
    category: "Rolls",
    price: 12,
    image: "food_6.png",
  },
  { name: "Chicken Rolls", category: "Rolls", price: 20, image: "food_7.png" },
  { name: "Veg Rolls", category: "Rolls", price: 15, image: "food_8.png" },
  {
    name: "Ripple Ice Cream",
    category: "Deserts",
    price: 14,
    image: "food_9.png",
  },
  {
    name: "Fruit Ice Cream",
    category: "Deserts",
    price: 22,
    image: "food_10.png",
  },
  {
    name: "Jar Ice Cream",
    category: "Deserts",
    price: 10,
    image: "food_11.png",
  },
  {
    name: "Vanilla Ice Cream",
    category: "Deserts",
    price: 12,
    image: "food_12.png",
  },
  {
    name: "Chicken Sandwich",
    category: "Sandwich",
    price: 12,
    image: "food_13.png",
  },
  {
    name: "Vegan Sandwich",
    category: "Sandwich",
    price: 18,
    image: "food_14.png",
  },
  {
    name: "Grilled Sandwich",
    category: "Sandwich",
    price: 16,
    image: "food_15.png",
  },
  {
    name: "Bread Sandwich",
    category: "Sandwich",
    price: 24,
    image: "food_16.png",
  },
  { name: "Cup Cake", category: "Cake", price: 14, image: "food_17.png" },
  { name: "Vegan Cake", category: "Cake", price: 12, image: "food_18.png" },
  {
    name: "Butterscotch Cake",
    category: "Cake",
    price: 20,
    image: "food_19.png",
  },
  { name: "Sliced Cake", category: "Cake", price: 15, image: "food_20.png" },
  {
    name: "Garlic Mushroom",
    category: "Pure Veg",
    price: 14,
    image: "food_21.png",
  },
  {
    name: "Fried Cauliflower",
    category: "Pure Veg",
    price: 22,
    image: "food_22.png",
  },
  {
    name: "Mix Veg Pulao",
    category: "Pure Veg",
    price: 10,
    image: "food_23.png",
  },
  {
    name: "Rice Zucchini",
    category: "Pure Veg",
    price: 12,
    image: "food_24.png",
  },
  { name: "Cheese Pasta", category: "Pasta", price: 12, image: "food_25.png" },
  { name: "Tomato Pasta", category: "Pasta", price: 18, image: "food_26.png" },
  { name: "Creamy Pasta", category: "Pasta", price: 16, image: "food_27.png" },
  { name: "Chicken Pasta", category: "Pasta", price: 24, image: "food_28.png" },
  {
    name: "Butter Noodles",
    category: "Noodles",
    price: 14,
    image: "food_29.png",
  },
  { name: "Veg Noodles", category: "Noodles", price: 12, image: "food_30.png" },
  {
    name: "Somen Noodles",
    category: "Noodles",
    price: 20,
    image: "food_31.png",
  },
  {
    name: "Cooked Noodles",
    category: "Noodles",
    price: 15,
    image: "food_32.png",
  },
];

const DESC =
  "Food provides essential nutrients for overall health and well-being";

async function seedFoods(token, categoryMap) {
  for (const food of foods) {
    const categoryId = categoryMap[food.category];
    if (!categoryId) {
      console.log(
        `⚠️  Skipping "${food.name}" — category "${food.category}" not found`,
      );
      continue;
    }

    const imgPath = path.join(__dirname, "src", "assets", food.image);
    const imgBlob = new Blob([fs.readFileSync(imgPath)], { type: "image/png" });

    const fd = new FormData();
    fd.append("name", food.name);
    fd.append("description", DESC);
    fd.append("price", food.price);
    fd.append("categoryId", categoryId);
    fd.append("isAvailable", true);
    fd.append("image", imgBlob, food.image);

    const res = await fetch(`${API}/admin/foods`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(`⚠️  Food "${food.name}" skipped:`, data.message);
    } else {
      console.log(`✅ Food "${food.name}" created`);
    }
  }
}

// ── Run ───────────────────────────────────────────────────────────────
(async () => {
  try {
    const token = await getToken();
    const categoryMap = await seedCategories(token);
    await seedFoods(token, categoryMap);
    console.log("\n🎉 Seed complete! All categories and food items added.");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  }
})();
