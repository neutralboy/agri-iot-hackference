import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Async from 'react-code-splitting';
import MainPage from './pages/main.jsx';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: [
            '"Open Sans"',
        ].join(','),
    }, palette: {
        primary: {
            main: '#954bc5',
        },
        secondary: {
            main: '#72d04a',
        },
    },
});



export default class RouterComp extends React.Component {
    componentDidMount = () => {
        window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <React.Fragment>
                    <Router>

                        <Switch>
                            <Route path="/:username" component={MainPage} />
                        </Switch>

                    </Router>

                </React.Fragment>
            </MuiThemeProvider>
        )
    }
}


ReactDOM.render(<RouterComp />, document.getElementById('root'));
