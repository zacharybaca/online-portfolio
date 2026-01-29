import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const [status, setStatus] = useState('');

  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const skills = [
    'JavaScript (ES6+)',
    'ReactJS',
    'Node.js',
    'Express',
    'MongoDB',
    'HTML5 & CSS3',
    'Git & GitHub',
    'Python',
    'Django',
    'Fetch API & Axios',
    'React Router',
    'React Context API',
    'Typescript',
    'Accessibility',
    'VS Code',
    'DB2',
    'COBOL',
    'VSAM',
    'zOS',
    'Bootstrap',
    'Nodemailer', // Updated from EmailJS
  ];

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to your Backend API
  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Email Successfully Sent!');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to send message. Server error.');
    }
  };

  return (
    <>
      <nav className="nav">
        <Link to="/">
          <span>&larr;</span> Back
        </Link>
      </nav>

      <article className="portfolio-about">
        <div className="inner-wrapper flex-row-wrap two-col">
          <div className="about-intro-box box">
            <h1 id="about-heading">Zachary Baca</h1>
            <p id="title-heading">Software Engineer & Web Developer</p>

            <div className="about-bio">
              <h2 id="about-heading">About Me</h2>

              <p>
                Hello! I'm Zach. I am a <strong>Software Engineer</strong> based in La Porte, IN,
                specializing in the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js).
              </p>
              <p>
                My journey in tech is unique. While I currently work in Customer Service & Billing
                at <strong>Surf Internet</strong>, my professional foundation is deeply rooted in
                engineering. This experience has given me a dual perspective: I possess the
                technical fluency to build scalable applications and the communication skills to
                deeply understand the users who rely on them.
              </p>
              <p>
                I am now actively seeking to return to a full-time engineering role where I can
                apply my expertise in JavaScript and my passion for clean, testable code.
              </p>
              <p>
                When I'm not coding, I enjoy spending time with my family—my mom Robyn, my brother
                Carlos, and my boyfriend Ellis.
              </p>

              <div className="form">
                <form id="contactForm" onSubmit={sendEmail}>
                  <label htmlFor="name">Enter Your Name:</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="email">Enter Your Email:</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="message">Enter A Message:</label>
                  <textarea
                    id="message"
                    name="message"
                    cols="30"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>

                  <button type="submit">Submit</button>

                  {/* Status Message */}
                  {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
                </form>
              </div>
            </div>
          </div>

          <div className="skills-contact-box box">
            <h6>Skills</h6>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

            {/* Resume Link */}
            <a
              className="btn-link"
              href="/documents/software-engineer-resume.pdf"
              download="software-engineer-resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download Resume
            </a>
            <a
              className="btn-link"
              href="https://www.linkedin.com/in/zacharyjordanbaca/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="btn-link"
              href="https://github.com/zacharybaca"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <nav className="nav">
          <Link to="/">
            <span>&larr;</span> Back
          </Link>
        </nav>
      </article>
    </>
  );
};

export default About;
