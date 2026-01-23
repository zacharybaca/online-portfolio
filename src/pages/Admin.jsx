import React, { useState } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrls: '',
    repoLink: '',
    demoLink: '',
    tags: '',
    secret: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data
    const projectPayload = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      imageUrls: formData.imageUrls.split(',').map((url) => url.trim()),
    };

    try {
      // AUTOMATIC URL SWITCHING
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': formData.secret,
        },
        body: JSON.stringify(projectPayload),
      });

      if (response.ok) {
        alert('Project Added Successfully!');
        setFormData({
          ...formData,
          title: '',
          description: '',
          imageUrls: '',
          tags: '',
        });
      } else {
        alert('Failed: Check your secret key');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: Could not connect to server');
    }
  };

  return (
    <div className="admin-container">
      <h1>Add New Project</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          onChange={handleChange}
          value={formData.title}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          onChange={handleChange}
          value={formData.description}
          required
        />
        <textarea
          name="imageUrls"
          placeholder="Image URLs (comma separated)"
          rows="3"
          onChange={handleChange}
          value={formData.imageUrls}
        />
        <input
          type="text"
          name="repoLink"
          placeholder="GitHub Repo Link"
          onChange={handleChange}
          value={formData.repoLink}
        />
        <input
          type="text"
          name="demoLink"
          placeholder="Live Demo Link"
          onChange={handleChange}
          value={formData.demoLink}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated e.g. React, Node)"
          onChange={handleChange}
          value={formData.tags}
        />

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
