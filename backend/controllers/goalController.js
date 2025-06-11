const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await Goal.find({ userId });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await Goal.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
