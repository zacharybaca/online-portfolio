import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha'; // 1. NEW IMPORT

const About = () => {
  const form = useRef();
  const [status, setStatus] = useState('');
  const [capVal, setCapVal] = useState(null); // 2. NEW STATE FOR CAPTCHA

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

    // 3. NEW CHECK: Stop if captcha is missing
    if (!capVal) {
      setStatus('⚠️ Please verify you are not a robot.');
      return;
    }

    setStatus('Sending...');

    // --- EMAILJS CONFIGURATION ---
    const SERVICE_ID = 'service_9kukvd9';
    const TEMPLATE_ID = 'template_epflkrw';
    const PUBLIC_KEY = 'hrwzRdjpbVP720IcV';

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setStatus('Email Successfully Sent!');
          e.target.reset();
          setCapVal(null); // 4. RESET CAPTCHA ON SUCCESS
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
                <form ref={form} id="contactForm" onSubmit={sendEmail}>
                  <label htmlFor="name">Enter Your Name:</label>
                  <input id="name" type="text" name="name" required />

                  <label htmlFor="email">Enter Your Email:</label>
                  <input id="email" type="email" name="email" required />

                  <label htmlFor="message">Enter A Message:</label>
                  <textarea id="message" name="message" cols="30" rows="5" required></textarea>

                  {/* 5. NEW WIDGET */}
                  <div style={{ margin: '20px 0' }}>
                    <ReCAPTCHA
                      sitekey="6LeLwGAsAAAAAMuHpFmfjEz7wVf_UjPEFq_D9u86"
                      onChange={(val) => setCapVal(val)}
                    />
                  </div>

                  {/* Disable button until verified (Optional, but good UX) */}
                  <button type="submit" disabled={!capVal}>
                    Submit
                  </button>

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
