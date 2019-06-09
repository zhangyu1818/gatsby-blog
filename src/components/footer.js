import React from "react";

import { rhythm } from "../utils/typography";

class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        <a
          href="https://github.com/zhangyu1818"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          github
        </a>
      </footer>
    );
  }
}

export default Footer;
