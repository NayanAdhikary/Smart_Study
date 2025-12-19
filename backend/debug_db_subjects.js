const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('./src/models/Department');
const Subject = require('./src/models/Subjects');

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/SmartStudy';

console.log("--- SUBJECT DIAGNOSTIC START ---");
async function testSubjects() {
    try {
        await mongoose.connect(uri);
        console.log("✅ DB Connected");

        console.log("Fetching subjects with population...");
        const subjects = await Subject.find({})
            .populate("department", "name")
            .populate("createdBy", "username email");

        console.log(`✅ Fetched ${subjects.length} subjects`);
        if (subjects.length > 0) {
            console.log("Sample:", JSON.stringify(subjects[0], null, 2));
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ ERROR:", error);
    }
}
testSubjects();
