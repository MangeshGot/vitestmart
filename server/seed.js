require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
    { name: "Peanut Chiki", basePrice: 9.00, category: "chiki", description: "Crunchy roasted peanuts bound with natural jaggery. A perfect energy booster.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_akp1e0akp1e0akp1.png?updatedAt=1754408196613", nutrition: ["Calories: 150 kcal", "Protein: 5g", "Iron: 10%"] },
    { name: "Sesame Chiki", basePrice: 9.00, category: "chiki", description: "Nutrition-packed sesame seeds with natural sweeteners. Good for immunity.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_x4u95dx4u95dx4u9.png?updatedAt=1754408201139", nutrition: ["Calories: 160 kcal", "Calcium: 15%", "Fiber: 3g"] },
    { name: "Nutritius Crush", basePrice: 9.00, category: "chiki", description: "Crushed peanut chikki, easy to eat and delicious for quick bites.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_odg9gbodg9gbodg9.png?updatedAt=1754453931797", nutrition: ["Protein: 4g", "Carbs: 12g"] },
    { name: "Chocolate Smoodh", basePrice: 9.00, category: "smooth", description: "Indulgent chocolate and milk blend. Rich, creamy, and satisfying.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_40bubd40bubd40bu.png?updatedAt=1754408195624", nutrition: ["Calcium: 25%", "Vitamin D: 10%"] },
    { name: "Hazelnut Smoodh", basePrice: 9.00, category: "smooth", description: "Delightful blend of hazelnut and chocolate. A premium treat.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_p3vc40p3vc40p3vc.png?updatedAt=1754408197028", nutrition: ["Vitamin E: 10%", "Energy: 180kcal"] },
    { name: "Coffee Frappe", basePrice: 9.00, category: "smooth", description: "Refreshing blend of coffee and milk to keep you alert.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_y4dlpqy4dlpqy4dl.png?updatedAt=1754408200654", nutrition: ["Caffeine: 80mg", "Calcium: 20%"] },
    { name: "Badam Milk", basePrice: 9.00, category: "milk", description: "Rich almond milk, dairy-free alternative loaded with nuts.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_gu6iu6gu6iu6gu6i.png?updatedAt=1754408196637", nutrition: ["Vitamin E: 50%", "Healthy Fats: 6g"] },
    { name: "Rose Milk", basePrice: 9.00, category: "milk", description: "Lightly sweetened milk with authentic rose flavor. Cooling effect.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_15zs4c15zs4c15zs.png?updatedAt=1754408195676", nutrition: ["Calcium: 40%", "Sugar: 8g"] },
    { name: "Chocolate Milk", basePrice: 9.00, category: "milk", description: "Rich cocoa flavor with creamy milk. Kids favorite.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_acoo6acoo6acoo6a.png?updatedAt=1754408196138", nutrition: ["Calcium: 45%", "Protein: 8g"] },
    {
        name: "Socks", basePrice: 80.00, category: "Dress", description: "Navy Blue School Socks. Durable cotton blend.",
        image: "https://ik.imagekit.io/m1aziocop/Rmdis%20socks.jpg?updatedAt=1753775771301",
        variants: [
            { size: "S (1-3)", price: 80 }, { size: "M (4-6)", price: 80 }, { size: "L (7-10)", price: 90 }
        ]
    },
    {
        name: "Shoes", basePrice: 499.00, category: "Dress", description: "Black School Shoes, comfortable fit for all day wear.", image: "https://ik.imagekit.io/m1aziocop/Shoes.jpg?updatedAt=1753775863971",
        variants: [
            { size: "5", price: 499 }, { size: "6", price: 499 }, { size: "7", price: 549 }, { size: "8", price: 549 }, { size: "9", price: 599 }, { size: "10", price: 599 }
        ]
    },
    { name: "Normal Pants", basePrice: 499.00, category: "Dress", description: "School Black Normal Pants. Wrinkle-free fabric.", image: "https://ik.imagekit.io/m1aziocop/Normal%20PAnt.jpg?updatedAt=1753775965142", variants: [{ size: "22", price: 499 }, { size: "24", price: 519 }, { size: "26", price: 539 }, { size: "28", price: 559 }, { size: "30", price: 579 }, { size: "32", price: 599 }] },
    { name: "Sports Pants", basePrice: 599.00, category: "Dress", description: "School Sports Pants with orange stripe. Stretchable.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_nqz5oenqz5oenqz5.png?updatedAt=1754408196625", variants: [{ size: "22", price: 599 }, { size: "24", price: 619 }, { size: "26", price: 639 }, { size: "28", price: 659 }, { size: "30", price: 679 }, { size: "32", price: 699 }] },
    { name: "Sports Shirt", basePrice: 599.00, category: "Dress", description: "Breathable School Sports Shirt. Sweat wicking technology.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_egk1wyegk1wyegk1.png?updatedAt=1754408196599", variants: [{ size: "22", price: 599 }, { size: "24", price: 619 }, { size: "26", price: 639 }, { size: "28", price: 659 }, { size: "30", price: 679 }, { size: "32", price: 699 }] },
    { name: "Hoodie", basePrice: 799.00, category: "Dress", description: "Soft and warm School Hoodie. Perfect for winter mornings.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_umas1mumas1mumas.png?updatedAt=1754408200751", variants: [{ size: "22", price: 799 }, { size: "24", price: 819 }, { size: "26", price: 839 }, { size: "28", price: 859 }, { size: "30", price: 879 }, { size: "32", price: 899 }] },
    { name: "Normal Shirt (Sr)", basePrice: 399.00, category: "Dress", description: "Shirt for Std 8-10. Formal fit.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_tpcmtotpcmtotpcm.png?updatedAt=1754408200648", variants: [{ size: "22", price: 399 }, { size: "24", price: 419 }, { size: "26", price: 439 }, { size: "28", price: 459 }, { size: "30", price: 479 }, { size: "32", price: 499 }] },
    { name: "Girls Skirt", basePrice: 399.00, category: "Dress", description: "Comfortable School Skirt. Pleated design.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_43q8gp43q8gp43q8.png?updatedAt=1754408196212", variants: [{ size: "22", price: 399 }, { size: "24", price: 419 }, { size: "26", price: 439 }, { size: "28", price: 459 }, { size: "30", price: 479 }, { size: "32", price: 499 }] },
    { name: "Normal Shirt (Jr)", basePrice: 399.00, category: "Dress", description: "Shirt For Std 1-7. Cotton rich fabric.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_1tsw0n1tsw0n1tsw.png?updatedAt=1754408196372", variants: [{ size: "22", price: 399 }, { size: "24", price: 419 }, { size: "26", price: 439 }, { size: "28", price: 459 }, { size: "30", price: 479 }, { size: "32", price: 499 }] },
    { name: "School Bag", basePrice: 599.00, category: "Dress", description: "Durable School Bag with multiple compartments.", image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_q9oco9q9oco9q9oc.png?updatedAt=1754408200489" },
    {
        name: "Pre-Primary Uniform Set", basePrice: 650.00, category: "Dress",
        description: "Complete uniform set for Nursery/LKG/UKG. Includes shirt and shorts/skirt. Soft fabric for delicate skin.",
        image: "https://ik.imagekit.io/m1aziocop/Shlok/Gemini_Generated_Image_1tsw0n1tsw0n1tsw.png?updatedAt=1754408196372",
        nutrition: ["Fabric: 100% Cotton", "Set: Shirt + Bottom"],
        variants: [
            { size: "16 (Nursery)", price: 650 },
            { size: "18 (LKG)", price: 680 },
            { size: "20 (UKG)", price: 710 }
        ]
    }
];

const importData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
