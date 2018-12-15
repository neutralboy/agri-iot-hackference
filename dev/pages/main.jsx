import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Fab } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ResponsiveContainer, LineChart, Line, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import axios from 'axios';
import moment from 'moment';
import { ExportToCsv } from 'export-to-csv';




const styles = {
    root: {
        flexGrow: 1,
    },
    rubik: {
        fontFamily: "Rubik"
    },
    marg: {
        margin: 5
    },
    pad: {
        padding: 15
    }
};

const user = "hri"
class MainPage extends Component {
    state = {
        graph_arr: [],
        comp_param: "Humidity"
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    componentDidMount = () => {
        this.interval = setInterval(() => {
            console.log("HELLO")
            axios.get("/API/graphs/" + this.props.match.params.username).then((r) => {
                console.log(r.data.results[0])
                this.setState({
                    graph_arr: r.data.results
                })
            }).catch((e) => {
                console.log(e);
            })
        }, 5000);

    }
    getUser = () => {
        return <b>HRI</b>;
    }
    handleChange = (d) => {
        this.setState({ comp_param: d });
    };
    downloadCVV = () => {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'AGRI LOG 1.0',
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExporter = new ExportToCsv(options);
        axios.get("/API/download/graphs/" + user).then((r) => {
            csvExporter.generateCsv(r.data);
        }).catch((e) => {
            console.log(e)
        })

    }
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <Typography variant="h4" color="inherit" className={classes.rubik}>
                                Log of all agricultural Data
          </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <br /><br />
                <div>
                    <Typography variant="h4" className={classes.rubik}>{this.props.match.params.username}</Typography>
                    <br />
                    <div>
                        <div>
                            <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Humidity")}>Humidity</Button>
                            <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Air_Temp")}>Air Temperature</Button>
                            <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Soil_Moisture")}>Soil Moisture</Button>
                            <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Pressure")}>Pressure</Button>
                            <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Soil_Temp")}>Soil Temperature</Button>
                        </div>
                        <ResponsiveContainer height={300}>
                            <LineChart data={this.state.graph_arr}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="created_on" tickFormatter={timeStr => moment(timeStr).format('HH:mm:ss')} />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey={this.state.comp_param} stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        <br/>
                        
                    </div>
                    <br /><br />
                    <div className={classes.pad}>
                        <Fab variant="extended" color="secondary" onClick={this.downloadCVV}>Download Data <i className="material-icons">cloud_download</i></Fab>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
MainPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainPage);