import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const About = () => {
  const form = useRef();
  const [status, setStatus] = useState(''); // To show success/error messages

  // REORDERED: MERN/Modern stack first, Legacy/Mainframe second.
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
    'DB2', // Legacy skills moved to the end
    'COBOL',
    'VSAM',
    'zOS',
    'Bootstrap',
    'EmailJS',
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    // REPLACE 'YOUR_PUBLIC_KEY' WITH YOUR ACTUAL KEY FROM EMAILJS DASHBOARD
    emailjs
      .sendForm(
        'service_9kukvd9', // Your Service ID from app.js
        'template_epflkrw', // Your Template ID from app.js
        form.current,
        { publicKey: 'YOUR_PUBLIC_KEY' }
      )
      .then(
        () => {
          setStatus('Email Successfully Sent!');
          e.target.reset(); // Clear the form
        },
        (error) => {
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
            <p id="title-heading">Software Engineer & Web Developer</p>

            <div className="about-bio">
              <h2 id="about-heading">About Me</h2>
              {/* UPDATED BIO SECTION START */}
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
              {/* UPDATED BIO SECTION END */}

              <div className="form">
                {/* We attach the ref={form} and onSubmit={sendEmail} here */}
                <form ref={form} id="contactForm" onSubmit={sendEmail}>
                  <label htmlFor="name">Enter Your Name:</label>
                  <input id="name" type="text" name="name" required />

                  <label htmlFor="email">Enter Your Email:</label>
                  <input id="email" type="email" name="email" required />

                  <label htmlFor="message">Enter A Message:</label>
                  <textarea id="message" name="message" cols="30" rows="5" required></textarea>

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
