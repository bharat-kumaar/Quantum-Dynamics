const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let mongod = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quantum-dynamics-db";

  try {
    // Attempt connecting to configured MONGO_URI with 2-second timeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log("✅ Connected to MongoDB:", primaryUri);
    await seedInitialData();
  } catch (error) {
    console.warn("⚠️ Local/External MongoDB not reachable (" + error.message + ").");
    console.log("⚡ Starting embedded MongoMemoryServer for instant local development...");

    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      mongod = await MongoMemoryServer.create({
        binary: {
          version: "7.0.14"
        },
        instance: {
          dbName: "quantum-dynamics-db"
        }
      });
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log("✅ Connected to embedded MongoDB at:", memoryUri);
      await seedInitialData();
    } catch (fallbackError) {
      console.error("❌ Failed to initialize embedded MongoDB:", fallbackError.message);
      process.exit(1);
    }
  }
};

const seedInitialData = async () => {
  try {
    const User = require("../models/user");
    const Project = require("../models/project");

    const existingAdmin = await User.findOne({ email: "bharatkumar70233@gmail.com" });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      const adminUser = await User.create({
        name: "Bharat Kumar",
        email: "bharatkumar70233@gmail.com",
        password: hashedPassword,
        role: "admin",
        department: "Core Engineering"
      });
      console.log("🌱 Default user created: bharatkumar70233@gmail.com (password: password123)");
    }

    const projectCount = await Project.countDocuments();
    if (projectCount <= 1) {
      try {
        const seedScript = require("./seedProjectsAndMedia");
        if (typeof seedScript === 'function') {
          await seedScript();
        }
      } catch (e) {
        // Fallback silently if standalone script is not a module
      }
    }
  } catch (seedErr) {
    console.warn("Seeding warning:", seedErr.message);
  }
};

module.exports = connectDB;
