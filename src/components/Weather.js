import React, { useState, useEffect } from 'react'
import axios from "axios"

const Weather = () => {
    const [weather, setWeather] = useState({})
    const api_key = process.env.API_KEY
    
    const getweather = () => {
        axios.get('https://devapi.heweather.net/v7/weather/now?key=' + api_key + '&location=8C9E4&lang=en')
        .then(response => {
            const apiResponse = response.data.now
            const newWeather = {
                feel: apiResponse.feelsLike,
                temp: apiResponse.temp,
                describe: apiResponse.text
            }
            setWeather(newWeather)
        })
    }

    useEffect(getweather,[])

    return (
        <div style={{marginBottom:'15px'}}>
            <h4 style={{marginBottom: 0}}>Weather in Edmonton</h4>
            <div>
                {weather.temp}℃, feels like {weather.feel}℃,<br /> {weather.describe}
            </div>

        </div>
    )
}

export default Weather 