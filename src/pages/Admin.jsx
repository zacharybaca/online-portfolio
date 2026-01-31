import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [adminKey, setAdminKey] = useState('');

  // State for the Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    repoLink: '',
    demoLink: '',
    status: 'completed',
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  // State for the list of existing projects
  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true); // Start the "50s" timer (visually)
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/projects`);
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        // This runs AFTER the server wakes up (whether it took 1s or 50s)
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading...');
    const data = new FormData();

    // Append standard fields
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // Append files
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

        // Re-fetch projects to update the list immediately
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
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.'))
      return;

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
        // Filter the deleted project out of the state immediately (faster than re-fetching)
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

  return (
    <>
      <nav className="nav">
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            🔒 Enter Admin Key to Enable Actions:
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Secret Key..."
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div
          className="admin-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}
        >
          {/* LEFT COLUMN: CREATE FORM */}
          <div className="form-section">
            <h2>Add New Project</h2>
            <div className="form" style={{ marginTop: 0 }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Project Title:</label>
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

                <label>Tags (comma separated):</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleTextChange}
                  placeholder="React, MongoDB"
                />

                <label>Project Images:</label>
                {/* --- FIX 2: Added onChange={handleFileChange} here --- */}
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <label>GitHub Repo Link:</label>
                <input
                  type="text"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleTextChange}
                />

                <label>Live Demo Link:</label>
                <input
                  type="text"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleTextChange}
                />

                <button type="submit">Upload Project</button>
              </form>
              {message && <p style={{ marginTop: '10px' }}>{message}</p>}
            </div>
          </div>

          {/* RIGHT COLUMN: MANAGE PROJECTS */}
          <div className="list-section">
            <h2>Manage Projects</h2>

            {/* STATE 1: LOADING (Waiting for the 50s wakeup) */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <div className="spinner" style={{ marginBottom: '15px', fontSize: '2rem' }}>
                  ⏳
                </div>
                <h3>Waking up server...</h3>
                <p>This may take up to 50 seconds on the free tier.</p>
              </div>
            ) : projects.length > 0 ? (
              /* STATE 2: PROJECTS FOUND */
              <div className="project-list">
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
                      <Link
                        to={`/edit/${project._id}`}
                        className="btn-link"
                        style={{
                          display: 'inline-block',
                          background: '#444', // Dark gray to distinguish from main buttons
                          border: '1px solid #666',
                        }}
                      >
                        ⚙️ Edit Project
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* STATE 3: SERVER AWAKE, BUT NO PROJECTS (Your new message) */
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  color: '#888',
                }}
              >
                <h3>No Projects Found</h3>
                <p>There are currently no projects to show.</p>
                <p style={{ fontSize: '0.8rem' }}>
                  Use the form on the left to add your first one!
                </p>
              </div>
            )}
          </div>
        </div>
        <nav className="nav">
          <Link to="/">
            <span>&larr;</span> Back
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Admin;
