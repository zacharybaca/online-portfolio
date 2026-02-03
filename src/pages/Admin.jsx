import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [adminKey, setAdminKey] = useState('');

  // --- PROJECT STATE ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    repoLink: '',
    demoLink: '',
    status: 'completed',
  });
  const [files, setFiles] = useState([]);

  // --- BLOG STATE (NEW) ---
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: '',
    status: 'draft',
    coverImage: '',
  });

  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/projects`);
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- PROJECT HANDLERS ---
  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // --- BLOG HANDLERS (NEW) ---
  const handleBlogTextChange = (e) => {
    setBlogFormData({ ...blogFormData, [e.target.name]: e.target.value });
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!adminKey) {
      alert('Please enter your Admin Key first.');
      return;
    }

    setMessage('Posting Blog...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Blogs are JSON only (no file uploads for now)
          'x-admin-secret': adminKey,
        },
        body: JSON.stringify(blogFormData),
      });

      if (res.ok) {
        setMessage('Blog Post Created!');
        // Reset Form
        setBlogFormData({
          title: '',
          slug: '',
          summary: '',
          content: '',
          tags: '',
          status: 'draft',
          coverImage: '',
        });
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.message}`);
        setMessage('');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server Error');
    }
  };

  // --- PROJECT SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading Project...');
    const data = new FormData();

    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: { 'x-admin-secret': adminKey },
        body: data,
      });

      if (res.ok) {
        setMessage('Project added successfully!');
        setFormData({
          title: '',
          description: '',
          tags: '',
          repoLink: '',
          demoLink: '',
          status: 'completed',
        });
        setFiles([]);

        const refreshRes = await fetch(`${apiUrl}/api/projects`);
        const refreshData = await refreshRes.json();
        setProjects(refreshData);
      } else {
        res.status === 403
          ? setMessage('Error: Incorrect Admin Key')
          : setMessage('Error creating project');
      }
    } catch (error) {
      setMessage('Server error', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminKey,
        },
      });

      if (res.ok) {
        alert('Project Deleted!');
        setProjects(projects.filter((p) => p._id !== id));
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting project');
    }
  };

  const handleStatus = async (id, currentStatus) => {
    if (!window.confirm('Change status?')) return;
    const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminKey,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert('Status Changed!');
        setProjects((prevProjects) =>
          prevProjects.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  return (
    <>
      <nav className="nav">
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>

      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        {/* --- GLOBAL ADMIN KEY --- */}
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#fff',
          }}
        >
          <label
            style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}
          >
            🔒 Enter Admin Key to Enable Actions:
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Secret Key..."
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
          />
        </div>

        {/* ========================== */}
        {/* PROJECT SECTION      */}
        {/* ========================== */}
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: '40px' }}>
          🛠️ Project Management
        </h2>

        <div
          className="admin-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            marginBottom: '60px',
          }}
        >
          {/* LEFT: ADD PROJECT */}
          <div className="form-section">
            <h3>Add New Project</h3>
            <div className="form" style={{ marginTop: 0 }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  required
                />

                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleTextChange}
                  style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                >
                  <option value="completed">Completed Project</option>
                  <option value="in-progress">In Progress</option>
                </select>

                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleTextChange}
                  rows="4"
                  required
                />

                <label>Tags:</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleTextChange}
                  placeholder="React, MongoDB"
                />

                <label>Images:</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <label>Links:</label>
                <input
                  type="text"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleTextChange}
                  placeholder="GitHub URL"
                />
                <input
                  type="text"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleTextChange}
                  placeholder="Live Demo URL"
                />

                <button type="submit">Upload Project</button>
              </form>
              {message && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
            </div>
          </div>

          {/* RIGHT: MANAGE PROJECTS */}
          <div className="list-section">
            <h3>Manage Projects</h3>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <div className="spinner" style={{ marginBottom: '15px', fontSize: '2rem' }}>
                  ⏳
                </div>
                <h3>Waking up server...</h3>
                <p>This may take up to 50 seconds.</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="project-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {projects.map((project) => (
                  <div
                    key={project._id}
                    style={{
                      border: '1px solid #ccc',
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                      background: '#f9f9f9',
                      color: 'black',
                    }}
                  >
                    <h4 style={{ margin: '0 0 5px 0' }}>{project.title}</h4>
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => handleDelete(project._id)}
                        style={{
                          backgroundColor: '#ff4d4d',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleStatus(project._id, project.status)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '5px 10px',
                          border: 'none',
                          cursor: 'pointer',
                          margin: '0 5px',
                        }}
                      >
                        {project.status === 'completed' ? 'Mark In-Progress' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  border: '2px dashed #ccc',
                  color: '#888',
                }}
              >
                <h3>No Projects Found</h3>
              </div>
            )}
          </div>
        </div>

        {/* ========================== */}
        {/* BLOG SECTION       */}
        {/* ========================== */}
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
          ✍️ Blog Management
        </h2>

        <div
          className="admin-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}
        >
          <div className="form-section" style={{ maxWidth: '800px' }}>
            <h3>Write New Blog Post</h3>
            <div className="form" style={{ marginTop: 0 }}>
              <form onSubmit={handleBlogSubmit}>
                <label>Blog Title:</label>
                <input
                  type="text"
                  name="title"
                  value={blogFormData.title}
                  onChange={handleBlogTextChange}
                  required
                  placeholder="My First Post"
                />

                <label>Custom URL Slug (Optional):</label>
                <input
                  type="text"
                  name="slug"
                  value={blogFormData.slug}
                  onChange={handleBlogTextChange}
                  placeholder="my-first-post (leave blank to auto-generate)"
                />

                <label>Status:</label>
                <select
                  name="status"
                  value={blogFormData.status}
                  onChange={handleBlogTextChange}
                  style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                </select>

                <label>Summary (Preview Text):</label>
                <textarea
                  name="summary"
                  value={blogFormData.summary}
                  onChange={handleBlogTextChange}
                  rows="3"
                  required
                  placeholder="A short description for the home page..."
                />

                <label>Content (Markdown Supported):</label>
                <textarea
                  name="content"
                  value={blogFormData.content}
                  onChange={handleBlogTextChange}
                  rows="15"
                  required
                  placeholder="# My Heading&#10;&#10;Write your post content here..."
                  style={{ fontFamily: 'monospace' }}
                />

                <label>Tags:</label>
                <input
                  type="text"
                  name="tags"
                  value={blogFormData.tags}
                  onChange={handleBlogTextChange}
                  placeholder="Tutorial, JavaScript, Life"
                />

                <label>Cover Image URL (Optional):</label>
                <input
                  type="text"
                  name="coverImage"
                  value={blogFormData.coverImage}
                  onChange={handleBlogTextChange}
                  placeholder="https://..."
                />

                <button type="submit" style={{ backgroundColor: '#28a745' }}>
                  Publish Blog Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
