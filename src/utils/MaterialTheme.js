import { createMuiTheme } from '@material-ui/core/styles'

const mainBlue = "#007acc"
const mainGrey = "#F1F1F1"
const mainDark = "#000000"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: mainBlue
    },
    secondary: {
      main: mainDark
    },
    background: {
      grey: mainGrey
    }
  }
})

export default theme
