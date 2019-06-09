/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";

import img from "../../content/assets/profile-pic.jpg";

import { rhythm } from "../utils/typography";

function Bio() {
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <img
        alt="batman"
        src={img}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          width: rhythm(2),
          height: rhythm(2),
          borderRadius: "50%",
        }}
      />
      <p style={{ maxWidth: 240 }}>
        oh oh ~
        <br />
        sometime i get a good feeling~
      </p>
    </div>
  );
}
export default Bio;
