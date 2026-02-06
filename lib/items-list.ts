// Complete Item List - All Real Inventory from Catalog
// lib/items-list.ts

export const ITEMS_BY_CATEGORY = {
  breakfast: [
    "Bacon",
    "Sausage Links",
    "Stuffed Waffles",
    "Little Pigs in a Blanket",
    "Big Pigs in a Blanket",
    "Kolache",
    "Boudin",
    "Biscuit Sandwiches",
    "Breakfast Burrito",
    "Hash Browns",
    "Pancakes",
    "French Toast",
    "Egg Hard Cooked Peeled",
    "Easy Egg",
  ],
  
  roller: [
    "Egg Rolls",
    "Tornados",
    "Chicken Stick",
    "Corn Dog",
    "Hot Dog",
    "Sausage",
    "Crispitos",
    "Taquitos",
    "Hot Pockets",
    "Pizza Rolls",
    "Taquitos",
  ],
  
  deli: [
    "Hamburger",
    "Hamburger Patty",
    "Cheeseburger",
    "Pulled Pork",
    "Brisket",
    "Country Fried Steak",
    "Pork Chop",
    "Steak",
    "Chicken Wings",
    "Chicken Tenders",
    "Chicken Sandwich",
    "BLT",
    "Club Sandwich",
    "Ham",
    "Meatballs",
  ],
  
  bakery: [
    "Cinnamon Rolls",
    "Large Cookies",
    "Small Cookies",
    "Muffins",
    "Brownies",
    "Danishes",
    "Donuts",
    "Cake",
    "Cupcakes",
  ],
  
  branded: [
    "Pizza Whole",
    "Pizza Slice",
    "Pizza Hunk",
    "Wings",
    "Chicken Wings",
    "Bites",
    "Calzone",
    "Stromboli",
  ],
  
  sides: [
    "French Fries",
    "Onion Rings",
    "Mozzarella Sticks",
    "Jalapeno Poppers",
    "Fried Pickles",
    "Potato Wedges",
    "Tater Tots",
    "Nachos",
    "Chips",
  ],
  
  wraps: [
    "Wrap",
    "Burrito",
    "Tamales",
    "Empanadas",
    "Spring Rolls",
    "Pot Stickers",
    "Quesadilla",
  ],
  
  dairy: [
    "Milk Whole Vitamin D",
    "Milk 2% Reduced Fat",
    "Milk Skim",
    "Chocolate Milk",
    "Cheese Mozzarella Shredded",
    "Cheese Cheddar Shredded",
    "Cheese Cream",
    "Cheese Slices",
  ],
  
  produce: [
    "Lettuce",
    "Tomato",
    "Onion",
    "Pickle",
    "Peppers",
    "Mushrooms",
    "Avocado",
  ],
  
  condiments: [
    "Ketchup",
    "Mustard",
    "Mayo",
    "BBQ Sauce",
    "Ranch",
    "Hot Sauce",
    "Salsa",
    "Cheese Sauce",
  ],
  
  beverages: [
    "Soda",
    "Coffee",
    "Tea",
    "Energy Drinks",
    "Water",
    "Juice",
    "Sports Drinks",
  ],
  
  frozen: [
    "Ice Cream",
    "Popsicles",
    "Frozen Yogurt",
    "Slushies",
  ],
  
  bread: [
    "Hamburger Buns",
    "Hot Dog Buns",
    "Bread White",
    "Bread Wheat",
    "Tortillas",
    "Biscuits",
  ],
};

// Flat list of all items for OCR matching
export const ALL_ITEMS = Object.values(ITEMS_BY_CATEGORY).flat();

// Default items with par levels for manager setup
export const DEFAULT_INVENTORY_ITEMS = [
  // Breakfast
  { name: "Bacon", category: "breakfast", parLevel: 50, unit: "pcs" },
  { name: "Sausage Links", category: "breakfast", parLevel: 50, unit: "pcs" },
  { name: "Stuffed Waffles", category: "breakfast", parLevel: 30, unit: "pcs" },
  { name: "Little Pigs in a Blanket", category: "breakfast", parLevel: 40, unit: "pcs" },
  { name: "Big Pigs in a Blanket", category: "breakfast", parLevel: 40, unit: "pcs" },
  { name: "Kolache", category: "breakfast", parLevel: 25, unit: "pcs" },
  { name: "Boudin", category: "breakfast", parLevel: 20, unit: "pcs" },
  
  // Roller
  { name: "Egg Rolls", category: "roller", parLevel: 50, unit: "pcs" },
  { name: "Tornados", category: "roller", parLevel: 35, unit: "pcs" },
  { name: "Chicken Stick", category: "roller", parLevel: 40, unit: "pcs" },
  { name: "Corn Dog", category: "roller", parLevel: 30, unit: "pcs" },
  { name: "Hot Dog", category: "roller", parLevel: 40, unit: "pcs" },
  { name: "Crispitos", category: "roller", parLevel: 30, unit: "pcs" },
  { name: "Taquitos", category: "roller", parLevel: 35, unit: "pcs" },
  
  // Deli
  { name: "Hamburger", category: "deli", parLevel: 30, unit: "pcs" },
  { name: "Chicken Wings", category: "deli", parLevel: 50, unit: "pcs" },
  { name: "Pulled Pork", category: "deli", parLevel: 25, unit: "lbs" },
  { name: "Brisket", category: "deli", parLevel: 20, unit: "lbs" },
  { name: "Country Fried Steak", category: "deli", parLevel: 25, unit: "pcs" },
  { name: "Pork Chop", category: "deli", parLevel: 20, unit: "pcs" },
  
  // Bakery
  { name: "Cinnamon Rolls", category: "bakery", parLevel: 24, unit: "pcs" },
  { name: "Large Cookies", category: "bakery", parLevel: 36, unit: "pcs" },
  { name: "Small Cookies", category: "bakery", parLevel: 48, unit: "pcs" },
  { name: "Muffins", category: "bakery", parLevel: 24, unit: "pcs" },
  { name: "Brownies", category: "bakery", parLevel: 24, unit: "pcs" },
  { name: "Danishes", category: "bakery", parLevel: 18, unit: "pcs" },
  { name: "Donuts", category: "bakery", parLevel: 36, unit: "pcs" },
  
  // Branded/Pizza
  { name: "Pizza Whole", category: "branded", parLevel: 10, unit: "pcs" },
  { name: "Pizza Slice", category: "branded", parLevel: 40, unit: "slices" },
  { name: "Pizza Hunk", category: "branded", parLevel: 20, unit: "pcs" },
  { name: "Wings", category: "branded", parLevel: 50, unit: "pcs" },
  
  // Sides
  { name: "French Fries", category: "sides", parLevel: 100, unit: "servings" },
  { name: "Onion Rings", category: "sides", parLevel: 40, unit: "servings" },
  { name: "Mozzarella Sticks", category: "sides", parLevel: 30, unit: "pcs" },
  { name: "Tater Tots", category: "sides", parLevel: 50, unit: "servings" },
];

export default {
  ITEMS_BY_CATEGORY,
  ALL_ITEMS,
  DEFAULT_INVENTORY_ITEMS,
};
