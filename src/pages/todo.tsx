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

type Data = {
  site: {
    siteMetadata: {
      title: string
      todo: string
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


  return (
    <React.Fragment>
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      <Nav/>
      {setContent}
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