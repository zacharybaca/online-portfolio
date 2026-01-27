import React, { useState } from 'react';

const Admin = () => {
  // We use a single object for text inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    repoLink: '',
    demoLink: '',
    status: 'completed', // Default status
  });

  // We use a separate state for files
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files); // Stores the FileList object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading...');

    // 1. Create FormData object
    const data = new FormData();

    // 2. Append text fields
    // CRITICAL: Append 'title' FIRST so Multer can name the folder correctly
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);
    data.append('repoLink', formData.repoLink);
    data.append('demoLink', formData.demoLink);
    data.append('status', formData.status);

    // 3. Append files
    // The key 'images' must match upload.array('images') in backend
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        body: data, // No JSON.stringify, no Content-Type header (browser sets it)
      });

      if (res.ok) {
        setMessage('Project added successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          tags: '',
          repoLink: '',
          demoLink: '',
          status: 'completed',
        });
        setFiles([]);
      } else {
        setMessage('Error creating project');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error');
    }
  };

  return (
    <div className="admin-container">
      <h1>Add New Project</h1>
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
            style={{ padding: '10px', borderRadius: '5px', width: '100%' }}
          >
            <option value="completed">Completed Project</option>
            <option value="in-progress">In Progress (Currently Working On)</option>
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
            placeholder="React, MongoDB, API"
            value={formData.tags}
            onChange={handleTextChange}
          />

          <label>Project Images (Select multiple):</label>
          <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} />

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
        {message && <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>{message}</p>}
      </div>
    </div>
  );
};

export default Admin;
