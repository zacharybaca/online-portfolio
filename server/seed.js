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
const { connect, Schema, model } = mongoose;

const projectSchema = new Schema({
  title: String,
  description: String,
  imageUrls: [String],
  tags: [String],
  repoLink: String,
  demoLink: String,
});

const Project = model('Project', projectSchema);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tags: [String],
    coverImage: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

const BlogPost = model('BlogPost', blogSchema);

// Sample blog posts that demonstrate technical depth
const sampleBlogPosts = [
  {
    title: 'Bridging COBOL and React: What Legacy Systems Taught Me About State Management',
    slug: 'cobol-react-state-management',
    summary:
      'Working with mainframe COBOL before building React apps gave me an unusual lens on state — and it made me a better frontend engineer.',
    content: `When most developers think about state management, they picture Redux reducers or Zustand stores. I think about VSAM files and COBOL WORKING-STORAGE sections.

Before I transitioned into web development, I spent time working with z/OS mainframe systems — the backbone of enterprise computing that processes trillions of dollars in transactions every day. COBOL programs maintain strict, predictable state through explicit data divisions. Every variable is declared, typed, and scoped. There are no closures, no prototypal inheritance, no async surprises.

Then I started writing React.

The contrast was jarring at first — but it turned out to be clarifying. Here are three lessons from legacy systems that made me a better frontend engineer:

**1. Explicit is better than implicit**
COBOL forces you to declare every piece of data you use. React's useState and useReducer encourage the same discipline when used intentionally. Developers who reach for global state by default often end up with the "spooky action at a distance" that COBOL programs never suffer from.

**2. Predictability is a feature**
Mainframe systems run 24/7 for decades. The engineers who built them optimized for predictability above everything else. When I design component state today, I ask: "What is the minimum amount of state needed to derive this UI?" That question comes directly from mainframe thinking.

**3. Reliability requires knowing your failure modes**
COBOL programs handle errors explicitly with condition codes. Modern JavaScript's try/catch and React Error Boundaries are our equivalent — but many developers treat them as optional. Mainframe engineers never would.

The skills are more transferable than they look. The stack changes; the engineering principles don't.`,
    tags: ['COBOL', 'React', 'State Management', 'Career'],
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
    status: 'published',
  },
  {
    title: 'Building Real-Time Features with WebSockets in a MERN App',
    slug: 'websockets-mern-real-time',
    summary:
      'How I added live chat and real-time task updates to my bug tracker without a third-party service.',
    content: `One of the most common questions I get about my Issue Insight bug tracker is: "How did you build the real-time chat?"

The short answer: WebSockets, socket.io, and a careful understanding of where state lives.

**Why not polling?**
The naive approach to "real-time" is polling — hitting an endpoint every few seconds to check for new data. It works, but it wastes resources on both sides and introduces latency that users can feel. WebSockets maintain a persistent bidirectional connection, so the server can push updates the instant they happen.

**The architecture**
On the server side, I initialized socket.io alongside my Express app:

  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    socket.on('send_message', (data) => {
      io.emit('receive_message', data);
    });
  });

On the client, I connected once at the top level and passed the socket down via context — avoiding the common mistake of creating a new connection per component mount.

**The key insight**
The hardest part wasn't the WebSocket code — it was reconciling socket events with React state. The pattern that worked: treat socket events like any other async operation. Validate on arrival, update state through a reducer, never mutate in the event handler directly.

The result is a chat feature that feels genuinely real-time, with zero third-party services and a backend that stays under free-tier limits.`,
    tags: ['WebSockets', 'MERN', 'Node.js', 'React'],
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800',
    status: 'published',
  },
  {
    title: 'Why I Built My Portfolio With a Real Backend (And Why You Should Too)',
    slug: 'portfolio-real-backend',
    summary:
      'Static portfolios blend in. Here is why running a full Express + MongoDB backend for my portfolio is actually a competitive advantage.',
    content: `Most developer portfolios are static sites deployed on GitHub Pages or Netlify. That is fine — but it also means your portfolio looks like every other bootcamp grad's portfolio.

Mine runs a full Express + MongoDB backend. Here is why that decision was intentional and worth the extra complexity:

**It is itself a project**
Every recruiter who browses my portfolio is looking at a live, full-stack application — not a static HTML file with hardcoded data. The admin dashboard lets me add, edit, and delete projects and blog posts in real time. If they look at the network tab, they will see real API calls.

**It demonstrates deployment knowledge**
Deploying a Node.js server with persistent storage requires understanding environment variables, database connections, CORS, file serving, and process management. These are table stakes for any backend role.

**It forces you to think about data modeling**
When I added the challenge/solution fields to my project model, I had to think about schema design, backward compatibility, and how to migrate existing data. That is real engineering work — the kind you do on a production system.

**The tradeoff**
The honest tradeoff: Render's free tier cold-starts can take 30–50 seconds. I mitigate this with a skeleton loading UI so the experience does not feel broken. That is also a real engineering decision — choosing UX that communicates "loading" rather than "broken."

The portfolio is not just a showcase. It is a working system.`,
    tags: ['Portfolio', 'MongoDB', 'Express', 'Career'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
    status: 'published',
  },
];

// 2. The Conversion Logic
const seedDB = async () => {
  try {
    // Connect to DB
    await connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Read your existing data.json
    const jsonPath = path.join(__dirname, '../src/data.json');
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Access the "projects" array from your JSON
    const oldProjects = data.projects;

    // Map OLD keys to NEW keys
    const formattedProjects = oldProjects.map((p) => ({
      title: p.project_name,
      description: p.description,
      tags: p.technologies,
      imageUrls: p.image_urls,
      repoLink: p.github_link,
      demoLink: p.live_link,
    }));

    // Clear existing data
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert new data
    await Project.insertMany(formattedProjects);
    console.log(`🌱 Successfully seeded ${formattedProjects.length} projects!`);

    // Seed blog posts (skip if slugs already exist)
    for (const post of sampleBlogPosts) {
      const exists = await BlogPost.findOne({ slug: post.slug });
      if (!exists) {
        await BlogPost.create(post);
        console.log(`📝 Seeded blog post: "${post.title}"`);
      } else {
        console.log(`⏭️  Blog post already exists: "${post.title}"`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
