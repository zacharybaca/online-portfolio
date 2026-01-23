// src/pages/Admin.jsx
import React, { useState } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrls: '', // CHANGED: Renamed from imageUrl
    repoLink: '',
    demoLink: '',
    tags: '',
    secret: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectPayload = {
      ...formData,
      // 1. SPLIT tags into array
      tags: formData.tags.split(',').map(tag => tag.trim()),
      // 2. NEW: SPLIT image URLs into array
      imageUrls: formData.imageUrls.split(',').map(url => url.trim()) 
    };

    try {
      const response = await fetch('https://your-app-name.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': formData.secret 
        },
        body: JSON.stringify(projectPayload),
      });

      if (response.ok) {
        alert('Project Added Successfully!');
        // Reset form
        setFormData({ ...formData, title: '', description: '', imageUrls: '', tags: '' }); 
      } else {
        alert('Failed: Check your secret key');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Add New Project</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        
        <input type="text" name="title" placeholder="Project Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" rows="4" onChange={handleChange} required />
        
        {/* UPDATED INPUT */}
        <textarea 
          name="imageUrls" 
          placeholder="Image URLs (comma separated)" 
          rows="3"
          onChange={handleChange} 
        />
        
        <input type="text" name="repoLink" placeholder="GitHub Repo Link" onChange={handleChange} />
        <input type="text" name="demoLink" placeholder="Live Demo Link" onChange={handleChange} />
        <input type="text" name="tags" placeholder="Tags (comma separated e.g. React, Node)" onChange={handleChange} />
        
        <input type="password" name="secret" placeholder="Admin Secret Key" onChange={handleChange} required />

        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default Admin;
