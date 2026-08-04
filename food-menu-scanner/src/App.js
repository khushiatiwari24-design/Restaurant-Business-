import React, { useState } from 'react';
import './App.css';

function App() {
  // FIXED: Price range changed to 0-500 so all dishes show initially
  const [searchText, setSearchText] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500); // Changed from 300 to 500
  const [selectedCategory, setSelectedCategory] = useState("all");

  const menuItems = [
    // SOUTH INDIAN
    { id: 1, name: "Steam Idli", price: 40, category: "south_indian", ingredients: ["rice", "urad dal", "salt"] },
    { id: 2, name: "Butter Idli", price: 50, category: "south_indian", ingredients: ["idli", "butter", "salt"] },
    { id: 3, name: "Ghee Idli", price: 50, category: "south_indian", ingredients: ["idli", "ghee", "salt"] },
    { id: 4, name: "Fry Idli", price: 60, category: "south_indian", ingredients: ["idli", "onion", "green chili", "oil"] },
    { id: 5, name: "Dahi Idli", price: 50, category: "south_indian", ingredients: ["idli", "yogurt", "salt"] },
    { id: 6, name: "Idli Vada", price: 60, category: "south_indian", ingredients: ["idli", "urad vada", "sambar"] },
    { id: 7, name: "Medu Vada", price: 65, category: "south_indian", ingredients: ["urad dal", "cumin", "salt", "oil"] },
    { id: 8, name: "Sada Dosa", price: 65, category: "south_indian", ingredients: ["rice batter", "urad dal", "oil"] },
    { id: 9, name: "Masala Dosa", price: 70, category: "south_indian", ingredients: ["dosa", "potato", "onion", "masala"] },
    { id: 10, name: "Mysore Masala Dosa", price: 90, category: "south_indian", ingredients: ["dosa", "chutney", "potato masala", "spices"] },
    { id: 11, name: "Rava Sada Dosa", price: 70, category: "south_indian", ingredients: ["semolina", "salt", "oil", "water"] },
    { id: 12, name: "Kava Masala Dosa", price: 85, category: "south_indian", ingredients: ["rava dosa", "potato", "onion", "masala"] },
    { id: 13, name: "Onion Rava Sada Dosa", price: 80, category: "south_indian", ingredients: ["rava", "onion", "salt", "oil"] },
    { id: 14, name: "Paper Dosa", price: 75, category: "south_indian", ingredients: ["rice batter", "oil", "sambar", "chutney"] },
    { id: 15, name: "Paper Sada Dosa", price: 135, category: "south_indian", ingredients: ["thin rice crepe", "oil", "salt"] },
    { id: 16, name: "Paper Masala Dosa", price: 155, category: "south_indian", ingredients: ["paper dosa", "potato", "onion", "masala"] },
    { id: 17, name: "Palak Sada Dosa", price: 95, category: "south_indian", ingredients: ["spinach dough", "oil", "salt"] },
    { id: 18, name: "Palak Masala Dosa", price: 105, category: "south_indian", ingredients: ["spinach dosa", "potato masala", "onion"] },
    { id: 19, name: "Uttapam", price: 75, category: "south_indian", ingredients: ["rice batter", "onion", "tomato", "green chili"] },
    { id: 20, name: "Onion Uttapam", price: 85, category: "south_indian", ingredients: ["batter", "onion", "salt", "oil"] },
    { id: 21, name: "Tomato Uttapam", price: 85, category: "south_indian", ingredients: ["batter", "tomato", "onion", "oil"] },

    // SNACKS
    { id: 22, name: "Chole Bhature (2 Pcs)", price: 150, category: "snacks", ingredients: ["wheat flour", "chickpeas", "spices", "ginger-garlic"] },
    { id: 23, name: "Puri Bhaji", price: 115, category: "snacks", ingredients: ["maida", "potato", "onion", "spices"] },
    { id: 24, name: "Punjabi Samosa", price: 70, category: "snacks", ingredients: ["maida", "potato", "peas", "spices"] },
    { id: 25, name: "Balatak Vada", price: 95, category: "snacks", ingredients: ["wheat flour", "urad dal", "onion", "oil"] },
    { id: 26, name: "Corn Bhel", price: 80, category: "snacks", ingredients: ["corn", "puffed rice", "onion", "chutney"] },
    { id: 27, name: "Sabudana Vada", price: 75, category: "snacks", ingredients: ["sabudana", "potato", "peanuts", "cumin"] },
    { id: 28, name: "Rabdi Toast", price: 75, category: "snacks", ingredients: ["bread", "condensed milk", "dry fruits"] },
    { id: 29, name: "Single Bhature", price: 45, category: "snacks", ingredients: ["wheat flour", "yogurt", "spices"] },
    { id: 30, name: "Extra Puri Plate (6 Pcs)", price: 60, category: "snacks", ingredients: ["maida", "salt", "oil", "water"] },
    { id: 31, name: "Paneer Pakoda", price: 170, category: "snacks", ingredients: ["paneer", "gram flour", "spices", "oil"] },
    { id: 32, name: "Cheese Pakoda", price: 155, category: "snacks", ingredients: ["cheese", "gram flour", "oil", "spices"] },
    { id: 33, name: "Mix Pakoda", price: 145, category: "snacks", ingredients: ["mixed vegetables", "gram flour", "oil"] },
    { id: 34, name: "Dahi Vada", price: 75, category: "snacks", ingredients: ["urad vada", "yogurt", "tamarind", "spices"] },

    // PAV BHAJI
    { id: 35, name: "Gateway Sp. Pav Bhaji (Dry Fruit Topping)", price: 150, category: "pav_bhaji", ingredients: ["potato", "peas", "spices", "butter", "dry fruits"] },
    { id: 36, name: "Pav Bhaji", price: 120, category: "pav_bhaji", ingredients: ["potato", "onion", "peas", "spices", "butter"] },
    { id: 37, name: "Paneer Pav Bhaji", price: 145, category: "pav_bhaji", ingredients: ["paneer", "pav", "masala", "butter"] },
    { id: 38, name: "Khada Pav Bhaji", price: 140, category: "pav_bhaji", ingredients: ["whole spices", "potato", "peas", "butter"] },
    { id: 39, name: "Khada Pav Bhaji", price: 140, category: "pav_bhaji", ingredients: ["cumin", "fennel", "potato", "butter"] },
    { id: 40, name: "Jain Pav Bhaji", price: 140, category: "pav_bhaji", ingredients: ["potato", "peas", "butter", "no garlic-onion"] },
    { id: 41, name: "Mushroom Pav Bhaji", price: 150, category: "pav_bhaji", ingredients: ["mushroom", "pav", "masala", "butter"] },
    { id: 42, name: "Paneer Pav Bhaji", price: 155, category: "pav_bhaji", ingredients: ["paneer", "potato", "butter", "pav"] },
    { id: 43, name: "Only Bhaji", price: 105, category: "pav_bhaji", ingredients: ["potato", "peas", "spices"] },
    { id: 44, name: "Only Pav", price: 40, category: "pav_bhaji", ingredients: ["maida", "yeast", "salt", "oil"] },
    { id: 45, name: "Single Kadak Pav", price: 14, category: "pav_bhaji", ingredients: ["bread", "butter"] },
    { id: 46, name: "Masala Pav (2 Pcs)", price: 110, category: "pav_bhaji", ingredients: ["pav", "chutney", "spices"] },

    // SANDWICH
    { id: 47, name: "Veg. Sandwich", price: 50, category: "sandwich", ingredients: ["bread", "vegetables", "butter", "spices"] },
    { id: 48, name: "Chee Sandwich", price: 45, category: "sandwich", ingredients: ["bread", "cheese", "butter"] },
    { id: 49, name: "Veg. Toast Sandwich", price: 60, category: "sandwich", ingredients: ["toast", "vegetables", "butter"] },
    { id: 50, name: "Cheese Grill Sandwich", price: 75, category: "sandwich", ingredients: ["bread", "cheese", "butter", "oil"] },
    { id: 51, name: "Veg. Cheese Sandwich", price: 95, category: "sandwich", ingredients: ["bread", "cheese", "vegetables"] },
    { id: 52, name: "Veg. Cheese Grill Sandwich", price: 105, category: "sandwich", ingredients: ["toasted bread", "cheese", "vegetables"] },
    { id: 53, name: "Club Sandwich", price: 130, category: "sandwich", ingredients: ["bread", "vegetables", "cheese", "butter"] },
    { id: 54, name: "Garlic Toast Sandwich", price: 80, category: "sandwich", ingredients: ["bread", "garlic", "butter", "oil"] },
    { id: 55, name: "Paneer Sandwich", price: 150, category: "sandwich", ingredients: ["paneer", "bread", "butter", "spices"] },

    // PIZZA & BURGER
    { id: 56, name: "Veg. Pizza", price: 150, category: "pizza_burger", ingredients: ["pizza base", "tomato sauce", "vegetables", "cheese"] },
    { id: 57, name: "Veg. Zucchini Pizza (Only Cheese)", price: 160, category: "pizza_burger", ingredients: ["base", "zucchini", "cheese"] },
    { id: 58, name: "Jain Pizza", price: 160, category: "pizza_burger", ingredients: ["pizza base", "vegetables", "cheese", "no onion-garlic"] },
    { id: 59, name: "Mushroom Pizza", price: 165, category: "pizza_burger", ingredients: ["base", "mushroom", "cheese", "herbs"] },
    { id: 60, name: "Cheese Garlic Pizza", price: 165, category: "pizza_burger", ingredients: ["base", "garlic", "cheese", "oil"] },
    { id: 61, name: "Baby Corn Pizza", price: 170, category: "pizza_burger", ingredients: ["base", "baby corn", "cheese", "tomato"] },
    { id: 62, name: "Veg. Cheese Burger", price: 120, category: "pizza_burger", ingredients: ["bun", "cheese", "vegetables", "sauce"] },

    // CHAAT
    { id: 63, name: "Gateway Special Chaat", price: 120, category: "chaat", ingredients: ["puffed rice", "potato", "chickpeas", "chutney"] },
    { id: 64, name: "Sev Puri", price: 75, category: "chaat", ingredients: ["puri", "sev", "potato", "chutney"] },
    { id: 65, name: "Pani Puri", price: 75, category: "chaat", ingredients: ["puri", "potato", "spiced water", "tamarind"] },
    { id: 66, name: "Dahbbata Puri", price: 90, category: "chaat", ingredients: ["puri", "lentils", "yogurt"] },
    { id: 67, name: "Delhi Chaat", price: 100, category: "chaat", ingredients: ["chickpeas", "potato", "spices", "chutney"] },
    { id: 68, name: "Agra Ka Bhaisia Chaat", price: 100, category: "chaat", ingredients: ["puffed rice", "potato", "spices"] },
    { id: 69, name: "Alu Chaat", price: 100, category: "chaat", ingredients: ["potato", "tamarind", "spices", "chutney"] },

    // INDIAN STARTERS
    { id: 70, name: "Gateway Tandoor Platter", price: 270, category: "starters", ingredients: ["chicken tikka", "paneer tikka", "grill items"] },
    { id: 71, name: "Paneer Tikka", price: 200, category: "starters", ingredients: ["paneer", "yogurt", "ginger-garlic", "spices"] },
    { id: 72, name: "Chicken Seekh Kabab", price: 205, category: "starters", ingredients: ["chicken mince", "onion", "spices", "oil"] },
    { id: 73, name: "Goan Tikka", price: 200, category: "starters", ingredients: ["fish", "coconut", "spices", "oil"] },
    { id: 74, name: "Hara Bhara Kabab", price: 160, category: "starters", ingredients: ["spinach", "potato", "green peas"] },
    { id: 75, name: "Alu Tikka", price: 150, category: "starters", ingredients: ["potato", "yogurt", "spices"] },
    { id: 76, name: "Paneer Mela Tikka", price: 210, category: "starters", ingredients: ["paneer", "cottage cheese", "spices"] },

    // SALADS
    { id: 77, name: "Green Salad", price: 70, category: "salad", ingredients: ["lettuce", "cucumber", "tomato", "lemon"] },
    { id: 78, name: "Katchumber Salad", price: 70, category: "salad", ingredients: ["tomato", "onion", "cucumber", "lemon"] },
    { id: 79, name: "Green Garden Salad", price: 80, category: "salad", ingredients: ["mixed greens", "herbs", "lemon dressing"] },
    { id: 80, name: "Finger Salad", price: 80, category: "salad", ingredients: ["carrot", "cucumber", "bell pepper"] },

    // MAIN COURSE
    { id: 81, name: "Paneer Tikka Masala", price: 230, category: "main_course", ingredients: ["paneer tikka", "cream", "tomato", "spices"] },
    { id: 82, name: "Paneer Butter Masala", price: 230, category: "main_course", ingredients: ["paneer", "butter", "cream", "tomato"] },
    { id: 83, name: "Paneer Makhniwaala", price: 230, category: "main_course", ingredients: ["paneer", "butter", "cream", "ginger-garlic"] },
    { id: 84, name: "Paneer Lababdar", price: 180, category: "main_course", ingredients: ["paneer", "yogurt", "tomato", "spices"] },
    { id: 85, name: "Paneer Kadai", price: 190, category: "main_course", ingredients: ["paneer", "capsicum", "onion", "tomato"] },
    { id: 86, name: "Paneer Jayrani", price: 190, category: "main_course", ingredients: ["paneer", "mint", "cream", "spices"] },
    { id: 87, name: "Paneer Dopyaza", price: 195, category: "main_course", ingredients: ["paneer", "onion", "ginger-garlic", "tomato"] },
    { id: 88, name: "Paneer Biryani (Sweet)", price: 160, category: "main_course", ingredients: ["paneer", "rice", "yogurt", "spices"] },
    { id: 89, name: "Paneer Navauli", price: 180, category: "main_course", ingredients: ["paneer", "coconut", "cream", "spices"] },
    { id: 90, name: "Paneer Chatpata", price: 190, category: "main_course", ingredients: ["paneer", "spices", "lemon", "chili"] },

    // RICE
    { id: 91, name: "Steam Rice", price: 75, category: "rice", ingredients: ["basmati rice", "salt", "water"] },
    { id: 92, name: "Jeera Rice", price: 85, category: "rice", ingredients: ["rice", "cumin", "ghee", "salt"] },
    { id: 93, name: "Veg Biryani", price: 130, category: "rice", ingredients: ["rice", "vegetables", "yogurt", "spices"] },
    { id: 94, name: "Curd Rice", price: 95, category: "rice", ingredients: ["rice", "yogurt", "salt", "pepper"] },
    { id: 95, name: "Veg. Fried Rice (With Papad)", price: 115, category: "rice", ingredients: ["rice", "vegetables", "soy sauce", "oil"] },

    // ROTI
    { id: 96, name: "Chapati", price: 13, category: "roti", ingredients: ["wheat flour", "salt", "water", "oil"] },
    { id: 97, name: "Butter Chapati", price: 16, category: "roti", ingredients: ["wheat flour", "butter", "salt"] },
    { id: 98, name: "Roti", price: 15, category: "roti", ingredients: ["whole wheat flour", "salt", "water"] },
    { id: 99, name: "Butter Roti", price: 18, category: "roti", ingredients: ["wheat flour", "butter", "salt"] },
    { id: 100, name: "Naan", price: 23, category: "roti", ingredients: ["maida", "yogurt", "salt", "oil"] },
    { id: 101, name: "Butter Naan", price: 26, category: "roti", ingredients: ["naan", "butter", "garlic"] },
    { id: 102, name: "Puri", price: 18, category: "roti", ingredients: ["maida", "salt", "oil", "water"] },
    { id: 103, name: "Paratha", price: 38, category: "roti", ingredients: ["wheat flour", "oil", "salt", "water"] },
    { id: 104, name: "Kulcha", price: 38, category: "roti", ingredients: ["maida", "yogurt", "salt", "seeds"] },
    { id: 105, name: "Butter Kulcha", price: 45, category: "roti", ingredients: ["kulcha", "butter", "garlic"] },

    // DESSERTS
    { id: 106, name: "Gulab Jamun", price: 70, category: "dessert", ingredients: ["milk solids", "sugar syrup", "cardamom", "rose"] },
    { id: 107, name: "Fruit Salad", price: 124, category: "dessert", ingredients: ["mixed fruits", "honey", "lemon juice"] },
    { id: 108, name: "Fruit Salad With Ice Cream", price: 170, category: "dessert", ingredients: ["fruit salad", "ice cream", "honey"] },
    { id: 109, name: "Fruit Jelly", price: 85, category: "dessert", ingredients: ["gelatin", "sugar", "fruit juice", "water"] },
    { id: 110, name: "Jelly With Ice Cream", price: 105, category: "dessert", ingredients: ["jelly", "ice cream", "syrup"] },
    { id: 111, name: "Vanilla With Hot Chocolate", price: 125, category: "dessert", ingredients: ["vanilla ice cream", "chocolate sauce", "nuts"] },

    // MILKSHAKE
    { id: 112, name: "Chikoo Milkshake", price: 105, category: "milkshake", ingredients: ["chikoo", "milk", "sugar", "ice"] },
    { id: 113, name: "Banana Milkshake", price: 105, category: "milkshake", ingredients: ["banana", "milk", "sugar", "ice"] },
    { id: 114, name: "Apple Milkshake", price: 105, category: "milkshake", ingredients: ["apple", "milk", "sugar", "ice"] },
    { id: 115, name: "Mango Milkshake", price: 140, category: "milkshake", ingredients: ["mango", "milk", "sugar", "ice"] },
    { id: 116, name: "Fresh Strawberry Milkshake", price: 145, category: "milkshake", ingredients: ["strawberry", "milk", "sugar", "ice"] },
    { id: 117, name: "Vanilla Milkshake", price: 105, category: "milkshake", ingredients: ["vanilla", "milk", "sugar", "ice"] },

    // SOUP
    { id: 118, name: "Tomato Soup", price: 115, category: "soup", ingredients: ["tomato", "cream", "butter", "spices"] },
    { id: 119, name: "Veg. Hot & Sour Soup", price: 130, category: "soup", ingredients: ["vegetables", "vinegar", "soy sauce", "cornflour"] },
    { id: 120, name: "Veg. Sweet Corn Soup", price: 115, category: "soup", ingredients: ["corn", "cream", "butter", "salt"] },

    // JUICES
    { id: 121, name: "Fresh Lime Juice", price: 60, category: "juice", ingredients: ["lime", "water", "sugar", "salt"] },
    { id: 122, name: "Ginger Lemon Juice", price: 70, category: "juice", ingredients: ["ginger", "lemon", "water", "honey"] },
    { id: 123, name: "Orange Juice", price: 87, category: "juice", ingredients: ["orange", "water", "sugar"] },
  ];

  const categories = [
    { id: "all", label: "All Items" },
    { id: "south_indian", label: "South Indian" },
    { id: "snacks", label: "Snacks" },
    { id: "pav_bhaji", label: "Pav Bhaji" },
    { id: "sandwich", label: "Sandwich" },
    { id: "pizza_burger", label: "Pizza & Burger" },
    { id: "chaat", label: "Chaat" },
    { id: "starters", label: "Starters" },
    { id: "salad", label: "Salads" },
    { id: "main_course", label: "Main Course" },
    { id: "rice", label: "Rice" },
    { id: "roti", label: "Roti" },
    { id: "dessert", label: "Desserts" },
    { id: "milkshake", label: "Milkshakes" },
    { id: "soup", label: "Soup" },
    { id: "juice", label: "Juices" },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchText.toLowerCase()));

    const matchesPrice = item.price >= priceMin && item.price <= priceMax;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <div className="app">
      <Header />
      <SearchAndFilter 
        searchText={searchText}
        setSearchText={setSearchText}
        priceMin={priceMin}
        setPriceMin={setPriceMin}
        priceMax={priceMax}
        setPriceMax={setPriceMax}
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

function SearchAndFilter({ searchText, setSearchText, priceMin, setPriceMin, priceMax, setPriceMax }) {
  return (
    <div className="search-filter-section">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by dish name or ingredient..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="price-filter-container">
        <div className="price-slider-group">
          <label className="price-label">Price Range: ₹{priceMin} - ₹{priceMax}</label>
          <div className="price-inputs">
            <input
              type="number"
              className="price-input"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              className="price-input"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
            />
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

  return (
    <div className="card" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="card-header">
        <h3 className="card-name">{item.name}</h3>
        <div className="card-price">₹{item.price}</div>
      </div>

      <div className="card-ingredients-preview">
        {item.ingredients.slice(0, 2).map((ing, idx) => (
          <span key={idx} className="ingredient-tag">{ing}</span>
        ))}
        {item.ingredients.length > 2 && (
          <span className="ingredient-tag more">+{item.ingredients.length - 2} more</span>
        )}
      </div>

      {isExpanded && (
        <div className="card-expanded">
          <div className="card-ingredients-full">
            <p className="ingredients-label">Ingredients:</p>
            <div className="ingredients-list">
              {item.ingredients.map((ing, idx) => (
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