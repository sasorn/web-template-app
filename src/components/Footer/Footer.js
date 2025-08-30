import React from "react";
import classNames from "classnames";

import "./Footer.less";

import Logo from "./assets/logo.svg";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const footerData = [
  {
    title: "For Candidates",
    links: [
      { name: "Job Search", link: "/job-search" },
      { name: "Resume Scanner", link: "/resume-scanner" },
      { name: "Profile", link: "/profile" }
    ]
  },
  {
    title: "For Employers",
    links: [
      { name: "Post a Job", link: "/post-job" },
      { name: "Applicant Tracking", link: "/applicant-tracking" },
      { name: "Schedule a Demo", link: "/schedule-demo" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", link: "/about" },
      { name: "Careers", link: "/careers" },
      { name: "Blog", link: "/blog" },
      { name: "Contact Us", link: "/contact" }
    ]
  },
  {
    title: "Legal & Support",
    links: [
      { name: "Help Center / FAQ", link: "/help" },
      { name: "Terms of Service", link: "/terms" },
      { name: "Privacy Policy", link: "/privacy" }
    ]
  },
  {
    title: "Social",
    social: [
      { icon: <FaLinkedin />, link: "https://linkedin.com" },
      { icon: <FaTwitter />, link: "https://twitter.com" },
      { icon: <FaGithub />, link: "https://github.com" }
    ]
  }
];

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer-columns">
        {footerData.map((col, idx) => (
          <div
            key={idx}
            className={classNames("Footer-column", { social: col.social })}
          >
            <h4>{col.title}</h4>

            {/* Sub-columns for Product */}
            {col.columns
              ? col.columns.map((sub, subIdx) => (
                  <div key={subIdx} className="Footer-subcolumn">
                    <h5>{sub.subtitle}</h5>
                    <ul>
                      {sub.links.map((link, i) => (
                        <li key={i}>
                          <a href={link.link}>{link.name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : null}

            {/* Single column links */}
            {col.links ? (
              <ul>
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.link}>{link.name}</a>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Social links */}
            {col.social ? (
              <>
                <div className="Footer-social">
                  {col.social.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>

                <div className="Footer-logo">
                  <img src={Logo} alt="EMBOL Logo" />
                  <p className="Footer-copy">
                    © {new Date().getFullYear()} {col.copyright}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
