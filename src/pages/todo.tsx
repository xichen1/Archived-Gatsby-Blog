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
import { DiscussionEmbed } from "disqus-react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Nav from "../components/nav"

type Data = {
  site: {
    siteMetadata: {
      title: string
      todo: string
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

const todo = ({ data, location }: PageProps<Data>) => {
  const siteTitle = data.site.siteMetadata.title
  const setContent = data.site.siteMetadata.todo
  const pageInfo = data.site.siteMetadata.navLinks

  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_NAME,
    config: {identifier: "about"}
  }

  return (
    <React.Fragment>
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      <Nav routers={pageInfo} currentPage='/todo'/>
      <h2>{setContent}</h2>
      <DiscussionEmbed {...disqusConfig} />
    </Layout>
    </React.Fragment>
  )
}

export default todo

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        todo
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