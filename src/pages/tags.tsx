import React from "react"
import { Helmet } from "react-helmet"
import PropTypes from "prop-types"
import { graphql, Link, navigate } from "gatsby"
import { DiscussionEmbed } from "disqus-react"
import Chip from '@material-ui/core/Chip';

import kebabCase from 'lodash/kebabCase'

import Bio from "../components/bio"
import Layout from "../components/layout"
import Nav from "../components/nav"

type Data = {
  site: {
    siteMetadata: {
      title: string
      tags: string
      navLinks: [object]
    }
  },
  allMarkdownRemark: {
    group: [object]
  }
}



const TagsPage = ({ data, location, data: {
  allMarkdownRemark: { group },
  site: {
    siteMetadata: { title, tags, navLinks },
  },
}, }) => {
  const siteTitle = title
  const setContent = tags
  const pageInfo = navLinks

  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_NAME,
    config: {identifier: "about"}
  }

  return (
    <React.Fragment>
    <Layout location={location} title={siteTitle}>
      <Bio />
      <Nav routers={pageInfo} currentPage='/tags'/>
      <h2>{setContent}</h2>
      {group.map(tag => (
          <span key={tag.fieldValue}>
            <Chip 
            label={`${tag.fieldValue} (${tag.totalCount})`}
            onClick={() => {navigate(`/tags/${kebabCase(tag.fieldValue)}/`)}}
            />
          </span>
        ))}
      <DiscussionEmbed {...disqusConfig} />
    </Layout>
    </React.Fragment>
  )
}

TagsPage.propTypes = {
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
}


export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        tags
        navLinks{
          name
          link
        }
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`