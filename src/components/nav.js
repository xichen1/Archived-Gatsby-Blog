import React, { useState } from 'react'
// import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { navigate } from 'gatsby'


const Nav = ({ routers, currentPage }) => {
    const [index] = useState(
        routers.findIndex(r => r.link === currentPage)
    )

    return (
        <div style={{ 'boxShadow': '0 1px 0 0 #eee' }}>
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
        </div>

    )
}

export default Nav