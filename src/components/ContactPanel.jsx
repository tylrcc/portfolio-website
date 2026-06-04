import React from 'react';
import {
  EMAIL,
  GITHUB_URL,
  LEETCODE_URL,
  LINKEDIN_URL,
  MAILTO,
  TWITTER_URL,
} from '../socialLinks';

const ContactPanel = () => (
  <div className="mac-content-inner contact-panel">
    <p className="contact-panel-lead">Reach me on the web:</p>
    <table className="contact-panel-table">
      <tbody>
        <tr>
          <td className="contact-panel-label">Email</td>
          <td>
            <a href={MAILTO}>{EMAIL}</a>
          </td>
        </tr>
        <tr>
          <td className="contact-panel-label">GitHub</td>
          <td>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              github.com/tylrcc
            </a>
          </td>
        </tr>
        <tr>
          <td className="contact-panel-label">LinkedIn</td>
          <td>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/tylerriccardi
            </a>
          </td>
        </tr>
        <tr>
          <td className="contact-panel-label">X</td>
          <td>
            <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
              x.com/tylrcc
            </a>
          </td>
        </tr>
        <tr>
          <td className="contact-panel-label">LeetCode</td>
          <td>
            <a href={LEETCODE_URL} target="_blank" rel="noopener noreferrer">
              leetcode.com/u/tylrcc
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <p className="contact-panel-note">
      Or use the <strong>Connect</strong> strip on the desktop — hover WeChat for my QR code.
    </p>
  </div>
);

export default ContactPanel;
