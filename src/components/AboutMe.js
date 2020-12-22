import React from 'react'
import { makeStyles } from '@material-ui/core'
import { rhythm } from "../utils/typography"
// import { useStaticQuery, graphql } from 'gatsby'
// import Image from "gatsby-image"

export default function AboutMe() {
  const useStyles = makeStyles(theme => ({
    title: {
      marginTop: rhythm(1),
      marginBottom: 0,
    },
    picOut: {
      marginTop: rhythm(1),
      textAlign: 'center'
    },
    pic: {
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }))

  //   const pic = useStaticQuery(graphql`
  //   query {
  //     avatar: file(absolutePath: { regex: "/me.jpg/" }) {
  //       childImageSharp {
  //         fluid {
  //           ...GatsbyImageSharpFluid_noBase64
  //         }
  //       }
  //     }
  //   }
  // `)

  const classes = useStyles()
  return (
    <React.Fragment>
      <h3>Stupid me</h3>
      {/* <Typography variant='h3' class={classes.title}>Stupid Me</Typography> */}
      <div className={classes.picOut}>
        {/* <Image fluid={pic.avatar.childImageSharp.fluid} className={classes.pic} /> */}
      </div>

    </React.Fragment>
  )
}