import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  // 1. STATE
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('adminKey'));
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 2. FORM STATES
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    challenge: '',
    solution: '',
    tags: '',
    repoLink: '',
    demoLink: '',
    status: 'completed',
  });
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: '',
    status: 'draft',
    coverImage: '',
  });

  // Track if we are editing a blog (null = creating new)
  const [editingBlogId, setEditingBlogId] = useState(null);

  // 3. FETCH DATA
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchData = async () => {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const key = sessionStorage.getItem('adminKey');
      try {
        const projectRes = await fetch(`${apiUrl}/api/projects`);
        const projectData = await projectRes.json();
        setProjects(projectData);

        const blogRes = await fetch(`${apiUrl}/api/blog/all`, {
          headers: { 'x-admin-secret': key },
        });
        const blogData = await blogRes.json();
        if (Array.isArray(blogData)) setBlogs(blogData);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  // 4. AUTH HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    const inputKey = e.target.elements.keyInput.value;
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
        alert('Access Denied');
        submitBtn.innerText = 'Access Dashboard';
        submitBtn.disabled = false;
      }
    } catch (error) {
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

  // 5. INPUT HANDLERS
  const handleTextChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles(e.target.files);

  const handleBlogTextChange = (e) => {
    const { name, value } = e.target;
    // Auto-generate slug for new posts only
    if (name === 'title' && !blogFormData.slug && !editingBlogId) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setBlogFormData({ ...blogFormData, title: value, slug: autoSlug });
    } else {
      setBlogFormData({ ...blogFormData, [name]: value });
    }
  };

  // 6. PROJECT ACTIONS
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setMessage('Uploading...');
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
        setMessage('Project added');
        setFormData({
          title: '',
          description: '',
          challenge: '',
          solution: '',
          tags: '',
          repoLink: '',
          demoLink: '',
          status: 'completed',
        });
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        const refresh = await fetch(`${apiUrl}/api/projects`);
        setProjects(await refresh.json());
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Confirm deletion?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminKey },
      });
      if (res.ok) setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleProjectStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok)
        setProjects((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));
    } catch (error) {
      alert('Status update failed');
    }
  };

  // 7. BLOG ACTIONS
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL;
    const url = editingBlogId ? `${apiUrl}/api/blog/${editingBlogId}` : `${apiUrl}/api/blog`;
    const method = editingBlogId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
        body: JSON.stringify(blogFormData),
      });

      if (res.ok) {
        setMessage(editingBlogId ? 'Blog Updated!' : 'Blog Published!');
        setBlogFormData({
          title: '',
          slug: '',
          summary: '',
          content: '',
          tags: '',
          status: 'draft',
          coverImage: '',
        });
        setEditingBlogId(null);
        const refresh = await fetch(`${apiUrl}/api/blog/all`, {
          headers: { 'x-admin-secret': adminKey },
        });
        setBlogs(await refresh.json());
      }
    } catch (error) {
      console.error(error);
      setMessage('Error saving blog.');
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      summary: blog.summary || '',
      content: blog.content || '',
      tags: blog.tags ? blog.tags.join(', ') : '',
      status: blog.status || 'draft',
      coverImage: blog.coverImage || '',
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete blog?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminKey },
      });
      if (res.ok) setBlogs(blogs.filter((b) => b._id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  const handleBlogStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminKey },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok)
        setBlogs((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
    } catch (error) {
      alert('Update failed');
    }
  };

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
          <h2>Admin Authentication</h2>
          <form onSubmit={handleLogin}>
            <input
              name="keyInput"
              type="password"
              placeholder="Key"
              style={{ width: '100%', padding: '10px', margin: '20px 0' }}
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
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </form>
          <div style={{ marginTop: '20px' }}>
            <Link to="/">Return to Site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav
        className="nav"
        style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}
      >
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #333',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </nav>

      <div className="admin-container" style={{ padding: '40px' }}>
        <h1>Management Console</h1>
        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

        <div
          className="admin-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}
        >
          {/* BLOG FORM SECTION */}
          <div className="form-section">
            <h3>{editingBlogId ? '✍️ Edit Blog Post' : '✍️ Write New Blog Post'}</h3>
            <div className="form">
              <form onSubmit={handleBlogSubmit}>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={blogFormData.title}
                  onChange={handleBlogTextChange}
                  required
                />

                <label>Slug:</label>
                <input
                  type="text"
                  name="slug"
                  value={blogFormData.slug}
                  onChange={handleBlogTextChange}
                  required
                />

                <label>Status:</label>
                <select name="status" value={blogFormData.status} onChange={handleBlogTextChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>

                <label>Summary:</label>
                <textarea
                  name="summary"
                  value={blogFormData.summary}
                  onChange={handleBlogTextChange}
                  rows="2"
                  required
                />

                <label>Content:</label>
                <textarea
                  name="content"
                  value={blogFormData.content}
                  onChange={handleBlogTextChange}
                  rows="10"
                  required
                />

                <label>Tags:</label>
                <input
                  type="text"
                  name="tags"
                  value={blogFormData.tags}
                  onChange={handleBlogTextChange}
                  placeholder="comma, separated"
                />

                <label>Cover Image URL:</label>
                <input
                  type="text"
                  name="coverImage"
                  value={blogFormData.coverImage}
                  onChange={handleBlogTextChange}
                />

                <button
                  type="submit"
                  style={{ background: editingBlogId ? '#ffc107' : '#28a745', color: '#000' }}
                >
                  {editingBlogId ? 'Update Blog' : 'Publish Blog'}
                </button>
                {editingBlogId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlogId(null);
                      setBlogFormData({
                        title: '',
                        slug: '',
                        summary: '',
                        content: '',
                        tags: '',
                        status: 'draft',
                        coverImage: '',
                      });
                    }}
                    style={{ background: '#eee', color: '#000', marginTop: '10px' }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <hr style={{ margin: '40px 0' }} />

            {/* PROJECT FORM SECTION */}
            <h3>🛠️ Register Project</h3>
            <div className="form">
              <form onSubmit={handleSubmitProject}>
                <label>Project Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  required
                />

                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleTextChange}>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                </select>

                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleTextChange}
                  required
                />

                <label>Tags:</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleTextChange} />

                <label>Images:</label>
                <input 
                  type="file" 
                  name="images" 
                  multiple 
                  onChange={handleFileChange} 
                  ref={fileInputRef} 
                />

                <label>Technical Challenge:</label>
                <textarea name="challenge" value={formData.challenge} onChange={handleTextChange} />

                <label>Solution:</label>
                <textarea name="solution" value={formData.solution} onChange={handleTextChange} />

                <label>Repo Link:</label>
                <input
                  type="text"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleTextChange}
                />

                <label>Demo Link:</label>
                <input
                  type="text"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleTextChange}
                />

                <button type="submit">Deploy Project</button>
              </form>
            </div>
          </div>

          {/* LIST SECTION */}
          <div className="list-section">
            <h3>Manage Blogs</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '40px' }}>
              {blogs.map((b) => (
                <div
                  key={b._id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    background: '#fff',
                    color: '#000',
                  }}
                >
                  <strong>{b.title}</strong> ({b.status})
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={() => handleEditBlog(b)} style={{ marginRight: '5px' }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleBlogStatus(b._id, b.status)}
                      style={{ marginRight: '5px' }}
                    >
                      {b.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                    <button onClick={() => handleDeleteBlog(b._id)} style={{ color: 'red' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h3>Manage Projects</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {projects.map((p) => (
                <div
                  key={p._id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '10px',
                    background: '#fff',
                    color: '#000',
                  }}
                >
                  <strong>{p.title}</strong> ({p.status})
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => handleProjectStatus(p._id, p.status)}
                      style={{ marginRight: '5px' }}
                    >
                      Toggle Status
                    </button>
                    <button onClick={() => handleDeleteProject(p._id)} style={{ color: 'red' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
