import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

const About = () => {
  const form = useRef();
  const [status, setStatus] = useState('');
  const [capVal, setCapVal] = useState(null);

  const skillGroups = [
    {
      category: 'Frontend',
      skills: ['ReactJS', 'JavaScript (ES6+)', 'TypeScript', 'HTML5 & CSS3', 'Bootstrap'],
    },
    { category: 'Backend', skills: ['Node.js', 'Express', 'Python', 'Django', 'REST APIs'] },
    { category: 'Database', skills: ['MongoDB', 'DB2', 'VSAM'] },
    { category: 'Enterprise/Legacy', skills: ['COBOL', 'z/OS', 'Software Engineering'] },
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    if (!capVal) {
      setStatus('⚠️ Please verify you are not a robot.');
      return;
    }
    setStatus('Sending...');
    emailjs
      .sendForm('service_9kukvd9', 'template_epflkrw', form.current, {
        publicKey: 'hrwzRdjpbVP720IcV',
      })
      .then(
        () => {
          setStatus('Email Successfully Sent!');
          e.target.reset();
          setCapVal(null);
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
            <h1>Zachary Baca</h1>
            <p id="title-heading">Software Engineer | Fullstack Web Developer</p>

            <div className="about-bio">
              <h2>Technical Narrative</h2>
              <p>
                I am a <strong>Software Engineer</strong> based in La Porte, IN, specializing in
                scalable
                <strong> MERN stack</strong> applications. My background bridges the gap between
                high-availability legacy systems (z/OS, COBOL) and modern web architecture.
              </p>
              <p>
                Currently working in Customer Service & Billing at <strong>Surf Internet</strong>, I
                apply technical empathy to understand user pain points while maintaining a
                disciplined engineering workflow. I focus on writing clean, testable JavaScript and
                building intuitive interfaces that solve real-world problems.
              </p>
              <p>
                I am actively pursuing a full-time engineering role to leverage my unique
                perspective on system reliability and modern development practices.
              </p>

              <div className="form">
                <form ref={form} id="contactForm" onSubmit={sendEmail}>
                  <label htmlFor="name">Name:</label>
                  <input id="name" type="text" name="name" required />
                  <label htmlFor="email">Email:</label>
                  <input id="email" type="email" name="email" required />
                  <label htmlFor="message">Message:</label>
                  <textarea id="message" name="message" cols="30" rows="5" required></textarea>
                  <div style={{ margin: '20px 0' }}>
                    <ReCAPTCHA
                      sitekey="6LeLwGAsAAAAAMuHpFmfjEz7wVf_UjPEFq_D9u86"
                      onChange={setCapVal}
                    />
                  </div>
                  <button type="submit" disabled={!capVal}>
                    Submit
                  </button>
                  {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
                </form>
              </div>
            </div>
          </div>

          <div className="skills-contact-box box">
            {skillGroups.map((group, i) => (
              <div key={i} className="skill-group">
                <h6>{group.category}</h6>
                <div className="tags" style={{ marginBottom: '20px' }}>
                  {group.skills.map((skill, j) => (
                    <span key={j} className="badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <a
              className="btn-link"
              href="/documents/software-engineer-resume.pdf"
              download
              target="_blank"
              rel="noreferrer"
              aria-label="Download Resume"
            >
              Download Resume
            </a>
            <a
              className="btn-link"
              href="https://www.linkedin.com/in/zacharyjordanbaca/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit LinkedIn Profile"
            >
              LinkedIn
            </a>
            <a
              className="btn-link"
              href="https://github.com/zacharybaca"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit GitHub Profile"
            >
              GitHub
            </a>

            <div className="certifications-sidebar">
              <h6>Certifications</h6>
              <div className="cert-item">
                <img
                  src="/documents/v-school-qr-code.png"
                  alt="V School QR"
                  className="cert-qr-sidebar"
                />
                <a
                  href="https://www.notion.so/V-School-Front-End-Web-Development-Certificate-9b1c8e5f0c7b4d2e9a1e5f8c3a2b6c"
                  target="_blank"
                  rel="noreferrer"
                >
                  V School Front-End Certification
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default About;
