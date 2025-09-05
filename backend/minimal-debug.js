// Create this as minimal-debug.js in your backend folder
// This will help us find the EXACT source of the problem

require('dotenv').config();

console.log("🔍 Starting minimal debug...");

try {
  console.log("1. Testing express...");
  const express = require('express');
  const app = express();
  console.log("✅ Express imported successfully");

  console.log("2. Testing mongoose...");
  const mongoose = require('mongoose');
  console.log("✅ Mongoose imported successfully");

  console.log("3. Testing basic middleware...");
  app.use(express.json());
  console.log("✅ Basic middleware added successfully");

  console.log("4. Testing simple route...");
  app.get('/test', (req, res) => res.send('Test works'));
  console.log("✅ Simple route added successfully");

  console.log("5. Testing passport import...");
  const passport = require('passport');
  console.log("✅ Passport imported successfully");

  console.log("6. Testing passport config import...");
  require('./config/passport')(passport);
  console.log("✅ Passport config imported successfully");

  console.log("7. Testing auth middleware import...");
  const auth = require('./middleware/auth');
  console.log("✅ Auth middleware imported successfully");

  console.log("8. Testing model imports...");
  const User = require('./models/User');
  console.log("✅ User model imported successfully");
  
  const Habit = require('./models/Habit');
  console.log("✅ Habit model imported successfully");
  
  const Mood = require('./models/Mood');
  console.log("✅ Mood model imported successfully");
  
  const Goal = require('./models/Goal');
  console.log("✅ Goal model imported successfully");
  
  const PartnerRequest = require('./models/PartnerRequest');
  console.log("✅ PartnerRequest model imported successfully");

  console.log("9. Testing controller imports...");
  const habitController = require('./controllers/habitController');
  console.log("✅ Habit controller imported successfully");
  
  const { createMood, getMoods, updateMood, deleteMood } = require('./controllers/moodController');
  console.log("✅ Mood controller imported successfully");
  
  const { createGoal, getGoals, updateGoal, deleteGoal } = require('./controllers/goalController');
  console.log("✅ Goal controller imported successfully");
  
  const { signup, login } = require('./controllers/authController');
  console.log("✅ Auth controller imported successfully");
  
  const partnerController = require('./controllers/partnerController');
  console.log("✅ Partner controller imported successfully");

  console.log("10. Testing route file imports (without using them)...");
  const habitRoutes = require('./routes/habitRoutes');
  console.log("✅ Habit routes imported successfully");
  
  const moodRoutes = require('./routes/moodRoutes');
  console.log("✅ Mood routes imported successfully");
  
  const goalRoutes = require('./routes/goalRoutes');
  console.log("✅ Goal routes imported successfully");
  
  const authRoutes = require('./routes/authRoutes');
  console.log("✅ Auth routes imported successfully");
  
  const partnerRoutes = require('./routes/partnerRoutes');
  console.log("✅ Partner routes imported successfully");

  console.log("11. Testing route mounting one by one...");
  
  console.log("11a. Mounting habit routes...");
  app.use('/api/habits', habitRoutes);
  console.log("✅ Habit routes mounted successfully");
  
  console.log("11b. Mounting mood routes...");
  app.use('/api/moods', moodRoutes);
  console.log("✅ Mood routes mounted successfully");
  
  console.log("11c. Mounting goal routes...");
  app.use('/api/goals', goalRoutes);
  console.log("✅ Goal routes mounted successfully");
  
  console.log("11d. Mounting auth routes...");
  app.use('/api/auth', authRoutes);
  console.log("✅ Auth routes mounted successfully");
  
  console.log("11e. Mounting partner routes...");
  app.use('/api/partners', partnerRoutes);
  console.log("✅ Partner routes mounted successfully");

  console.log("12. Starting server...");
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`🎉 SUCCESS! Server running on http://localhost:${PORT}`);
    console.log("The issue was successfully isolated and fixed!");
  });

} catch (error) {
  console.log("\n❌ ERROR FOUND:");
  console.log("Error message:", error.message);
  console.log("Error stack:", error.stack);
  console.log("\n🎯 The error occurred at the step above this message!");
}