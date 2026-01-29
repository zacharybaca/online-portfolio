import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const About = () => {
  const form = useRef();
  const [status, setStatus] = useState('');

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
    'EmailJS',
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    // --- EMAILJS CONFIGURATION ---
    // Make sure these match your dashboard at https://dashboard.emailjs.com/
    const SERVICE_ID = 'service_9kukvd9'; // From your earlier code
    const TEMPLATE_ID = 'template_epflkrw'; // From your earlier code
    const PUBLIC_KEY = 'hrwzRdjpbVP720IcV'; // ⚠️ REPLACE THIS with your actual Public Key

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setStatus('Email Successfully Sent!');
          e.target.reset();
        },
        (error) => {
          console.error('EmailJS Error:', error);
          setStatus(`Failed to send: ${error.text}`);
        }
      );
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
            <p id="title-heading">Software Engineer & Fullstack Web Developer</p>

            <div className="about-bio">
              <h2 id="about-heading">About Me</h2>
              <p>
                Hello! I'm Zach. I am a <strong>Software Engineer</strong> based in La Porte, IN,
                specializing in the <strong>MERN stack</strong>.
              </p>
              <p>
                My journey in tech is unique. While I currently work in Customer Service & Billing
                at <strong>Surf Internet</strong>, my professional foundation is rooted in
                engineering. I possess the technical fluency to build scalable applications and the
                communication skills to understand the users who rely on them.
              </p>
              <p>
                I am actively seeking to return to a full-time engineering role where I can apply my
                expertise in JavaScript and my passion for clean, testable code.
              </p>
              <p>
                When I'm not coding, I enjoy spending time with my family, and spending time in
                nature whenever I can.
              </p>

              <div className="form">
                {/* Ref attached here so EmailJS can read the inputs */}
                <form ref={form} id="contactForm" onSubmit={sendEmail}>
                  <label htmlFor="name">Enter Your Name:</label>
                  <input id="name" type="text" name="name" required />

                  <label htmlFor="email">Enter Your Email:</label>
                  <input id="email" type="email" name="email" required />

                  <label htmlFor="message">Enter A Message:</label>
                  <textarea id="message" name="message" cols="30" rows="5" required></textarea>

                  <button type="submit">Submit</button>

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
            {/* Links Section */}
            <a
              className="btn-link"
              href="/documents/software-engineer-resume.pdf"
              download
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
