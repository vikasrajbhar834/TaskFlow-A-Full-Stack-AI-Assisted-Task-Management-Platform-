const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ====================
// HOME
// ====================

app.get("/", (req, res) => {
  res.json({
    message: "FoodGo API is running successfully!",
    status: "success"
  });
});

// ====================
// USERS
// ====================

const users = [];

// REGISTER
app.post("/api/register", (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({
      message: "Please provide all registration details"
    });
  }

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered. Please login."
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    mobile,
    password
  };

  users.push(newUser);

  console.log("New user registered:", email);

  res.status(201).json({
    message: "Registration successful!",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile
    }
  });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  console.log("User logged in:", email);

  res.json({
    message: "Login successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile
    }
  });
});

// ====================
// RESTAURANTS
// ====================

const restaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    cuisine: "Pizza, Italian",
    rating: 4.5,
    deliveryTime: "25-30 min"
  },
  {
    id: 2,
    name: "Burger House",
    cuisine: "Burgers, Fast Food",
    rating: 4.3,
    deliveryTime: "20-25 min"
  },
  {
    id: 3,
    name: "Biryani Express",
    cuisine: "Biryani, North Indian",
    rating: 4.6,
    deliveryTime: "30-35 min"
  }
];

app.get("/api/restaurants", (req, res) => {
  res.json(restaurants);
});

// ====================
// MENU
// ====================

const menus = {
  1: [
    {
      id: 101,
      name: "Margherita Pizza",
      price: 249,
      category: "Pizza"
    },
    {
      id: 102,
      name: "Farmhouse Pizza",
      price: 349,
      category: "Pizza"
    },
    {
      id: 103,
      name: "Cheese Garlic Bread",
      price: 149,
      category: "Sides"
    }
  ],

  2: [
    {
      id: 201,
      name: "Classic Burger",
      price: 179,
      category: "Burger"
    },
    {
      id: 202,
      name: "Cheese Burger",
      price: 229,
      category: "Burger"
    },
    {
      id: 203,
      name: "French Fries",
      price: 99,
      category: "Sides"
    }
  ],

  3: [
    {
      id: 301,
      name: "Chicken Biryani",
      price: 299,
      category: "Biryani"
    },
    {
      id: 302,
      name: "Veg Biryani",
      price: 199,
      category: "Biryani"
    },
    {
      id: 303,
      name: "Raita",
      price: 49,
      category: "Sides"
    }
  ]
};

app.get("/api/restaurants/:id/menu", (req, res) => {
  const restaurantId = Number(req.params.id);

  if (!menus[restaurantId]) {
    return res.status(404).json({
      message: "Restaurant menu not found"
    });
  }

  res.json(menus[restaurantId]);
});

// ====================
// ORDERS
// ====================

const orders = [];

app.post("/api/orders", (req, res) => {
  const {
    name,
    mobile,
    address,
    items,
    total,
    paymentMethod
  } = req.body;

  if (
    !name ||
    !mobile ||
    !address ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !paymentMethod
  ) {
    return res.status(400).json({
      message: "Please provide all order details"
    });
  }

  const newOrder = {
    id: orders.length + 1,
    name,
    mobile,
    address,
    items,
    total,
    paymentMethod,
    status: "Order Placed",
    createdAt: new Date()
  };

  orders.push(newOrder);

  console.log("New order:", newOrder.id);

  res.status(201).json({
    message: "Order placed successfully!",
    order: newOrder
  });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ====================
// START SERVER
// ====================

app.listen(PORT, () => {
  console.log(`FoodGo backend running on http://localhost:${PORT}`);
});