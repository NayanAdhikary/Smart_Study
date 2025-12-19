const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const createAdmin = async () => {
    await connectDB();

    const adminEmail = 'admin@smartstudy.com';
    const adminPassword = 'admin123'; // basic password
    const adminUsername = 'SuperAdmin';

    try {
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists!');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const user = await User.create({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`Admin created successfully!`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
