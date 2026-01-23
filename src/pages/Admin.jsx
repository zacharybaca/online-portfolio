// src/pages/Admin.jsx
import React, { useState } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    repoLink: '',
    demoLink: '',
    tags: '', // We'll split this string into an array later
    secret: '', // To prove it's you
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the data for the API
    const projectPayload = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()), // "React, Node" -> ["React", "Node"]
    };

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': formData.secret, // The security key
        },
        body: JSON.stringify(projectPayload),
      });

      if (response.ok) {
        alert('Project Added Successfully!');
        setFormData({ ...formData, title: '', description: '' }); // Reset form
      } else {
        alert('Failed: Check your secret key');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className="admin-container"
      style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}
    >
      <h1>Add New Project</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          onChange={handleChange}
          required
        />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="imageUrl" placeholder="Image URL" onChange={handleChange} />
        <input type="text" name="repoLink" placeholder="GitHub Repo Link" onChange={handleChange} />
        <input type="text" name="demoLink" placeholder="Live Demo Link" onChange={handleChange} />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
        />

        {/* Simple Security Field */}
        <input
          type="password"
          name="secret"
          placeholder="Admin Secret Key"
          onChange={handleChange}
          required
        />

        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default Admin;
