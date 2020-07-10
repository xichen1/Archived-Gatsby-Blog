import React from "react"
import { Link } from "gatsby"

import { rhythm } from "../utils/typography"
import Weather from "./Weather"

const Layout = ({ location, title, children }) => {

  let header

  header = (
    <h2
      style={{
        fontFamily: `Montserrat, sans-serif`,
        marginTop: 0,
      }}
    >
      <Link
        style={{
          boxShadow: `none`,
          color: `inherit`,
        }}
        to={`/`}
      >
        {title}
      </Link>
    </h2>
  )
  // }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        backgroundColor: `#fff`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>
        <Weather />
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
