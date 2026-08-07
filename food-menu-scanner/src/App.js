import React, { useState } from 'react';
import Fuse from 'fuse.js';
import './App.css';

const CATEGORY_LABELS = {
  south_indian: 'South Indian',
  extras: 'Extras',
  snacks: 'Snacks',
  pav_bhaji: 'Pav Bhaji',
  sandwich: 'Sandwich',
  pizza_burger: 'Pizza & Burger',
  chaat: 'Chaat',
  starters: 'Starters',
  salad: 'Salads',
  main_course: 'Main Course',
  rice: 'Rice',
  chinese_starters: 'Chinese Starters',
  soup: 'Soup',
  chinese_main_course: 'Chinese Main Course',
  chinese_noodles_rice: 'Chinese Noodles & Rice',
  baked_dishes: 'Baked Dishes',
  dessert: 'Desserts',
  lassi: 'Lassi',
  fresh_juices: 'Fresh Juices',
  milkshake: 'Milkshakes',
  falooda: 'Falooda',
  kulfi: 'Kulfi',
  scoops: 'Scoops',
};

const CATEGORY_SEARCH_KEYWORDS = {
  south_indian: ['idli', 'dosa', 'uttapam', 'vada', 'upma', 'sambar', 'chutney'],
  extras: ['butter', 'ghee', 'cheese'],
  snacks: ['bhature', 'samosa', 'vada', 'pakoda', 'toast', 'puri'],
  pav_bhaji: ['pav', 'bhaji', 'butter', 'pulav'],
  sandwich: ['bread', 'toast', 'grill', 'club', 'garlic', 'paneer'],
  pizza_burger: ['pizza', 'burger', 'cheese', 'base', 'bun'],
  chaat: ['puri', 'bhel', 'sev', 'tamarind', 'chutney'],
  starters: ['tikka', 'kabab', 'starter', 'tandoor'],
  salad: ['salad', 'raita', 'curd', 'papad'],
  main_course: ['paneer', 'veg', 'gravy', 'sabzi', 'kofta', 'dal'],
  rice: ['rice', 'biryani', 'pulav', 'khichdi', 'jeera'],
  chinese_starters: ['manchurian', 'crispy', 'chilly', 'dragon', 'roll'],
  soup: ['soup', 'clear', 'hot', 'sour', 'manchow'],
  chinese_main_course: ['hakka', 'schezwan', 'manchurian', 'chow', 'noodles'],
  chinese_noodles_rice: ['fried rice', 'noodles', 'schezwan', 'triple rice'],
  baked_dishes: ['baked', 'macaroni', 'cheese', 'pineapple'],
  dessert: ['sweet', 'jelly', 'ice cream', 'gulab jamun', 'fruit'],
  lassi: ['lassi', 'butter milk', 'sweet', 'salt'],
  fresh_juices: ['juice', 'lime', 'orange', 'apple', 'mango', 'carrot'],
  milkshake: ['milkshake', 'cold coffee', 'vanilla', 'mango', 'dry fruit'],
  falooda: ['falooda', 'kulfi', 'lassi', 'sweet'],
  kulfi: ['kulfi', 'ice cream', 'pista', 'malai'],
  scoops: ['scoop', 'ice cream', 'vanilla', 'chocolate', 'strawberry'],
};

function toSearchTerms(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category.replace(/_/g, ' ');
}

function buildIngredients(dish) {
  const nameTerms = toSearchTerms(dish.name);
  const categoryTerms = toSearchTerms(getCategoryLabel(dish.category));
  const keywords = CATEGORY_SEARCH_KEYWORDS[dish.category] || [];

  return Array.from(new Set([...keywords, ...nameTerms, ...categoryTerms]));
}

function normalizeDish(dish) {
  return {
    ...dish,
    categoryLabel: getCategoryLabel(dish.category),
    ingredients: dish.ingredients && dish.ingredients.length > 0 ? dish.ingredients : buildIngredients(dish),
  };
}

