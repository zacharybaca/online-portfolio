// server/index.js

// 1. IMPORT & SETUP
import process from 'process';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const { connect, Schema, model } = mongoose;
const app = express();

// 2. MIDDLEWARE
app.use(express.json());
app.use(cors());

// 3. CONNECT TO MONGODB
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// 4. DEFINE THE SCHEMA
const projectSchema = new Schema({
  title: String,
  description: String,
  // UPDATED: Changed from single string to Array of Strings
  imageUrls: [String],
  tags: [String],
  repoLink: String,
  demoLink: String,
});

const Project = model('Project', projectSchema);

// 5. CREATE ROUTES

// GET: Fetch all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new project
app.post('/api/projects', async (req, res) => {
  // Security Check
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // The body will now contain { title, ..., imageUrls: ["url1", "url2"] }
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
