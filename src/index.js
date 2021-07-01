import React from "react";
import { render } from "react-dom";
import { ResponsiveBar } from "@nivo/bar";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import Collapse from '@material-ui/core/Collapse';

const options = ['Option 1', 'Option 2'];
const timeFilterValues = ['24 hours', '7 days', '30 days', '100 days'];

const data = [
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "CLNE",
        "count": 89
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "WKHS",
        "count": 93
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "CLOV",
        "count": 103
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "AMC",
        "count": 110
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "SPY",
        "count": 140
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "GME",
        "count": 167
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "WISH",
        "count": 175
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "AMD",
        "count": 223
    },
    {
        "one_day": "2021-07-01T00:00:00",
        "mention": "MU",
        "count": 356
    }
];

const App = () => {
    const [timeFilter, setTimeFilter] = React.useState(timeFilterValues[0]);
    const [showFilters, setShowFilters] = React.useState(false);
    const [filtersLabel, setFiltersLabel] = React.useState("Show Filters");

    const toggleShowFilter = () => {
        setShowFilters(!showFilters)

        setFiltersLabel(showFilters ? "Show Filters" : "Hide Filters")
    }

    return (
        <Container maxWidth="md">
            <h1>WSB Mentions</h1>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        <Autocomplete
                            value={timeFilter}
                            disableClearable
                            id="time-filter"
                            options={timeFilterValues}
                            renderInput={(params) =>
                                <TextField {...params} label="Show Last" variant="outlined" size="small" />
                            }
                            onChange={(event, newValue) => {
                                setTimeFilter(newValue);
                            }}
                        />
                    </Grid>
                    <Grid item xs={7}/>
                    <Grid item xs={3} container justify="flex-end">
                        <Button
                            endIcon={<FilterListIcon>{filtersLabel}</FilterListIcon>}
                            onClick={toggleShowFilter}
                        >{filtersLabel}</Button>
                    </Grid>
                </Grid>
            <Collapse in={showFilters} style={{paddingTop: '12px'}}>
                    <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Autocomplete
                            id="tickers-filter"
                            renderInput={(params) => <TextField {...params} label="Ticker" variant="outlined" size="small" />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            id="sector-filter"
                            renderInput={(params) => <TextField {...params} label="Sector" variant="outlined" size="small" />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            id="industry-filter"
                            renderInput={(params) => <TextField {...params} label="Industry" variant="outlined" size="small" />}
                        />
                    </Grid>
                    </Grid>
            </Collapse>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div style={{ height: "700px"}}>
                        <ResponsiveBar
                            data={data}
                            keys={["count"]}
                            indexBy="mention"
                            layout="horizontal"
                            axisBottom={null}
                            margin={{
                                left: 45
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "",
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            enableGridY={null}
                        />
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}

render(<App />, document.getElementById("root"));
