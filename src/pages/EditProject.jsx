import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for the Admin Key
  const [adminKey, setAdminKey] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    repoLink: '',
    demoLink: '',
    status: 'completed',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p._id === id);
        if (found) {
          setFormData({
            title: found.title || '',
            description: found.description || '',
            tags: found.tags ? found.tags.join(', ') : '',
            repoLink: found.repoLink || '',
            demoLink: found.demoLink || '',
            status: found.status || 'completed',
          });
          setExistingImages(found.imageUrls || []);
        } else {
          setMessage('Project not found');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Updating...');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);
    data.append('repoLink', formData.repoLink);
    data.append('demoLink', formData.demoLink);
    data.append('status', formData.status);

    // Append new files
    for (let i = 0; i < newFiles.length; i++) {
      data.append('images', newFiles[i]);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'x-admin-secret': adminKey,
        },
        body: data,
      });

      if (res.ok) {
        setMessage('Update Successful! Redirecting...');
        setTimeout(() => navigate(`/project/${id}`), 1500);
      } else {
        if (res.status === 403) setMessage('Error: Incorrect Admin Key');
        else setMessage('Error updating project');
      }
    } catch (error) {
      console.error(error);
      setMessage('Server Error');
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;

  return (
    <div className="admin-container">
      <h1>Edit Project</h1>
      <div className="form" style={{ marginTop: 0 }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label style={{ color: '#ff6b6b' }}>Admin Key (Required):</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter Admin Key..."
            required
            style={{ border: '1px solid #ff6b6b' }}
          />

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
            <option value="completed">Completed</option>
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
          <input type="text" name="tags" value={formData.tags} onChange={handleTextChange} />

          <label>Add MORE Images (Optional):</label>
          <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} />
          {existingImages.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>
              Currently has {existingImages.length} images.
            </p>
          )}

          <label>GitHub Repo:</label>
          <input
            type="text"
            name="repoLink"
            value={formData.repoLink}
            onChange={handleTextChange}
          />

          <label>Live Demo:</label>
          <input
            type="text"
            name="demoLink"
            value={formData.demoLink}
            onChange={handleTextChange}
          />

          <button type="submit">Save Changes</button>
        </form>
        {message && <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>{message}</p>}
      </div>
    </div>
  );
};

export default EditProject;
