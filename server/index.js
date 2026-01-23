// server/index.js

// 1. FIX: Use this import syntax instead of require('dotenv').config()
import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose'; // Import mongoose as a default
import cors from 'cors';

const { connect, Schema, model } = mongoose; // Destructure what you need
const app = express();

// 2. FIX: Use express.json() directly
app.use(express.json());
app.use(cors());

// 3. Connect to MongoDB
// Note: Ensure your .env file is in the ROOT folder (same level as package.json)
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// 4. Define the Schema
const projectSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
  tags: [String],
  repoLink: String,
  demoLink: String,
});

const Project = model('Project', projectSchema);

// 5. Create Routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  // Simple security check
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
