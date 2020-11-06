import React, { useState } from 'react'
// import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { navigate } from 'gatsby'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#6573c3',
            main: '#2196f3',
            dark: '#2c387e',
        },
        secondary: {
            main: '#607d8b'
        }
    }
})

const Nav = ({ routers, currentPage }) => {
    const [index] = useState(
        routers.findIndex(r => r.link === currentPage)
    )

    return (
        <div style={{ 'boxShadow': '0 1px 0 0 #eee' }}>

            <ThemeProvider theme={theme}>
                <Tabs
                    value={index}
                    indicatorColor="primary"
                    textColor="secondary"
                    onChange={(_, value) => navigate(routers[value].link)}
                    centered
                >
                    {routers.map(router => (
                        <Tab label={router.name} key={router.link} />
                    ))}
                </Tabs>
            </ThemeProvider>
        </div>

    )
}

export default Nav