function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const scrollToSearch = () => {
    const target = document.getElementById('menu-search');

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const priceRangeOptions = [
    { value: "all", label: "All Prices" },
    { value: "under_100", label: "Under ₹100" },
    { value: "under_200", label: "Under ₹200" },
    { value: "under_300", label: "Under ₹300" },
    { value: "under_500", label: "Under ₹500" },
    { value: "under_600", label: "Under ₹600" },
  ];

  const rawDishes = [
    { id: 1, name: "Steam Idli", price: 55, category: "south_indian" },
    { id: 2, name: "Butter Idli", price: 75, category: "south_indian" },
    { id: 3, name: "Fry Idli", price: 75, category: "south_indian" },
    { id: 4, name: "Dahi Idli", price: 75, category: "south_indian" },
    { id: 5, name: "Idli Vada", price: 60, category: "south_indian" },
    { id: 6, name: "Medu Vada", price: 65, category: "south_indian" },
    { id: 7, name: "Sada Dosa", price: 65, category: "south_indian" },
    { id: 8, name: "Masala Dosa", price: 75, category: "south_indian" },
    { id: 9, name: "Mysore Sada Dosa", price: 80, category: "south_indian" },
    { id: 10, name: "Mysore Masala Dosa", price: 90, category: "south_indian" },
    { id: 11, name: "Rava Sada Dosa", price: 75, category: "south_indian" },
    { id: 12, name: "Rava Masala Dosa", price: 85, category: "south_indian" },
    { id: 13, name: "Onion Rava Sada Dosa", price: 80, category: "south_indian" },
    { id: 14, name: "Onion Rava Masala Dosa", price: 90, category: "south_indian" },
    { id: 15, name: "Paper Sada Dosa", price: 135, category: "south_indian" },
    { id: 16, name: "Paper Masala Dosa", price: 155, category: "south_indian" },
    { id: 17, name: "Palak Sada Dosa", price: 95, category: "south_indian" },
    { id: 18, name: "Palak Masala Dosa", price: 105, category: "south_indian" },
    { id: 19, name: "Schezwan Sada Dosa", price: 95, category: "south_indian" },
    { id: 20, name: "Schezwan Masala Dosa", price: 110, category: "south_indian" },
    { id: 21, name: "Set Dosa", price: 35, category: "south_indian" },
    { id: 22, name: "Uttapam", price: 75, category: "south_indian" },
    { id: 23, name: "Onion Uttapam", price: 85, category: "south_indian" },
    { id: 24, name: "Tomato Onion Uttapam", price: 85, category: "south_indian" },
    { id: 25, name: "Masala Uttapam", price: 85, category: "south_indian" },
    { id: 26, name: "Coconut Uttapam", price: 85, category: "south_indian" },
    { id: 27, name: "Mix Uttapam", price: 95, category: "south_indian" },
    { id: 28, name: "Paneer Uttapam", price: 130, category: "south_indian" },
    { id: 29, name: "Cheese Uttapam", price: 130, category: "south_indian" },
    { id: 30, name: "Mushroom Uttapam", price: 130, category: "south_indian" },
    { id: 31, name: "Tomato Omelet", price: 85, category: "south_indian" },
    { id: 32, name: "Upma (9.00 Am To 12.00 Pm)", price: 65, category: "south_indian" },
    { id: 33, name: "Items Prepared in Butter / Ghee", price: 35, category: "extras" },
    { id: 34, name: "Items Prepared in Cheese", price: 35, category: "extras" },
    { id: 35, name: "Veg. Sandwich", price: 50, category: "sandwich" },
    { id: 36, name: "Chatni Sandwich", price: 45, category: "sandwich" },
    { id: 37, name: "Veg. Toast Sandwich", price: 60, category: "sandwich" },
    { id: 38, name: "Cheese Sandwich", price: 85, category: "sandwich" },
    { id: 39, name: "Veg. Cheese Sandwich", price: 95, category: "sandwich" },
    { id: 40, name: "Veg. Cheese Toast Sandwich", price: 105, category: "sandwich" },
    { id: 41, name: "Veg. Grill Sandwich", price: 125, category: "sandwich" },
    { id: 42, name: "Veg. Cheese Grill Sandwich", price: 145, category: "sandwich" },
    { id: 43, name: "Garlic Sandwich", price: 70, category: "sandwich" },
    { id: 44, name: "Garlic Toast Sandwich", price: 80, category: "sandwich" },
    { id: 45, name: "Club Sandwich", price: 135, category: "sandwich" },
    { id: 46, name: "Paneer Sandwich", price: 150, category: "sandwich" },
    { id: 47, name: "Paneer Toast Sandwich", price: 160, category: "sandwich" },
    { id: 48, name: "Tomato Omelet Sandwich", price: 95, category: "sandwich" },
    { id: 49, name: "Bread Butter Sandwich", price: 50, category: "sandwich" },
    { id: 50, name: "Bread Butter Jam Sandwich", price: 50, category: "sandwich" },
    { id: 51, name: "Toast Butter Sandwich", price: 55, category: "sandwich" },
    { id: 52, name: "Toast Butter Jam Sandwich", price: 55, category: "sandwich" },
    { id: 53, name: "Gateway Special Pav Bhaji (Dry Fruit Topping)", price: 175, category: "pav_bhaji" },
    { id: 54, name: "Pav Bhaji", price: 120, category: "pav_bhaji" },
    { id: 55, name: "Cheese Pav Bhaji", price: 145, category: "pav_bhaji" },
    { id: 56, name: "Khada Pav Bhaji", price: 140, category: "pav_bhaji" },
    { id: 57, name: "Kadak Pav Bhaji", price: 140, category: "pav_bhaji" },
    { id: 58, name: "Jain Pav Bhaji", price: 140, category: "pav_bhaji" },
    { id: 59, name: "Mushroom Pav Bhaji", price: 155, category: "pav_bhaji" },
    { id: 60, name: "Paneer Pav Bhaji", price: 155, category: "pav_bhaji" },
    { id: 61, name: "Only Bhaji", price: 105, category: "pav_bhaji" },
    { id: 62, name: "Single Pav", price: 15, category: "pav_bhaji" },
    { id: 63, name: "Single Kadak Pav", price: 14, category: "pav_bhaji" },
    { id: 64, name: "Masala Pav (2 Pcs)", price: 110, category: "pav_bhaji" },
    { id: 65, name: "Tawa Pulav", price: 135, category: "pav_bhaji" },
    { id: 66, name: "Cheese Tawa Pulav", price: 145, category: "pav_bhaji" },
    { id: 67, name: "Paneer Tawa Pulav", price: 155, category: "pav_bhaji" },
    { id: 68, name: "Veg. Pizza", price: 150, category: "pizza_burger" },
    { id: 69, name: "Cheese Pizza (Only Cheese)", price: 155, category: "pizza_burger" },
    { id: 70, name: "Jain Pizza", price: 160, category: "pizza_burger" },
    { id: 71, name: "Mushroom Pizza", price: 165, category: "pizza_burger" },
    { id: 72, name: "Cheese Garlic Pizza", price: 165, category: "pizza_burger" },
    { id: 73, name: "Baby Corn Pizza", price: 170, category: "pizza_burger" },
    { id: 74, name: "Mushroom Babycorn Pizza", price: 170, category: "pizza_burger" },
    { id: 75, name: "Veg. Burger", price: 105, category: "pizza_burger" },
    { id: 76, name: "Veg. Cheese Burger", price: 110, category: "pizza_burger" },
    { id: 77, name: "Gateway Special Chaat", price: 120, category: "chaat" },
    { id: 78, name: "Bhel Puri", price: 75, category: "chaat" },
    { id: 79, name: "Sev Puri", price: 75, category: "chaat" },
    { id: 80, name: "Pani Puri", price: 75, category: "chaat" },
    { id: 81, name: "Dahibata Puri", price: 90, category: "chaat" },
    { id: 82, name: "Delhi Chaat", price: 100, category: "chaat" },
    { id: 83, name: "Agra Ka Bhalla Chaat", price: 100, category: "chaat" },
    { id: 84, name: "Alu Chaat", price: 100, category: "chaat" },
    { id: 85, name: "Samosa Chaat", price: 90, category: "chaat" },
    { id: 86, name: "Angoor Chaat", price: 110, category: "chaat" },
    { id: 87, name: "Gateway Tandoor Plater", price: 270, category: "starters" },
    { id: 88, name: "Paneer Tikka", price: 200, category: "starters" },
    { id: 89, name: "Paneer Pahadi Tikka", price: 205, category: "starters" },
    { id: 90, name: "Gobi Tikka", price: 160, category: "starters" },
    { id: 91, name: "Hara Bhara Kabab", price: 160, category: "starters" },
    { id: 92, name: "Aalu Tikka", price: 150, category: "starters" },
    { id: 93, name: "Paneer Malai Tikka", price: 210, category: "starters" },
    { id: 94, name: "Mushroom Tikka", price: 195, category: "starters" },
    { id: 95, name: "Veg. Seekh Kabab", price: 180, category: "starters" },
    { id: 96, name: "Cheese Chilly Kabab", price: 220, category: "starters" },
    { id: 97, name: "Paneer Chilly Baby Pineapple", price: 195, category: "starters" },
    { id: 98, name: "Green Salad", price: 70, category: "salad" },
    { id: 99, name: "Katchumber Salad", price: 70, category: "salad" },
    { id: 100, name: "Green Garden Salad", price: 80, category: "salad" },
    { id: 101, name: "Finger Salad", price: 80, category: "salad" },
    { id: 102, name: "Veg. Salad", price: 80, category: "salad" },
    { id: 103, name: "Boondi Raita", price: 80, category: "salad" },
    { id: 104, name: "Pineapple Raita", price: 80, category: "salad" },
    { id: 105, name: "Fruit Salad", price: 95, category: "salad" },
    { id: 106, name: "Plain Curd", price: 75, category: "salad" },
    { id: 107, name: "Roasted Papad", price: 20, category: "salad" },
    { id: 108, name: "Fried Papad", price: 20, category: "salad" },
    { id: 109, name: "Masala Papad", price: 38, category: "salad" },
    { id: 110, name: "Gateway Special Veg", price: 230, category: "main_course" },
    { id: 111, name: "Paneer Tikka Masala", price: 200, category: "main_course" },
    { id: 112, name: "Paneer Tawa Masala", price: 195, category: "main_course" },
    { id: 113, name: "Paneer Butter Masala", price: 180, category: "main_course" },
    { id: 114, name: "Paneer Naharwala", price: 180, category: "main_course" },
    { id: 115, name: "Paneer Handi", price: 190, category: "main_course" },
    { id: 116, name: "Paneer Kadai", price: 190, category: "main_course" },
    { id: 117, name: "Paneer Zafrani", price: 190, category: "main_course" },
    { id: 118, name: "Paneer Passanda", price: 190, category: "main_course" },
    { id: 119, name: "Paneer Tuffani", price: 195, category: "main_course" },
    { id: 120, name: "Paneer Sahi Korma (Sweet)", price: 190, category: "main_course" },
    { id: 121, name: "Paneer Dopyaza", price: 190, category: "main_course" },
    { id: 122, name: "Paneer Multani", price: 190, category: "main_course" },
    { id: 123, name: "Paneer Kolhapuri", price: 180, category: "main_course" },
    { id: 124, name: "Paneer Nawabi", price: 180, category: "main_course" },
    { id: 125, name: "Paneer Chatpata", price: 190, category: "main_course" },
    { id: 126, name: "Veg. Handi", price: 165, category: "main_course" },
    { id: 127, name: "Veg. Kadai", price: 165, category: "main_course" },
    { id: 128, name: "Veg. Tawa Masala", price: 165, category: "main_course" },
    { id: 129, name: "Khoya Kaju (Sweet)", price: 195, category: "main_course" },
    { id: 130, name: "Kaju Curry", price: 165, category: "main_course" },
    { id: 131, name: "Kaju Butter Masala", price: 165, category: "main_course" },
    { id: 132, name: "Stuffed Tomato", price: 165, category: "main_course" },
    { id: 133, name: "Stuffed Capsicum", price: 165, category: "main_course" },
    { id: 134, name: "Dum Alu Kashmiri (Sweet)", price: 165, category: "main_course" },
    { id: 135, name: "Dum Alu Punjabi (Spicy)", price: 125, category: "main_course" },
    { id: 136, name: "Alu Palak", price: 125, category: "main_course" },
    { id: 137, name: "Alu Mutter", price: 125, category: "main_course" },
    { id: 138, name: "Alu Jeera", price: 125, category: "main_course" },
    { id: 139, name: "Alu Gobi", price: 125, category: "main_course" },
    { id: 140, name: "Bhindi Masala", price: 125, category: "main_course" },
    { id: 141, name: "Bhindi Fry", price: 125, category: "main_course" },
    { id: 142, name: "Chana Masala", price: 125, category: "main_course" },
    { id: 143, name: "Baigan Masala", price: 125, category: "main_course" },
    { id: 144, name: "Baigan Bhartha", price: 125, category: "main_course" },
    { id: 145, name: "Methi Alu", price: 145, category: "main_course" },
    { id: 146, name: "Methi Malai Mutter (Sweet)", price: 125, category: "main_course" },
    { id: 147, name: "Methi Mutter Masala", price: 145, category: "main_course" },
    { id: 148, name: "Mushroom Baby Corn Masala", price: 145, category: "main_course" },
    { id: 149, name: "Mushroom Masala", price: 145, category: "main_course" },
    { id: 150, name: "Green Peas Masala", price: 145, category: "main_course" },
    { id: 151, name: "Navratan Korma (Sweet)", price: 145, category: "main_course" },
    { id: 152, name: "Malai Kofi (Sweet)", price: 150, category: "main_course" },
    { id: 153, name: "Kashmiri Kofta (Sweet)", price: 150, category: "main_course" },
    { id: 154, name: "Nargis Kofta", price: 150, category: "main_course" },
    { id: 155, name: "Veg. Kofta", price: 150, category: "main_course" },
    { id: 156, name: "Cheese Kofta", price: 165, category: "main_course" },
    { id: 157, name: "Kadai Kofta", price: 150, category: "main_course" },
    { id: 158, name: "Paneer Kofta", price: 165, category: "main_course" },
    { id: 159, name: "Dal Makhni", price: 180, category: "main_course" },
    { id: 160, name: "Dal Fry Tadka", price: 150, category: "main_course" },
    { id: 161, name: "Dal Palak", price: 125, category: "main_course" },
    { id: 162, name: "Dal Fry Butter", price: 125, category: "main_course" },
    { id: 163, name: "Dal Fry", price: 110, category: "main_course" },
    { id: 164, name: "Steam Rice", price: 75, category: "rice" },
    { id: 165, name: "Jeera Rice", price: 95, category: "rice" },
    { id: 166, name: "Masala Rice", price: 105, category: "rice" },
    { id: 167, name: "Curd Rice", price: 115, category: "rice" },
    { id: 168, name: "Palak Khichdi (With Papad)", price: 115, category: "rice" },
    { id: 169, name: "Dal Khichdi (With Papad)", price: 115, category: "rice" },
    { id: 170, name: "Veg. Dal Khichdi (With Papad)", price: 130, category: "rice" },
    { id: 171, name: "Veg. Pulav / Green Peas Pulav", price: 130, category: "rice" },
    { id: 172, name: "Kashmiri Pulav (Sweet)", price: 135, category: "rice" },
    { id: 173, name: "Cheese Pulav", price: 155, category: "rice" },
    { id: 174, name: "Paneer Pulav", price: 155, category: "rice" },
    { id: 175, name: "Veg. Biryani", price: 130, category: "rice" },
    { id: 176, name: "Cheese Biryani", price: 155, category: "rice" },
    { id: 177, name: "Paneer Biryani", price: 155, category: "rice" },
    { id: 178, name: "Handi Biryani", price: 140, category: "rice" },
    { id: 179, name: "Hyderabad Biryani (Green & Spicy)", price: 145, category: "rice" },
    { id: 180, name: "Paneer Spring Roll", price: 195, category: "chinese_starters" },
    { id: 181, name: "Veg. Spring Roll", price: 205, category: "chinese_starters" },
    { id: 182, name: "Pasta Roll", price: 150, category: "chinese_starters" },
    { id: 183, name: "Veg. Crispy", price: 165, category: "chinese_starters" },
    { id: 184, name: "Potato Dragon", price: 160, category: "chinese_starters" },
    { id: 185, name: "Paneer Crispy", price: 155, category: "chinese_starters" },
    { id: 186, name: "Paneer Dragon", price: 215, category: "chinese_starters" },
    { id: 187, name: "Veg. Manchurian", price: 215, category: "chinese_starters" },
    { id: 188, name: "Veg. Chilly", price: 140, category: "chinese_starters" },
    { id: 189, name: "Paneer Manchurian", price: 180, category: "chinese_starters" },
    { id: 190, name: "Veg. 65", price: 180, category: "chinese_starters" },
    { id: 191, name: "Paneer Chilly", price: 165, category: "chinese_starters" },
    { id: 192, name: "Paneer Garlic", price: 185, category: "chinese_starters" },
    { id: 193, name: "Paneer 65", price: 185, category: "chinese_starters" },
    { id: 194, name: "Paneer Gold Coin", price: 155, category: "chinese_starters" },
    { id: 195, name: "Baby Corn Manchurian", price: 165, category: "chinese_starters" },
    { id: 196, name: "Paneer Schezwan Dry", price: 185, category: "chinese_starters" },
    { id: 197, name: "Idli Chilly Dry", price: 160, category: "chinese_starters" },
    { id: 198, name: "Mushroom Chilly Dry", price: 160, category: "chinese_starters" },
    { id: 199, name: "Gobi Manchurian Dry", price: 150, category: "chinese_starters" },
    { id: 200, name: "Tomato Soup", price: 115, category: "soup" },
    { id: 201, name: "Veg. Noodles Soup", price: 115, category: "soup" },
    { id: 202, name: "Veg. Sweet Corn Soup", price: 115, category: "soup" },
    { id: 203, name: "Veg. Clear Soup", price: 105, category: "soup" },
    { id: 204, name: "Veg. Mushroom Clear Soup", price: 125, category: "soup" },
    { id: 205, name: "Cream of Veg. Soup", price: 115, category: "soup" },
    { id: 206, name: "Veg. Hot & Sour Soup", price: 110, category: "soup" },
    { id: 207, name: "Veg. Manchow Soup", price: 115, category: "soup" },
    { id: 208, name: "Babycorn Soup", price: 120, category: "soup" },
    { id: 209, name: "Paneer Chilly", price: 185, category: "chinese_main_course" },
    { id: 210, name: "Paneer Hot Garlic", price: 185, category: "chinese_main_course" },
    { id: 211, name: "Paneer Manchurian", price: 185, category: "chinese_main_course" },
    { id: 212, name: "Paneer Hongkong", price: 185, category: "chinese_main_course" },
    { id: 213, name: "Paneer Schezwan", price: 185, category: "chinese_main_course" },
    { id: 214, name: "Paneer 65", price: 185, category: "chinese_main_course" },
    { id: 215, name: "Veg. Chilly", price: 140, category: "chinese_main_course" },
    { id: 216, name: "Veg. Manchurian", price: 140, category: "chinese_main_course" },
    { id: 217, name: "Veg. Hot Garlic", price: 150, category: "chinese_main_course" },
    { id: 218, name: "Veg. Hong Kong", price: 150, category: "chinese_main_course" },
    { id: 219, name: "Veg. Schezwan", price: 160, category: "chinese_main_course" },
    { id: 220, name: "Veg. 65", price: 160, category: "chinese_main_course" },
    { id: 221, name: "Chinese Choupsey", price: 155, category: "chinese_main_course" },
    { id: 222, name: "Mushroom Manchurian", price: 165, category: "chinese_main_course" },
    { id: 223, name: "Mushroom Schezwan", price: 165, category: "chinese_main_course" },
    { id: 224, name: "American Choupsey (Sweet)", price: 180, category: "chinese_main_course" },
    { id: 225, name: "Veg. Fried Rice", price: 135, category: "chinese_noodles_rice" },
    { id: 226, name: "Chinese Bhel", price: 140, category: "chinese_noodles_rice" },
    { id: 227, name: "Veg. Schezwan Fried Rice", price: 150, category: "chinese_noodles_rice" },
    { id: 228, name: "Veg. Ginger Garlic Rice", price: 150, category: "chinese_noodles_rice" },
    { id: 229, name: "Mushroom Fried Rice", price: 160, category: "chinese_noodles_rice" },
    { id: 230, name: "Mushroom Schezwan Fried Rice", price: 160, category: "chinese_noodles_rice" },
    { id: 231, name: "Veg. Triple Rice", price: 170, category: "chinese_noodles_rice" },
    { id: 232, name: "Veg. Triple Schezwan Rice", price: 175, category: "chinese_noodles_rice" },
    { id: 233, name: "Singapore Fried Rice", price: 155, category: "chinese_noodles_rice" },
    { id: 234, name: "Combination Rice", price: 160, category: "chinese_noodles_rice" },
    { id: 235, name: "Combination Schezwan Fried Rice", price: 160, category: "chinese_noodles_rice" },
    { id: 236, name: "Paneer Fried Rice", price: 180, category: "chinese_noodles_rice" },
    { id: 237, name: "Noodles Fried Rice", price: 155, category: "chinese_noodles_rice" },
    { id: 238, name: "Manchurian Fried Rice", price: 155, category: "chinese_noodles_rice" },
    { id: 239, name: "Corn Capsicum Fried Rice", price: 160, category: "chinese_noodles_rice" },
    { id: 240, name: "Veg. Hakka Noodles", price: 150, category: "chinese_noodles_rice" },
    { id: 241, name: "Crispy Noodles", price: 150, category: "chinese_noodles_rice" },
    { id: 242, name: "Veg. Schezwan Noodles", price: 170, category: "chinese_noodles_rice" },
    { id: 243, name: "Hongkong Noodles", price: 170, category: "chinese_noodles_rice" },
    { id: 244, name: "Veg. Triple Schezwan Noodles", price: 195, category: "chinese_noodles_rice" },
    { id: 245, name: "Baked Macorni", price: 190, category: "baked_dishes" },
    { id: 246, name: "Baked Veg.", price: 190, category: "baked_dishes" },
    { id: 247, name: "Baked Veg. With Pineapple", price: 200, category: "baked_dishes" },
    { id: 248, name: "Baked Macorni With Pineapple", price: 200, category: "baked_dishes" },
    { id: 249, name: "Baked Cheese Mushroom", price: 200, category: "baked_dishes" },
    { id: 250, name: "Gulab Jamun", price: 70, category: "dessert" },
    { id: 251, name: "Fruit Salad", price: 120, category: "dessert" },
    { id: 252, name: "Fresh Fruit Plate", price: 145, category: "dessert" },
    { id: 253, name: "Fruit Salad With Ice Cream", price: 140, category: "dessert" },
    { id: 254, name: "Jelly", price: 95, category: "dessert" },
    { id: 255, name: "Fruit Jelly", price: 105, category: "dessert" },
    { id: 256, name: "Jelly With Ice Cream", price: 125, category: "dessert" },
    { id: 257, name: "Vanilla With Hot Chocolate", price: 125, category: "dessert" },
    { id: 258, name: "Gateway Special Lassi", price: 115, category: "lassi" },
    { id: 259, name: "Sweet Lassi", price: 65, category: "lassi" },
    { id: 260, name: "Salt Lassi", price: 65, category: "lassi" },
    { id: 261, name: "Mango Lassi", price: 95, category: "lassi" },
    { id: 262, name: "Butter Milk", price: 45, category: "lassi" },
    { id: 263, name: "Fresh Lime Juice", price: 60, category: "fresh_juices" },
    { id: 264, name: "Ginger Lemon Juice", price: 70, category: "fresh_juices" },
    { id: 265, name: "Mosambi Juice", price: 85, category: "fresh_juices" },
    { id: 266, name: "Orange Juice", price: 85, category: "fresh_juices" },
    { id: 267, name: "Water Melon Juice", price: 85, category: "fresh_juices" },
    { id: 268, name: "Pineapple Juice", price: 85, category: "fresh_juices" },
    { id: 269, name: "Ganga Jamuna", price: 90, category: "fresh_juices" },
    { id: 270, name: "Mastani", price: 90, category: "fresh_juices" },
    { id: 271, name: "Crocodile Juice", price: 90, category: "fresh_juices" },
    { id: 272, name: "Grape Juice", price: 100, category: "fresh_juices" },
    { id: 273, name: "Apple Juice", price: 100, category: "fresh_juices" },
    { id: 274, name: "Pomegranate Juice", price: 100, category: "fresh_juices" },
    { id: 275, name: "Mango Juice (Pulp)", price: 140, category: "fresh_juices" },
    { id: 276, name: "Carrot Juice", price: 85, category: "fresh_juices" },
    { id: 277, name: "Chikoo Milkshake", price: 105, category: "milkshake" },
    { id: 278, name: "Banana Milkshake", price: 105, category: "milkshake" },
    { id: 279, name: "Apple Milkshake", price: 130, category: "milkshake" },
    { id: 280, name: "Sitafal Milkshake", price: 145, category: "milkshake" },
    { id: 281, name: "Fresh Strawberry Milkshake", price: 145, category: "milkshake" },
    { id: 282, name: "Mango Milkshake (Pulp)", price: 140, category: "milkshake" },
    { id: 283, name: "Vanilla Milkshake", price: 105, category: "milkshake" },
    { id: 284, name: "Cold Coffee", price: 105, category: "milkshake" },
    { id: 285, name: "Dry Fruit Milkshake", price: 195, category: "milkshake" },
    { id: 286, name: "Badam Milkshake", price: 195, category: "milkshake" },
    { id: 287, name: "Kaju Milkshake", price: 195, category: "milkshake" },
    { id: 288, name: "Anjeer Milkshake", price: 195, category: "milkshake" },
    { id: 289, name: "Kaju Anjeer Milkshake", price: 195, category: "milkshake" },
    { id: 290, name: "Gateway Special Falooda", price: 170, category: "falooda" },
    { id: 291, name: "Royal Falooda", price: 120, category: "falooda" },
    { id: 292, name: "Kesar Falooda", price: 130, category: "falooda" },
    { id: 293, name: "Kulfi Falooda", price: 135, category: "falooda" },
    { id: 294, name: "Malai Kulfi", price: 55, category: "kulfi" },
    { id: 295, name: "Kesar Pista Kulfi", price: 65, category: "kulfi" },
    { id: 296, name: "Pista Kulfi", price: 65, category: "kulfi" },
    { id: 297, name: "3 In 1 Kulfi", price: 75, category: "kulfi" },
    { id: 298, name: "Matka Kulfi", price: 75, category: "kulfi" },
    { id: 299, name: "Vanilla Scoop", price: 105, category: "scoops" },
    { id: 300, name: "Kesar Pista Scoop", price: 130, category: "scoops" },
    { id: 301, name: "Butter Scotch Scoop", price: 115, category: "scoops" },
    { id: 302, name: "Chocolate Scoop", price: 115, category: "scoops" },
    { id: 303, name: "Strawberry Scoop", price: 110, category: "scoops" },
  ];

  const dishes = rawDishes.map(normalizeDish);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "south_indian", label: "South Indian" },
    { id: "extras", label: "Extras" },
    { id: "snacks", label: "Snacks" },
    { id: "pav_bhaji", label: "Pav Bhaji" },
    { id: "sandwich", label: "Sandwich" },
    { id: "pizza_burger", label: "Pizza & Burger" },
    { id: "chaat", label: "Chaat" },
    { id: "starters", label: "Starters" },
    { id: "salad", label: "Salads" },
    { id: "main_course", label: "Main Course" },
    { id: "rice", label: "Rice" },
    { id: "chinese_starters", label: "Chinese Starters" },
    { id: "soup", label: "Soup" },
    { id: "chinese_main_course", label: "Chinese Main Course" },
    { id: "chinese_noodles_rice", label: "Chinese Noodles & Rice" },
    { id: "baked_dishes", label: "Baked Dishes" },
    { id: "dessert", label: "Desserts" },
    { id: "lassi", label: "Lassi" },
    { id: "fresh_juices", label: "Fresh Juices" },
    { id: "milkshake", label: "Milkshakes" },
    { id: "falooda", label: "Falooda" },
    { id: "kulfi", label: "Kulfi" },
    { id: "scoops", label: "Scoops" },
  ];

  const matchesPriceRange = (price) => {
    switch (selectedPriceRange) {
      case "under_100":
        return price <= 100;
      case "under_200":
        return price <= 200;
      case "under_300":
        return price <= 300;
      case "under_500":
        return price <= 500;
      case "under_600":
        return price <= 600;
      case "all":
      default:
        return true;
    }
  };

  const fuse = new Fuse(dishes, {
    keys: ['name', 'categoryLabel', 'ingredients'],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
    isCaseSensitive: false,
  });

  const filteredBySearch = searchText.trim()
    ? fuse.search(searchText.trim()).map((result) => result.item)
    : dishes;

  const filteredItems = filteredBySearch.filter((item) => {
    const matchesPrice = matchesPriceRange(item.price);
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesPrice && matchesCategory;
  });

  return (
    <div className="app">
      <HeroSection onExploreMenu={scrollToSearch} />
      <SearchAndFilter 
        id="menu-search"
        searchText={searchText}
        setSearchText={setSearchText}
        selectedPriceRange={selectedPriceRange}
        setSelectedPriceRange={setSelectedPriceRange}
        priceRangeOptions={priceRangeOptions}
      />
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ResultCount count={filteredItems.length} />
      <MenuGrid items={filteredItems} />
    </div>
  );
}

