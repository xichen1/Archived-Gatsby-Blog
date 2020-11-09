import React from "react"
import PropTypes from "prop-types"
// Components
import { Link, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"
import Bio from "../components/bio"


const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`

  const postList =
    edges.map(({ node }) => {
      const { slug } = node.fields
      const { title, description, date } = node.frontmatter
      return (
        <article key={slug}>
          <header>
            <h3
              style={{
                marginBottom: rhythm(1 / 4),
              }}
            >
              <Link style={{ boxShadow: `none` }} to={slug}>
                {title}
              </Link>
            </h3>
            <small>{date}</small>
          </header>
          <section>
            <p
              dangerouslySetInnerHTML={{
                __html: description || node.excerpt,
              }}
            />
          </section>
        </article>
      )
    })

  return (
    <Layout title={tagHeader}>
      <Bio />
      {postList}
      <Link to="/tags">Return to all tags</Link>
    </Layout>
  )


}
Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              date: PropTypes.string.isRequired
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}
export default Tags
export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            description
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`