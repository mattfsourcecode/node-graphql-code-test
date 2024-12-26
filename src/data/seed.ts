const prices = {
  sandwiches: {
    cold: {
      half: 7.95,
      whole: 9.25,
    },
  },
  // Add more price variables here
};
const seedData: Record<string, unknown> = {
  menu: {
    appetizers: [
      {
        id: "1",
        name: "Iceberg Wedge Salad with House Cured Bacon",
        description: "tomato salsa, gorgonzola",
        price: 7.5,
      },
      {
        id: "2",
        name: "Sautéed Shredded Brussels Sprouts",
        description: "bacon, hazelnuts, gorgonzola",
        price: 6.95,
      },
      {
        id: "3",
        name: "Kale Salad",
        description: "parmesan crisp, corn, radish, garlic-lemon vinaigrette",
        price: 7.5,
      },
      {
        id: "4",
        name: "Pecan Crusted Utah Goat Cheese with Basil-Mint Pesto",
        description: "grilled tomato salsa, crostini",
        price: 6.95,
      },
      {
        id: "5",
        name: "Chicken and Cabbage Eggrolls",
        description: "hot & sour dipping sauce",
        price: 6.95,
      },
    ],
    entrees: [
      {
        id: "10",
        name: "Farfalle Pasta with Braised Pork in Tomato Cream",
        description: "capers, butternut squash, kale",
        price: 12.95,
      },
      {
        id: "11",
        name: "Stout Braised Bratwurst",
        description:
          "horseradish mashed potatoes, roasted root veggies, grilled onion",
        price: 13.95,
      },
      {
        id: "12",
        name: "Salmon & Crispy Tofu in Yellow Curry Sauce",
        description: "vegetable sauté, golden raisin chutney",
        price: 15.95,
      },
      {
        id: "13",
        name: "Sesame Shrimp",
        description:
          "udon noodles, ramen broth, shiitake mushrooms, bean sprouts, scallions",
        price: 13.95,
      },
    ],
    sandwiches: {
      description:
        "Served with choice of house pasta salad, green salad, or fresh fruit. For an additional $1.50, you can “upgrade” to ½ pasta salad of the day, French onion soup or soup of the day.",
      cold: [
        {
          id: "20",
          name: "Turkey & Avocado",
          description: "with tomato",
          halfPrice: prices.sandwiches.cold.half,
          fullPrice: prices.sandwiches.cold.whole,
        },
        {
          id: "21",
          name: "Pub Club",
          description: "turkey, bacon, lettuce, tomato",
          halfPrice: prices.sandwiches.cold.half,
          fullPrice: prices.sandwiches.cold.whole,
        },
        {
          id: "22",
          name: "Rare Roast Beef & Swiss",
          description: "sweet-hot mustard, lettuce, red onion",
          halfPrice: prices.sandwiches.cold.half,
          fullPrice: prices.sandwiches.cold.whole,
        },
        {
          id: "23",
          name: "Veggie",
          description: "pepper jack, avocado, sprout, tomato",
          halfPrice: prices.sandwiches.cold.half,
          fullPrice: prices.sandwiches.cold.whole,
        },
      ], // NOTE: Ensure sales tracking can index purchases for half and whole cold sandwiches separately (This can be solved in POST requests).
      hot: [
        {
          id: "30",
          name: "Southwest Chicken Breast",
          description:
            "grilled onion, poblano pepper, tomato, lettuce, jack cheese",
          price: 9.5,
        },
        {
          id: "31",
          name: "Portobello",
          description:
            "fresh mozzarella, caramelized onion, roasted pepper, tomato, field greens, basil aioli",
          price: 9.5,
        },
        {
          id: "32",
          name: "Chipotle BBQ Pork Sandwich",
          description: "pickled jalapeño slaw",
          price: 9.5,
        },
        {
          id: "33",
          name: "Bacon Burger",
          description: "Swiss, lettuce, tomato",
          price: 9.25,
        },
        {
          id: "34",
          name: "Mexi Burger",
          description: "pepper relish, pepper jack, tomato, lettuce, guacamole",
          price: 9.25,
        },
      ],
    },
    soupAndSaladCombos: [
      {
        id: "40",
        name: "French Onion or Soup of the Day",
        price: 4.95,
      },
      {
        id: "41",
        name: "French Onion or Soup of the Day with small green salad, fresh fruit, or house pasta",
        price: 7.25,
      },
      {
        id: "42",
        name: "French Onion or Soup of the Day with half pasta of the day",
        price: 8.75,
      },
    ],
    fajitas: [
      {
        id: "50",
        description:
          "Served with red rice, black beans, grilled tomato salad, choice of corn or flour tortillas",
        price: 10.95,
        options: [
          {
            id: "51",
            name: "Chicken",
            description:
              "Onions, poblano and bell peppers, guacamole, two salsas",
          },
          {
            id: "52",
            name: "Sirloin Steak",
            description:
              "Onions, poblano and bell peppers, carrots, guacamole, two salsas",
          },
        ],
      },
    ],
    tacos: [
      {
        id: "60",
        description:
          "Served with red rice, black beans, corn & romaine salad, tortilla chips",
        price: 9.95,
        options: [
          {
            id: "61",
            name: "Beer Battered Fish",
            description: "Jalapeño remoulade, roasted salsa, cabbage",
          },
          {
            id: "62",
            name: "Carne Asada",
            description: "Guacamole, tomatillo salsa",
          },
        ],
      },
    ],
    enchiladas: [
      {
        id: "70",
        description:
          "With Southwestern Succotash, Black Beans with Chipotle Crema",
        options: [
          {
            id: "71",
            name: "Beef",
          },
          {
            id: "72",
            name: "Chicken",
          },
          {
            id: "73",
            name: "Cheese",
          },
          {
            id: "74",
            name: "Veggie",
          },
        ],
        sizes: [
          {
            id: "75",
            name: "uno",
            price: 8.5,
          },
          {
            id: "76",
            name: "dos",
            price: 9.95,
          },
          {
            id: "77",
            name: "tres",
            price: 11.5,
          },
        ],
      },
      {
        id: "78",
        name: "Chili Relleno",
        description:
          "Stuffed with Jack Cheese & Corn, Glazed Yam, Chayote Squash Succotash, Red Chili Sauce",
        price: 9.95,
      },
      {
        id: "79",
        name: "Pepita Crusted Salmon with Chipotle Glaze",
        description: "Chevre whipped yams, jicama slaw, tomatillo sauce",
        price: 10.95,
      },
    ],
    quiche: [
      {
        id: "80",
        name: "Bacon, Swiss, Mushroom, Zucchini and Mushroom Quiche",
        description: "Choice of Fresh Fruit or Green Salad",
        price: 8.95,
      },
    ],
    greenSalads: [
      {
        id: "90",
        name: "Grilled Red Trout",
        description:
          "Lentils, Tomatoes, Cukes, Green Beans, Red Bells, Almonds, Sundried Tomato Vinaigrette",
        price: 10.95,
      },
      {
        id: "91",
        name: "Smoked Turkey",
        description:
          "Cheese Tortellini, Bacon, Tomato, Cucumber, Egg, Black Bean-Corn Salsa, Avocado",
        price: 9.95,
      },
      {
        id: "92",
        name: "Asian Grilled Chicken",
        description:
          "Snow Peas, Carrot Slaw, Red Bells, Water Chestnut, Peanuts, Baby Corn, Cilantro, Cukes, Spicy Peanut Dressing",
        price: 10.5,
      },
      {
        id: "93",
        name: "Southwest Grilled Chicken",
        description:
          "Tomato, Guacamole, Pepitas, Jicama, Corn & Black Bean Salsa, Orange Wedges, Spicy Citrus Vinaigrette",
        price: 10.5,
      },
      {
        id: "94",
        name: "Mediterranean",
        description:
          "Italian Sausage, Artichoke Hearts, Green Beans, Roma Tomato, Kalamatas, Red Onion, Cucumber, Croutons, Parmesan, Fresh Mozzarella, Gorgonzola Vinaigrette",
        price: 9.95,
      },
      {
        id: "95",
        name: "Grilled Salmon",
        description:
          "Artichoke Tapenade, Shredded Kale, Corn, Radish, Parmesan Crisps",
        price: 11.5,
      },
    ],
  },
  // Add menus here
};

export default seedData;
