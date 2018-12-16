import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Fab, Typography, Grid, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
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
    },
    bold: {
        fontWeight: "bold"
    },
    logoImg: {
        height: "30rem"
    }
};


class MainPage extends Component {
    state = {
        graph_arr: [],
        comp_param: "Humidity",
        temp: 0,
        humidity: 0,
        soil_moist: 0,
        pressure: 0.0
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    componentDidMount = () => {
        this.interval = setInterval(() => {
            console.log("HELLO")
            axios.get("/API/graphs/" + this.props.match.params.username).then((r) => {
                this.setState({
                    graph_arr: r.data.results,
                    temp: r.data.results[0].Air_Temp,
                    soil_moist: r.data.results[0].Soil_Moisture,
                    humidity: r.data.results[0].Humidity,
                    pressure: r.data.results[0].Pressure
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
    pressureConvert = (a) => {
        var atm = parseFloat(a) / 101325.0;
        return atm.toFixed(3);
    }
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
        axios.get("/API/download/graphs/" + this.props.match.params.username).then((r) => {
            csvExporter.generateCsv(r.data);
        }).catch((e) => {
            console.log(e)
        })

    }
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <br /><br />
                <div>
                    <div className={classes.pad}>
                        <Grid container spacing={16}>
                            <Grid item lg={6}>
                                <Paper>
                                    <div className={classes.pad} align="center">
                                        <Typography variant="body2">Node name: <b>{this.props.match.params.username}</b></Typography>
                                        <img src="https://i.imgur.com/WS5SsnP.jpg" alt="title" className={classes.logoImg} />

                                        <p>Gowth Rate is Constant</p>
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid item lg={6}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} lg={6}>
                                        <Paper>
                                            <div className={classes.pad} align="center">

                                                <img src="https://i.imgur.com/JMb310P.jpg" alt="temp" height="120" />
                                                <br /><br />
                                                <Typography variant="h5" className={classes.rubik}>Temperature</Typography>
                                                <Typography variant="h3" className={classes.bold}>{this.state.temp}&#8451;</Typography>


                                            </div>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <Paper>
                                            <div className={classes.pad} align="center">
                                                <img src="https://i.imgur.com/kaOd5sp.jpg" alt="temp" height="120" />
                                                <br /><br />
                                                <Typography variant="h5" className={classes.rubik}>Soil Moisture</Typography>
                                                <Typography variant="h3" className={classes.bold}>{this.state.soil_moist}%</Typography>
                                            </div>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <Paper>
                                            <div className={classes.pad} align="center">
                                                <img src="https://i.imgur.com/Hb6CDK0.jpg" alt="temp" height="120" />
                                                <br /><br />
                                                <Typography variant="h5" className={classes.rubik}>Humidity</Typography>
                                                <Typography variant="h3" className={classes.bold}>{this.state.humidity}%</Typography>
                                            </div>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} lg={6}>
                                        <Paper>
                                            <div className={classes.pad} align="center">
                                                <img src="https://i.imgur.com/eaN4CuQ.jpg" alt="temp" height="120" />
                                                <br /><br />
                                                <Typography variant="h5" className={classes.rubik}>Pressure</Typography>
                                                <Typography variant="h3" className={classes.bold}>{this.pressureConvert(this.state.pressure)} atm</Typography>
                                            </div>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    <br /><br /><br />
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
                        <br />

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