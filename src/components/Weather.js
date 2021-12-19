import React, { useState, useEffect } from 'react'
import axios from "axios"
import { graphql, useStaticQuery } from 'gatsby'
import Img from "gatsby-image"
import CircularProgress from '@material-ui/core/CircularProgress';
import "../../node_modules/qweather-icons/font/qweather-icons.css"

const Weather = () => {
    const [weather, setWeather] = useState({})

    const api_key = process.env.API_KEY

    const data = useStaticQuery(graphql`  
    query {
        allFile {
          edges {
            node {
              relativePath
              name
              publicURL
              extension
              childImageSharp {
                fixed(width: 50 height: 50) {
                    ...GatsbyImageSharpFixed
                  }
              }
            }
          }
        }
      }`)

    const getweather = () => {
        axios.get('https://devapi.heweather.net/v7/weather/now?key=' + api_key + '&location=8C9E4&lang=en')
            .then(response => {
                const apiResponse = response.data.now
                const newWeather = {
                    feel: apiResponse.feelsLike,
                    temp: apiResponse.temp,
                    text: apiResponse.text ? apiResponse.text : "cloudy",
                    icon: apiResponse.icon,
                    wind: apiResponse.windSpeed
                }
                setWeather(newWeather)

            })
    }

    useEffect(getweather, [])

    let values
    if ((Object.keys(weather)).length === 0) {
        values =
            (<div style={{ boxShadow: '0 -1px 0 0 #eee' }}>
                <h4 style={{ paddingTop: "1rem", marginBottom: 0 }}>Weather in Edmonton</h4>
                <CircularProgress color="secondary" />
            </div>)
    } else {
        const num = weather.icon
        const edges = data.allFile.edges
            .filter(edge => new RegExp("weather/" + num + ".svg")
                .test(edge.node.relativePath))
        let icon;
        if (!edges[0].node.childImageSharp) {
            icon = <img
                style={{
                    width: 50, color: 'transparent'
                }}
                src={edges[0].node.publicURL}
                alt="weather-icon" />
        } else {
            icon = <Img fixed={edges[0].node.childImageSharp.fixed} />
        }
        values = (
            <div style={{ boxShadow: '0 -1px 0 0 #eee' }}>
                <h4 style={{ paddingTop: "1rem", marginBottom: 0 }}>Weather in Edmonton</h4>
                <div>
                    {weather.temp}℃, feels like {weather.feel}℃,<br />
                    {weather.text}, with {weather.wind} km/h wind
                </div>
                <a
                    href='https://weather.gc.ca/city/pages/ab-50_metric_e.html'
                    target='_blank'
                    rel="noreferrer"
                    style={{
                        width: 50,
                        color: 'transparent'
                    }}
                >
                    {icon}
                </a>
            </div>
        )
    }

    return (
        <React.Fragment>{values}</React.Fragment>
    )

}

export default Weather