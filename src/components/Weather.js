import React, { useState, useEffect } from 'react'
import axios from "axios"
import { graphql, useStaticQuery } from 'gatsby'
import Image from "gatsby-image"


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
                    describe: apiResponse.text,
                    icon: apiResponse.icon,
                    wind: apiResponse.windSpeed
                }
                setWeather(newWeather)

            })
    }

    useEffect(getweather, [])

    let values
    if ((Object.keys(weather)).length === 0) {
        values = <></>
    } else {
        const num = weather.icon
        const edges = data.allFile.edges
            .filter(edge => new RegExp("weather/" + num + ".png")
                .test(edge.node.relativePath))
        const icon = (edges[0].node.childImageSharp.fixed)
        values = (
            <div>
                <h4 style={{ marginBottom: 0 }}>Weather in Edmonton</h4>
                <div>
                    {weather.temp}℃, feels like {weather.feel}℃,<br />
                    {weather.describe}, with {weather.wind} km/h wind
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
                    <Image fixed={icon} />
                </a>


            </div>
        )
    }

    return (
        <>{values}</>
    )

}

export default Weather 