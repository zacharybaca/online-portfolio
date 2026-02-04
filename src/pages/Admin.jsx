import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  // 1. STATE
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('adminKey'));

  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]); // <--- NEW: Local state for blogs
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    title: '', description: '', tags: '', repoLink: '', demoLink: '', status: 'completed',
  });
  const [files, setFiles] = useState([]);

  const [blogFormData, setBlogFormData] = useState({
    title: '', slug: '', summary: '', content: '', tags: '', status: 'draft', coverImage: '',
  });

  // 2. FETCH DATA (Projects AND Blogs)
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const key = sessionStorage.getItem('adminKey'); // Get key for headers

      try {
        // A. Fetch Projects
        const projectRes = await fetch(`${apiUrl}/api/projects`);
        const projectData = await projectRes.json();
        setProjects(projectData);

        // B. Fetch Blogs (Hit the /all endpoint to see drafts)
        const blogRes = await fetch(`${apiUrl}/api/blog/all`, {
            headers: { 'x-admin-secret': key }
        });
        const blogData = await blogRes.json();

        // Safety check to ensure we map over an array
        if(Array.isArray(blogData)) {
            setBlogs(blogData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  // --- AUTH HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const inputKey = e.target.elements.keyInput.value;
    if (!inputKey.trim()) { alert('Please enter a key.'); return; }

    const submitBtn = e.target.querySelector('button');
    submitBtn.innerText = 'Verifying...';
    submitBtn.disabled = true;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': inputKey },
      });

      if (res.ok) {
        setAdminKey(inputKey);
        setIsLoggedIn(true);
        sessionStorage.setItem('adminKey', inputKey);
      } else {
        alert('❌ Access Denied: Incorrect Admin Key');
        submitBtn.innerText = 'Access Dashboard';
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error(error);
      alert('Server Error');
      submitBtn.innerText = 'Access Dashboard';
      submitBtn.disabled = false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminKey('');
    sessionStorage.removeItem('adminKey');
    setProjects([]);
    setBlogs([]);
  };

  // --- INPUT HANDLERS ---
  const handleTextChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles(e.target.files);
  const handleBlogTextChange = (e) => setBlogFormData({ ...blogFormData, [e.target.name]: e.target.value });

  // --- PROJECT ACTIONS ---
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setMessage('Uploading Project...');
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    for (let i = 0; i < files.length; i++) data.append('images', files[i]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: { 'x-admin-secret': adminKey },
        body: data,
      });

      if (res.ok) {
        setMessage('Project added!');
        setFormData({ title: '', description: '', tags: '', repoLink: '', demoLink: '', status: 'completed' });
        setFiles([]);
        // Refresh Projects
        const refreshRes = await fetch(`${apiUrl}/api/projects`);
        setProjects(await refreshRes.json());
      } else {
        setMessage('Error creating project');
      }
    } catch (error) { setMessage(`Server Error: ${error}`); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminKey },
      });
      if (res.ok) {
        alert('Project Deleted!');
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (error) { alert(`Error deleting project: ${error}`); }
  };

  const handleProjectStatus = async (id, currentStatus) => {
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
        setProjects((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));
      }
    } catch (error) { alert(`Error updating status: ${error}`); }
  };

  // --- BLOG ACTIONS (NEW & SEPARATE) ---
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
        setBlogFormData({ title: '', slug: '', summary: '', content: '', tags: '', status: 'draft', coverImage: '' });
        // Refresh Blogs
        const refreshRes = await fetch(`${apiUrl}/api/blog/all`, { headers: { 'x-admin-secret': adminKey } });
        setBlogs(await refreshRes.json());
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (error) { setMessage(`Server Error: ${error}`); }
  };

  // NEW: Specific handler for deleting BLOGS
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      // Note the URL is /api/blog/, NOT /api/projects/
      const res = await fetch(`${apiUrl}/api/blog/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminKey },
      });
      if (res.ok) {
        alert('Blog Deleted!');
        setBlogs(blogs.filter((b) => b._id !== id));
      }
    } catch (error) { alert(`Error deleting blog: ${error}`); }
  };

  // NEW: Specific handler for BLOG status
  const handleBlogStatus = async (id, currentStatus) => {
    if (!window.confirm(`Change status to ${currentStatus === 'draft' ? 'Published' : 'Draft'}?`)) return;
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBlogs((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
      }
    } catch (error) { alert(`Error updating blog status: ${error}`); }
  };

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f4f4f4' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <h2>🔒 Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input name="keyInput" type="password" placeholder="Enter Admin Key" style={{ width: '100%', padding: '10px', margin: '20px 0', fontSize: '1.1rem' }} autoFocus />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Access Dashboard</button>
          </form>
          <div style={{ marginTop: '20px' }}><Link to="/">← Back to Portfolio</Link></div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <>
      <nav className="nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/"><span>&larr;</span> Back</Link>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #333', padding: '5px 10px', cursor: 'pointer' }}>Logout 🔓</button>
      </nav>

      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        {/* === PROJECTS === */}
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: '40px' }}>🛠️ Project Management</h2>
        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>

          {/* Add Project Form */}
          <div className="form-section">
            <h3>Add New Project</h3>
            <div className="form" style={{ marginTop: 0 }}>
              <form onSubmit={handleSubmitProject} encType="multipart/form-data">
                <label>Title:</label><input type="text" name="title" value={formData.title} onChange={handleTextChange} required />
                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleTextChange} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}>
                  <option value="completed">Completed Project</option>
                  <option value="in-progress">In Progress</option>
                </select>
                <label>Description:</label><textarea name="description" value={formData.description} onChange={handleTextChange} rows="4" required />
                <label>Tags:</label><input type="text" name="tags" value={formData.tags} onChange={handleTextChange} />
                <label>Images:</label><input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} />
                <label>Links:</label>
                <input type="text" name="repoLink" value={formData.repoLink} onChange={handleTextChange} placeholder="GitHub URL" />
                <input type="text" name="demoLink" value={formData.demoLink} onChange={handleTextChange} placeholder="Live Demo URL" />
                <button type="submit">Upload Project</button>
              </form>
              {message && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
            </div>
          </div>

          {/* List Projects */}
          <div className="list-section">
            <h3>Manage Projects</h3>
            {isLoading ? <p>Loading...</p> : projects.length > 0 ? (
              <div className="project-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {projects.map((project) => (
                  <div key={project._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px', background: '#f9f9f9', color: 'black' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{project.title}</h4>
                    <div style={{ marginTop: '10px' }}>
                      <button onClick={() => handleDeleteProject(project._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Delete</button>
                      <button onClick={() => handleProjectStatus(project._id, project.status)} style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', margin: '0 5px' }}>
                        {project.status === 'completed' ? 'Mark In-Progress' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p>No Projects Found</p>}
          </div>
        </div>

        {/* === BLOGS === */}
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>✍️ Blog Management</h2>
        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>

          {/* Add Blog Form */}
          <div className="form-section" style={{ maxWidth: '800px' }}>
            <h3>Write New Blog Post</h3>
            <div className="form" style={{ marginTop: 0 }}>
              <form onSubmit={handleBlogSubmit}>
                <label>Blog Title:</label><input type="text" name="title" value={blogFormData.title} onChange={handleBlogTextChange} required />
                <label>Slug:</label><input type="text" name="slug" value={blogFormData.slug} onChange={handleBlogTextChange} placeholder="leave blank to auto-generate" />
                <label>Status:</label>
                <select name="status" value={blogFormData.status} onChange={handleBlogTextChange} style={{ padding: '10px', width: '100%', marginBottom: '10px' }}>
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                </select>
                <label>Summary:</label><textarea name="summary" value={blogFormData.summary} onChange={handleBlogTextChange} rows="3" required />
                <label>Content:</label><textarea name="content" value={blogFormData.content} onChange={handleBlogTextChange} rows="15" required style={{ fontFamily: 'monospace' }} />
                <label>Tags:</label><input type="text" name="tags" value={blogFormData.tags} onChange={handleBlogTextChange} />
                <label>Cover Image:</label><input type="text" name="coverImage" value={blogFormData.coverImage} onChange={handleBlogTextChange} />
                <button type="submit" style={{ backgroundColor: '#28a745' }}>Publish Blog Post</button>
              </form>
            </div>
          </div>
        </div>

        {/* List Blogs */}
        <div className="list-section" style={{marginTop: '40px'}}>
            <h3>Manage Blogs</h3>
            {/* We use 'blogs' state here, NOT 'blogPosts' prop */}
            {isLoading ? <p>Loading...</p> : blogs.length > 0 ? (
              <div className="project-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {blogs.map((blog) => (
                  <div key={blog._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px', background: '#f9f9f9', color: 'black' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{blog.title}
                        <span style={{fontSize: '0.8rem', marginLeft: '10px', color: blog.status === 'draft' ? 'red' : 'green'}}>
                            ({blog.status.toUpperCase()})
                        </span>
                    </h4>
                    <div style={{ marginTop: '10px' }}>
                      {/* FIX: Use specific Blog Handlers */}
                      <button onClick={() => handleDeleteBlog(blog._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>Delete</button>
                      <button onClick={() => handleBlogStatus(blog._id, blog.status)} style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', margin: '0 5px' }}>
                        {blog.status === 'draft' ? 'Publish' : 'Unpublish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p>No Blogs Found</p>}
          </div>

      </div>
    </>
  );
};

export default Admin;
