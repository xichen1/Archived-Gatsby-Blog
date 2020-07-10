import React, { useState, useEffect } from 'react'
import axios from "axios"

const Weather = () => {
    const [weather, setWeather] = useState({})
    const api_key = process.env.API_KEY

    const params = {
          access_key: api_key,
          query: 'Edmonton'
      }
  
    const getweather = () => {
        axios.get('http://api.weatherstack.com/current', {params})
        .then(response => {
            const apiResponse = response.data.current
            console.log(apiResponse)
            const newWeather = {
                degree: apiResponse.temperature,
                describe: apiResponse.weather_descriptions,
                icon: apiResponse.weather_icons
            }
            setWeather(newWeather)
        })
    }

    useEffect(getweather,[])

    return (
        <div style={{marginBottom:'15px'}}>
            <h4 style={{marginBottom: 0}}>Weather in Edmonton</h4>
            <div>
                {weather.degree}℃, {weather.describe}
            </div>
            <img src={weather.icon} 
                alt="weatherIcon"
                style={{margin:0}}></img>
        </div>
    )
}

export default Weather 