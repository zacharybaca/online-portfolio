// server/seed.js
import process from 'process';
import 'dotenv/config'; // Loads your .env variables
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Setup paths to read the JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Schema (Must match index.js)
const { connect, Schema, model, connection } = mongoose;

const projectSchema = new Schema({
  title: String,
  description: String,
  imageUrls: [String],
  tags: [String],
  repoLink: String,
  demoLink: String,
});

const Project = model('Project', projectSchema);

// 2. The Conversion Logic
const seedDB = async () => {
  try {
    // Connect to DB
    await connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Read your existing data.json
    // Note: Adjust the path '../src/data.json' if your file is somewhere else
    const jsonPath = path.join(__dirname, '../src/data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Access the "projects" array from your JSON
    const oldProjects = data.projects;

    // Map OLD keys to NEW keys
    const formattedProjects = oldProjects.map((p) => ({
      title: p.project_name, // project_name -> title
      description: p.description, // matches
      tags: p.technologies, // technologies -> tags
      imageUrls: p.image_urls, // image_urls -> imageUrls
      repoLink: p.github_link, // github_link -> repoLink
      demoLink: p.live_link, // live_link -> demoLink
    }));

    // Clear existing data (Optional: Remove this line if you want to keep existing data)
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert new data
    await Project.insertMany(formattedProjects);
    console.log(`🌱 Successfully seeded ${formattedProjects.length} projects!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
