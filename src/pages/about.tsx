// import React from "react"

// const TodoList = () => {
//     return (
//         <div>
//             d
//         </div>
//     )
// }

// export default TodoList

import React from "react"
import { PageProps, Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Nav from "../components/nav"
import AboutMe from '../components/AboutMe'

type Data = {
  site: {
    siteMetadata: {
      title: string
      about: string
      navLinks: [object]
    }
  }
  allMarkdownRemark: {
    edges: {
      node: {
        excerpt: string
        frontmatter: {
          title: string
          date: string
          description: string
        }
        fields: {
          slug: string
        }
      }
    }[]
  }
}

const about = ({ data, location }: PageProps<Data>) => {
  const siteTitle = data.site.siteMetadata.title
  const pageInfo = data.site.siteMetadata.navLinks

  return (
    <React.Fragment>
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      <Nav routers={pageInfo} currentPage='/about'/>
      <AboutMe/>
    </Layout>

    </React.Fragment>
  )
}

export default about

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        about
        navLinks{
            name
            link
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`