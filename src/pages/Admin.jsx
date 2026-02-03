import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'; // Optional, but looks nice for the login box
import ListGroup from 'react-bootstrap/ListGroup';

const Admin = () => {
  // 1. STATE: We check sessionStorage immediately to see if we are already logged in
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('adminKey'));

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

  // --- BLOG STATE ---
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

  // 2. FETCH DATA (Only runs if logged in!)
  useEffect(() => {
    if (!isLoggedIn) return; // Don't fetch if not logged in

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
  }, [isLoggedIn]); // Re-run when user logs in

  // --- LOGIN HANDLER (NEW) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const inputKey = e.target.elements.keyInput.value;

    if (!inputKey.trim()) {
      alert('Please enter a key.');
      return;
    }

    // 1. SET LOADING STATE (Optional, adds polish)
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Verifying...';
    submitBtn.disabled = true;

    try {
      // 2. ASK SERVER: "Is this key valid?"
      // We use '/api/blog/all' because it requires the admin key
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': inputKey, // Send the key to test it
        },
      });

      if (res.ok) {
        // 3. SUCCESS: Key is correct!
        setAdminKey(inputKey);
        setIsLoggedIn(true);
        sessionStorage.setItem('adminKey', inputKey);
      } else {
        // 4. FAILURE: Server rejected it
        alert('❌ Access Denied: Incorrect Admin Key');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error(error);
      alert('Server Error: Could not verify key.');
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  };

  // --- LOGOUT HANDLER (NEW) ---
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminKey('');
    sessionStorage.removeItem('adminKey');
    setProjects([]); // Clear sensitive data from screen
  };

  // --- PROJECT HANDLERS ---
  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // --- BLOG HANDLERS ---
  const handleBlogTextChange = (e) => {
    setBlogFormData({ ...blogFormData, [e.target.name]: e.target.value });
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setMessage('Posting Blog...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
        body: JSON.stringify(blogFormData),
      });

      if (res.ok) {
        setMessage('Blog Post Created!');
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

        // Refresh List
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
    if (!window.confirm('Delete this project?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
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
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
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

  // =========================================================
  // 3. THE "GATEKEEPER" RENDER
  // If not logged in, show the Login "Dialog" instead of the Dashboard
  // =========================================================
  if (!isLoggedIn) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f4f4f4',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <h2>🔒 Admin Access</h2>
          <p>Please enter your secret key to continue.</p>
          <form onSubmit={handleLogin}>
            <input
              name="keyInput"
              type="password"
              placeholder="Enter Admin Key"
              style={{ width: '100%', padding: '10px', margin: '20px 0', fontSize: '1.1rem' }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Access Dashboard
            </button>
          </form>
          <div style={{ marginTop: '20px' }}>
            <Link to="/">← Back to Portfolio</Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // 4. THE ACTUAL DASHBOARD (Only renders if logged in)
  // =========================================================
  return (
    <>
      <nav
        className="nav"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Logout 🔓
        </button>
      </nav>

      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        {/* Removed the Key Input from here - it's handled by the login screen now! */}

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
