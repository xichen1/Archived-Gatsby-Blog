import React from "react"
import PropTypes from "prop-types"
import { graphql, navigate } from "gatsby"
import { DiscussionEmbed } from "disqus-react"
import Chip from '@material-ui/core/Chip';
import { makeStyles, rgbToHex } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles'

import kebabCase from 'lodash/kebabCase'

import Bio from "../components/bio"
import Layout from "../components/layout"
import Nav from "../components/nav"
import theme from "../utils/MaterialTheme"


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(6),
    paddingBottom: theme.spacing(2),
    boxShadow: 'rgb(238, 238, 238) 0px 1px 0px 0px',
  },
  tag: {
    margin: theme.spacing(0.5),
    color: '#007acc',
    fontFamily: `Merriweather,Georgia,serif`,
  }
}));

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



  const classes = useStyles();

  return (
    <React.Fragment>
    <ThemeProvider theme={theme}>
    <Layout location={location} title={siteTitle}>
      <Bio />
      <Nav routers={pageInfo} currentPage='/tags'/>
      <h2>{setContent}</h2>
      <div className={classes.root}>
      {group.map(tag => (
          <span key={tag.fieldValue}>
            <Chip 
            className={classes.tag}
            label={`${tag.fieldValue} (${tag.totalCount})`}
            onClick={() => {navigate(`/tags/${kebabCase(tag.fieldValue)}/`)}}
            />
          </span>
        ))}
      </div>

      <DiscussionEmbed {...disqusConfig} />
    </Layout>
    </ThemeProvider>
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