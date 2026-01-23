const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs"); // 🔹 import bcrypt
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // 🔹 HASH PASSWORD
   const hashedPassword = await bcrypt.hash("123456", 10);

    const createUser = await User.create({
      name: "Admin user",
      email: "admin@example.com",
      password: hashedPassword, // ✅ hashed
      role: "admin",
    });

    const userID = createUser._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: userID,
    }));

    await Product.insertMany(sampleProducts);

    console.log("Product data seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding the data:", err);
    process.exit(1);
  }
};

seedData();
