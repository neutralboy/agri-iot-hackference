import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Fab, Typography, Grid, Paper } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Line, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';

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
}

class GrossData extends Component {
    state = {
        plt_data: [],
        comp_param: "Humidity"
    }
    componentDidMount = () => {
        axios.get("/API/download/graphs/hri").then((r) => {
            this.setState({
                plt_data: r.data
            })
        }).catch((e) => {
            console.log(e);
        })
    }
    handleChange = (d) => {
        this.setState({ comp_param: d });
    };
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Typography variant="h3" className={classes.rubik}>Plot of the last 200 Data points</Typography>
                <br />
                <div>
                    <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Humidity")}>Humidity</Button>
                    <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Air_Temp")}>Air Temperature</Button>
                    <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Soil_Moisture")}>Soil Moisture</Button>
                    <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Pressure")}>Pressure</Button>
                    <Button className={classes.marg} variant="outlined" onClick={() => this.handleChange("Soil_Temp")}>Soil Temperature</Button>
                </div>
                <ResponsiveContainer height={300}>
                    <LineChart data={this.state.plt_data}
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

            </React.Fragment >
        )
    }
}

GrossData.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GrossData);