const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SmartStudy';

console.log("--- DIAGNOSTIC SCRIPT START ---");
console.log(`Target MongoDB URI: ${uri}`);

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: String
});
const User = mongoose.model('User', userSchema);

async function testConnection() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected Successfully!");

        console.log("Fetching users...");
        const users = await User.find({});
        console.log(`✅ Found ${users.length} users in the database.`);

        if (users.length > 0) {
            console.log("Sample User:", JSON.stringify(users[0], null, 2));
        } else {
            console.log("⚠️ Database is connected but empty (0 users found).");
        }

        mongoose.connection.close();
        console.log("--- DIAGNOSTIC SCRIPT END ---");
    } catch (error) {
        console.error("❌ CONNECTION ERROR:", error.message);
        console.error("Full Error:", error);
    }
}

testConnection();
