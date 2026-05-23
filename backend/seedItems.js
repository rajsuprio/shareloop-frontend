import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/Item.js";

dotenv.config();

const userIds = [
  "6a10a695eb9a605185fcac46",
  "6a10a695eb9a605185fcac48",
  "6a10a99beb9a605185fcac49",
  "6a10a9afeb9a605185fcac4a",
  "6a10a9eeeb9a605185fcac4b",
];

const items = [
  {
    title: "Dell Inspiron Laptop",
    category: "Electronics",
    type: "Sell",
    price: "45000 BDT",
    location: "Dhaka",
    image: "https://picsum.photos/seed/1/600/400",
  },
  {
    title: "Programming Book Set",
    category: "Books",
    type: "Donate",
    price: "Free",
    location: "Rajshahi",
    image: "https://picsum.photos/seed/2/600/400",
  },
  {
    title: "Office Chair",
    category: "Furniture",
    type: "Borrow",
    price: "0 BDT",
    location: "Khulna",
    image: "https://picsum.photos/seed/3/600/400",
  },
  {
    title: "Winter Hoodie",
    category: "Clothing",
    type: "Sell",
    price: "1200 BDT",
    location: "Sylhet",
    image: "https://picsum.photos/seed/4/600/400",
  },
  {
    title: "Rice Package",
    category: "Food",
    type: "Donate",
    price: "Free",
    location: "Barishal",
    image: "https://picsum.photos/seed/5/600/400",
  },
];

const categories = [
  "Electronics",
  "Books",
  "Furniture",
  "Clothing",
  "Food",
  "Sports",
  "Stationery",
  "Vehicles",
  "Home Appliances",
  "Gaming",
];

const titles = [
  "Gaming Mouse",
  "Study Lamp",
  "Basketball",
  "Dining Table",
  "Android Phone",
  "Cookware Set",
  "JavaScript Guide",
  "Football Boots",
  "Printer",
  "Microwave Oven",
  "Tablet",
  "Sofa",
  "Backpack",
  "Water Bottle",
  "Camera",
  "Headphones",
  "Cricket Bat",
  "Electric Fan",
  "Air Fryer",
  "Keyboard",
  "Monitor",
  "Desk Organizer",
  "Cycling Helmet",
  "Refrigerator",
  "iPad",
  "Blanket",
  "T-Shirt",
  "Sneakers",
  "Notebook Pack",
  "Bluetooth Speaker",
  "Projector",
  "Washing Machine",
  "Router",
  "Power Bank",
  "Coffee Maker",
  "Bookshelf",
  "Calculator",
  "Smart Watch",
  "Bicycle",
  "Guitar",
  "Drill Machine",
  "Tripod",
  "Study Chair",
  "Rice Cooker",
  "Ceiling Fan",
];

const locations = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

const types = ["Donate", "Sell", "Borrow"];

for (let i = 0; i < 45; i++) {
  const type = types[i % types.length];

  items.push({
    title: `${titles[i % titles.length]} ${i + 1}`,
    category: categories[i % categories.length],
    type,
    price: type === "Donate" ? "Free" : `${(i + 2) * 250} BDT`,
    location: locations[i % locations.length],
    image: `https://picsum.photos/seed/item${i}/600/400`,
  });
}

const finalItems = items.map((item, index) => ({
  ...item,
  user: userIds[index % userIds.length],
}));

const seedItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Item.deleteMany();

    console.log("Old items removed");

    await Item.insertMany(finalItems);

    console.log("50 items inserted successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedItems();