// server/index.js

// 1. IMPORT & SETUP
import process from 'process';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer'; // Handles file uploads
import fs from 'fs'; // Handles file system (creating folders)
import path from 'path'; // Handles file paths
import { fileURLToPath } from 'url';

// FIX: Recreate __dirname for ES Modules (it doesn't exist by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { connect, Schema, model } = mongoose;
const app = express();

// 2. MIDDLEWARE
app.use(express.json());
app.use(cors());

// --- MULTER CONFIGURATION (For File Uploads) ---
// Helper to clean project names for folders (e.g. "My App" -> "my-app")
const sanitizeName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define path: Go up one level from 'server' folder, then into 'public/images/projects'
    const folderName = sanitizeName(req.body.title || 'untitled-project');
    const uploadPath = path.join(__dirname, '../public/images/projects', folderName);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, uniqueSuffix + '-' + cleanFileName);
  },
});

// Using .any() is safer to prevent "Unexpected field" errors
const upload = multer({ storage: storage });
// ----------------------------------------------

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
  imageUrls: [String],
  tags: [String],
  repoLink: String,
  demoLink: String,
  // Status for "In Progress" section
  status: {
    type: String,
    enum: ['completed', 'in-progress'],
    default: 'completed',
  },
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

// POST: Add a new project (Handles Text + Files)
app.post('/api/projects', upload.any(), async (req, res) => {
  // Security Check
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const { title, description, tags, repoLink, demoLink, status } = req.body;

    // Convert uploaded file objects into URL strings for the DB
    const imageUrls = (req.files || []).map((file) => {
      const folderName = sanitizeName(title || 'untitled-project');
      return `/images/projects/${folderName}/${file.filename}`;
    });

    const newProject = new Project({
      title,
      description,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      imageUrls,
      repoLink,
      demoLink,
      status: status || 'completed',
    });

    await newProject.save();
    res.json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update an existing project
app.put('/api/projects/:id', upload.any(), async (req, res) => {
  // 1. Security Check
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const { title, description, tags, repoLink, demoLink, status } = req.body;

    // 2. Find the project
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 3. Update Text Fields (only if provided)
    if (title) project.title = title;
    if (description) project.description = description;
    if (tags) project.tags = tags.split(',').map((t) => t.trim());
    if (repoLink) project.repoLink = repoLink;
    if (demoLink) project.demoLink = demoLink;
    if (status) project.status = status;

    // 4. Handle NEW Images (Append to existing list)
    if (req.files && req.files.length > 0) {
      const folderName = sanitizeName(project.title || 'untitled-project');
      const newImageUrls = req.files.map((file) => {
        return `/images/projects/${folderName}/${file.filename}`;
      });

      // Ensure array exists before pushing
      if (!Array.isArray(project.imageUrls)) {
        project.imageUrls = [];
      }

      project.imageUrls.push(...newImageUrls);
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// DELETE: Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  // 1. Security Check
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // 2. Find the project first (so we know which folder to delete)
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 3. OPTIONAL: Delete the images folder from the server
    // (We recreate the folder name based on the title)
    const folderName = sanitizeName(project.title);
    const folderPath = path.join(__dirname, '../public/images/projects', folderName);

    // Check if folder exists, then delete it
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // 4. Delete from Database
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
