import React, { useState } from 'react';

const Admin = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
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

    const projectPayload = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
    };

    try {
      // NOTE: Update this URL if you deploy!
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': formData.secret,
        },
        body: JSON.stringify(projectPayload),
      });

      if (response.ok) {
        alert('Project Added Successfully!');
        setFormData({ ...formData, title: '', description: '' });
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
      {/* Changed style={{...}} to className="admin-form" */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          onChange={handleChange}
          required
        />
        <input type="text" name="imageUrl" placeholder="Image URL" onChange={handleChange} />
        <input type="text" name="repoLink" placeholder="GitHub Repo Link" onChange={handleChange} />
        <input type="text" name="demoLink" placeholder="Live Demo Link" onChange={handleChange} />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated e.g. React, Node)"
          onChange={handleChange}
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