function HeroSection({ onExploreMenu }) {
  const featuredCards = [
    { title: 'Paneer Butter Masala', subtitle: 'Creamy • Rich • Comforting', emoji: '🍛' },
    { title: 'Garlic Naan', subtitle: 'Soft • Buttered • Fresh', emoji: '🫓' },
    { title: 'Hyderabadi Biryani', subtitle: 'Aromatic • Spiced • Regal', emoji: '🍚' },
    { title: 'Tandoori Platter', subtitle: 'Smoky • Charred • Bold', emoji: '🔥' },
  ];

  return (
    <section className="hero-section">
      <div className="hero-glow hero-glow-left" aria-hidden="true" />
      <div className="hero-glow hero-glow-right" aria-hidden="true" />

      <div className="hero-copy">
        <div className="hero-brand-row">
          <span className="hero-badge">DilYum</span>
          <span className="hero-tagline">(Dil Bole Yum)</span>
        </div>

        <h1>Craving Something Extraordinary?</h1>
        <p className="hero-subtitle">
          Warm Indian comfort, modern presentation, and dishes that feel like a feast before the first bite.
        </p>

        <div className="hero-actions">
          <button type="button" className="hero-cta" onClick={onExploreMenu}>
            <span className="hero-cta-icon" aria-hidden="true">🔍</span>
            <span>Explore Menu & Search Dishes</span>
          </button>
          <p className="hero-note">Search by name, category, or even fuzzy spellings.</p>
        </div>

        <div className="hero-stats" aria-label="App highlights">
          <div className="hero-stat">
            <strong>300+</strong>
            <span>menu items</span>
          </div>
          <div className="hero-stat">
            <strong>Fuzzy</strong>
            <span>search enabled</span>
          </div>
          <div className="hero-stat">
            <strong>Mobile</strong>
            <span>friendly layout</span>
          </div>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-plate">
          <div className="hero-plate-center">
            <span className="hero-steam hero-steam-one" />
            <span className="hero-steam hero-steam-two" />
            <span className="hero-steam hero-steam-three" />
            <span className="hero-plate-title">Today's craving</span>
            <strong>Hot, fragrant, and ready to explore</strong>
          </div>
        </div>

        <div className="hero-floating-card hero-floating-card-one">
          <span className="hero-floating-emoji">🍛</span>
          <div>
            <strong>Paneer Butter Masala</strong>
            <p>Silky gravy with soft paneer cubes</p>
          </div>
        </div>

        <div className="hero-floating-card hero-floating-card-two">
          <span className="hero-floating-emoji">🫓</span>
          <div>
            <strong>Garlic Naan</strong>
            <p>Fresh from the tandoor</p>
          </div>
        </div>

        <div className="hero-floating-card hero-floating-card-three">
          <span className="hero-floating-emoji">🍚</span>
          <div>
            <strong>Biryani</strong>
            <p>Aromatic rice layered with spice</p>
          </div>
        </div>

        <div className="hero-floating-card hero-floating-card-four">
          <span className="hero-floating-emoji">🔥</span>
          <div>
            <strong>Tandoori Platter</strong>
            <p>Smoky, spicy, shareable</p>
          </div>
        </div>
      </div>

      <div className="hero-mini-gallery" aria-hidden="true">
        {featuredCards.map((card, index) => (
          <article key={card.title} className={`hero-menu-chip hero-menu-chip-${index + 1}`}>
            <span className="hero-menu-chip-emoji">{card.emoji}</span>
            <div>
              <strong>{card.title}</strong>
              <span>{card.subtitle}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🍽️ Gateway Restaurant</h1>
        <p className="subtitle">Discover authentic Indian cuisine • Fresh ingredients • Best taste</p>
      </div>
    </header>
  );
}

function SearchAndFilter({ id, searchText, setSearchText, selectedPriceRange, setSelectedPriceRange, priceRangeOptions }) {
  return (
    <div className="search-filter-section" id={id}>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search dishes, categories, or ingredients..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="price-filter-container">
        <div className="price-slider-group">
          <label className="price-label">Price Range</label>
          <div className="price-select-wrapper">
            <select
              className="price-select"
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              {priceRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-filter">
      <div className="category-scroll">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCount({ count }) {
  return (
    <div className="result-info">
      <p className="result-count">
        Found <span className="count-number">{count}</span> dish{count === 1 ? "" : "es"}
      </p>
    </div>
  );
}

function MenuGrid({ items }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🔍</p>
        <p className="empty-text">No dishes found matching your criteria.</p>
        <p className="empty-subtext">Try adjusting your search or filters!</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map(item => (
        <DishCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function DishCard({ item }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const ingredients = item.ingredients ?? [];

  return (
    <div className="card" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="card-header">
        <h3 className="card-name">{item.name}</h3>
        <div className="card-price">₹{item.price}</div>
      </div>

      <div className="card-ingredients-preview">
       {ingredients.slice(0, 2).map((ing, idx) => (
          <span key={idx} className="ingredient-tag">{ing}</span>
        ))}
       {ingredients.length > 2 && (
          <span className="ingredient-tag more">+{ingredients.length - 2} more</span>
        )}
      </div>

      {isExpanded && (
        <div className="card-expanded">
          <div className="card-ingredients-full">
            <p className="ingredients-label">Ingredients:</p>
            <div className="ingredients-list">
              {ingredients.map((ing, idx) => (
                <span key={idx} className="ingredient-full">{ing}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card-footer">
        <p className="click-hint">{isExpanded ? "Click to hide details" : "Click for ingredients"}</p>
      </div>
    </div>
  );
}

export default App;