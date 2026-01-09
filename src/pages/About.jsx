import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const About = () => {
  const form = useRef();
  const [status, setStatus] = useState(''); // To show success/error messages

  const skills = [
    "HTML", "CSS", "JavaScript", "Python", "Git and GitHub", "VS Code",
    "Accessibility", "OOP", "Fetch API", "Axios", "Node.js", "Express",
    "Pug", "ReactJS", "React Router", "React Context API", "Django",
    "DB2", "COBOL", "VSAM", "zOS", "KnexJS", "Angular", "Typescript",
    "EmailJS", "Bootstrap"
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    // REPLACE 'YOUR_PUBLIC_KEY' WITH YOUR ACTUAL KEY FROM EMAILJS DASHBOARD
    emailjs
      .sendForm(
        'service_9kukvd9',    // Your Service ID from app.js
        'template_epflkrw',   // Your Template ID from app.js
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
        },
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
            <p id="title-heading">Full Stack Web Developer</p>

            <div className="about-bio">
              <h2 id="about-heading">About Me</h2>
              <p>
                Hello! I'm Zach. I have a background in Software Engineering and I am currently working
                in customer service and billing at <strong>Surf Internet</strong> in La Porte, IN.
              </p>
              <p>
                I am passionate about full-stack development, specifically specializing in the <strong>MERN stack</strong>.
                I am actively looking to return to a full-time engineering role where I can utilize my fluency in JavaScript.
              </p>
              <p>
                When I'm not coding, I enjoy spending time with my family—my mom Robyn, my brother Carlos, and my boyfriend Ellis.
              </p>

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

            {/* Resume Link: In React, we link directly to the public folder file */}
            <a
              className="btn-link"
              href="/documents/software-engineer-resume.pdf"
              download="software-engineer-resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download Resume
            </a>
            <a className="btn-link" href="https://www.linkedin.com/in/zacharyjordanbaca/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn-link" href="https://github.com/zacharybaca" target="_blank" rel="noreferrer">GitHub</a>
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
