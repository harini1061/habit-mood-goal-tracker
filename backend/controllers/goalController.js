const Goal = require('../models/Goal');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const { title, description, targetDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const goal = new Goal({
      userId: req.user.id, // Get from JWT
      title,
      description,
      targetDate
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all goals for authenticated user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, targetDate } = req.body;

    // Only update the fields that should be updatable
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) updateFields.completed = completed;
    if (targetDate !== undefined) updateFields.targetDate = targetDate;

    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // match goal + owner
      { $set: updateFields },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found or not authorized' });
    }

    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // Only delete if this goal belongs to the logged-in user
    const deletedGoal = await Goal.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found or not authorized' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};