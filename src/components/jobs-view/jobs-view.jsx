// Jobs.jsx
import React from "react";
import { Briefcase, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import "./jobs-view.scss";

const Jobs = () => {
  return (
    <div className="careers__container">
      <div className="careers__header">
        <Briefcase className="careers__header-icon" />
        <h1 className="careers__header-title">Looking for a Job?</h1>
      </div>

      <div className="careers__content">
        <div className="careers__hero">
          <h2 className="careers__hero-title">
            Me too! Let's connect and help each other out! 🚀
          </h2>
          <p className="careers__hero-text">
            I'm a passionate developer who loves creating awesome experiences
            like this one. If you know of any opportunities or just want to
            connect, reach out through any of my social links below!
          </p>
        </div>

        <div className="careers__skills">
          <h3 className="careers__skills-title">What I Love Working With:</h3>
          <div className="careers__skills-grid">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "Express",
              "JavaScript",
              "TypeScript",
              "SCSS",
              "REST APIs",
            ].map((skill) => (
              <span key={skill} className="careers__skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="careers__connect">
          <h3 className="careers__connect-title">Let's Connect!</h3>
          <div className="careers__social-grid">
            <a
              href="https://github.com/jf8989?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="careers__social-link"
            >
              <Github className="careers__social-icon" />
              <span>Check Out My Repos</span>
              <ExternalLink className="careers__social-external" />
            </a>

            <a
              href="https://www.linkedin.com/in/jfmarcenaroa/"
              target="_blank"
              rel="noopener noreferrer"
              className="careers__social-link"
            >
              <Linkedin className="careers__social-icon" />
              <span>Connect on LinkedIn</span>
              <ExternalLink className="careers__social-external" />
            </a>

            <a
              href="mailto:juanfrajs.contacto@gmail.com"
              className="careers__social-link"
            >
              <Mail className="careers__social-icon" />
              <span>Send Me an Email</span>
              <ExternalLink className="careers__social-external" />
            </a>
          </div>
        </div>

        <div className="careers__cta">
          <p className="careers__cta-text">
            PS: This website was built with React, Node.js, MongoDB, and
            Bootstrap. Pretty cool, right? Feel free to ask me about the
            technical details! 😎
          </p>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
