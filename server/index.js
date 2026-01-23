// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB (You'll need a connection string from MongoDB Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// 2. Define the Schema
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  tags: [String],
  repoLink: String,
  demoLink: String,
});

const Project = mongoose.model('Project', projectSchema);

// 3. Create Routes

// GET: Fetch all projects (for your Portfolio Home page)
app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// POST: Add a new project (For your Admin Dashboard)
app.post('/api/projects', async (req, res) => {
  // Simple security check
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const newProject = new Project(req.body);
  await newProject.save();
  res.json(newProject);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
