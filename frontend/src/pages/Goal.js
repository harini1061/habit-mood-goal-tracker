import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../unified-styles.css';
import Navbar from './Navbar';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

function Goal() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const userId = '6847dd137ab96450bdb4f01c'; // Replace with dynamic userId if needed

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/goals/${userId}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !userId) return;

    try {
      await axios.post('http://localhost:5000/api/goals', {
        title,
        description,
        targetDate,
        userId
      });
      setTitle('');
      setDescription('');
      setTargetDate('');
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const markGoalCompleted = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/goals/${id}`, { completed: true });
      fetchGoals();
    } catch (err) {
      console.error('Error updating goal:', err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  // Pie chart data
  const data = [
    { name: 'Completed', value: goals.filter(g => g.completed).length },
    { name: 'Incomplete', value: goals.filter(g => !g.completed).length },
  ];

  // Vibrant colors for the pie chart
  const COLORS = ['#10B981', '#EF4444'];

  // Animation variants for Framer Motion
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  const pieVariants = {
    hidden: { opacity: 0, rotate: -90 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: { duration: 1, ease: 'easeInOut' },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Custom label renderer for pie chart with increased font size
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4; // Adjusted for better spacing
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <motion.text
        x={x}
        y={y}
        fill="#1F2937"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-2xl font-extrabold" // Increased from text-lg to text-2xl
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {`${name}: ${value}`}
      </motion.text>
    );
  };

  return (
    <div>
      
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">🎯 Goal Tracker</h1>

        {/* Goal Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal Title"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full font-semibold"
          >
            ➕ Add Goal
          </button>
        </form>

        {/* Goal List */}
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center">No goals found. Add your first goal above!</p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const today = new Date();
              const target = new Date(goal.targetDate);
              const daysLeft = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
              const showReminder = !goal.completed && daysLeft >= 0 && daysLeft <= 3;

              return (
                <div
                  key={goal._id}
                  className={`relative bg-white border rounded-lg p-5 shadow-md ${
                    goal.completed ? 'border-green-400 bg-green-50' : 'border-yellow-400 bg-yellow-50'
                  }`}
                >
                  {showReminder && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-sm px-3 py-1 rounded-bl-lg shadow-lg font-semibold animate-pulse">
                      ⏰ {daysLeft === 0 ? 'Due Today!' : `Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-indigo-700">{goal.title}</h2>
                  <p className="text-gray-700 mt-1"><strong>Description:</strong> {goal.description || '—'}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Target Date:</strong>{' '}
                    {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="mt-1">
                    <strong>Status:</strong>{' '}
                    {goal.completed ? (
                      <span className="text-green-700 font-bold">✅ Completed</span>
                    ) : (
                      <span className="text-red-600 font-bold">⏳ Pending</span>
                    )}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {!goal.completed && (
                      <button
                        onClick={() => markGoalCompleted(goal._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                      >
                        ✅ Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => deleteGoal(goal._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Goal Completion Progress Chart */}
        <motion.div
          className="mt-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-2xl p-8"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-900 tracking-wide drop-shadow-md">
            📊 Goal Completion Progress
          </h2>
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center text-lg font-semibold">No data to show progress yet.</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                    label={renderCustomLabel}
                    labelLine={{ stroke: '#4b5563', strokeWidth: 2 }}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      fontSize: '18px', // Increased from 16px to 18px
                      fontWeight: '600',
                      color: '#1F2937',
                    }}
                    formatter={(value, name) => [`${value} goals`, name]}
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '18px', // Increased from 16px to 18px
                      fontWeight: '700',
                      color: '#1F2937',
                    }}
                    formatter={(value) => (
                      <span className="text-purple-900 drop-shadow-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <motion.div
                className="mt-4 text-center"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-xl font-bold text-purple-900 drop-shadow-md">
                  <span className="text-green-600">{data[0].value}</span> Completed /{' '}
                  <span className="text-red-600">{data[1].value}</span> Incomplete
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Goal;