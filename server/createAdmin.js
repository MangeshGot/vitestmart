const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ email: 'admin@example.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            if (!adminExists.isAdmin) {
                adminExists.isAdmin = true;
                await adminExists.save();
                console.log('Existing user updated to Admin');
            }
        } else {
            const user = await User.create({
                full_name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                isAdmin: true
            });
            console.log('Admin user created successfully');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
