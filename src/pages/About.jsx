import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

const TESTIMONIALS = [
  {
    quote:
      "Zach's ability to bridge legacy systems with modern web architecture is genuinely rare. He approaches every problem with rigorous engineering discipline and delivers clean, maintainable code.",
    name: 'V School Instructor',
    title: 'Front-End Curriculum Lead',
  },
  {
    quote:
      'What sets Zach apart is his technical empathy — he understands both the system and the user. He built features that our team had deprioritized for months and shipped them without ceremony.',
    name: 'Colleague',
    title: 'Software Team',
  },
];

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

              {/* === LEGACY / COBOL CALLOUT === */}
              <div className="legacy-callout" role="note" aria-label="Legacy systems expertise highlight">
                <div className="legacy-callout-icon" aria-hidden="true">🖥️</div>
                <div>
                <h4 className="legacy-callout-title">Enterprise & Legacy Systems Background</h4>
                  <p className="legacy-callout-body">
                    I have hands-on experience with <strong>COBOL</strong>, <strong>z/OS</strong>, <strong>DB2</strong>, and <strong>VSAM</strong> — skills that are increasingly rare and high-value as enterprises modernize mainframe workloads. This background gives me a deep appreciation for system reliability, data integrity, and performance at scale that most web developers lack.
                  </p>
                </div>
              </div>

              {/* === TESTIMONIALS === */}
              <section className="testimonials-section" aria-label="Testimonials">
                <h3>What Others Say</h3>
                <div className="testimonials-grid">
                  {TESTIMONIALS.map((t, i) => (
                    <blockquote key={i} className="testimonial-card">
                      <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                      <footer className="testimonial-footer">
                        <strong className="testimonial-name">{t.name}</strong>
                        <span className="testimonial-title">{t.title}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </section>

              <div className="form">
                <form ref={form} id="contactForm" onSubmit={sendEmail} aria-label="Contact form">
                  <label htmlFor="name">Name:</label>
                  <input id="name" type="text" name="name" required autoComplete="name" />
                  <label htmlFor="email">Email:</label>
                  <input id="email" type="email" name="email" required autoComplete="email" />
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
                  {status && <p role="status" style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
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
              aria-label="Download Zachary Baca's resume (PDF)"
            >
              Download Resume
            </a>
            <a
              className="btn-link"
              href="https://www.linkedin.com/in/zacharyjordanbaca/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Zachary Baca's LinkedIn profile (opens in new tab)"
            >
              LinkedIn
            </a>
            <a
              className="btn-link"
              href="https://github.com/zacharybaca"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Zachary Baca's GitHub profile (opens in new tab)"
            >
              GitHub
            </a>

            <div className="certifications-sidebar">
              <h6>Certifications</h6>
              <div className="cert-item">
                <img
                  src="/documents/v-school-qr-code.png"
                  alt="QR code linking to V School Front-End Web Development Certificate"
                  className="cert-qr-sidebar"
                  loading="lazy"
                />
                <a
                  href="https://www.notion.so/V-School-Front-End-Web-Development-Certificate-9b1c8e5f0c7b4d2e9a1e5f8c3a2b6c"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View V School Front-End Certification (opens in new tab)"
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
