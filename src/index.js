import React, { useEffect } from 'react';
import { render } from "react-dom";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import Collapse from '@material-ui/core/Collapse';
import axios from 'axios';
import BarChart from "./BarChart";
import './index.scss';
import CircularProgress from '@material-ui/core/CircularProgress';

const timeFilterValues = ['24 hours', '7 days', '30 days', '100 days'];

const App = () => {
    const [timeFilter, setTimeFilter] = React.useState(timeFilterValues[0]);
    const [showFilters, setShowFilters] = React.useState(false);
    const [filtersLabel, setFiltersLabel] = React.useState("Show Filters");
    const [mentions, setMentions] = React.useState([])
    const [fetching, setFetching] = React.useState(true)

    useEffect(() => {
        if (!fetching)
            setFetching(true);

        axios.get(`/api/ui/mentions/last/` + timeFilter).then(
            res => {
                setMentions(res.data.mentions)
                setFetching(false)
            }
        )
    }, [timeFilter]);

    const toggleShowFilter = () => {
        setShowFilters(!showFilters)

        setFiltersLabel(showFilters ? "Show Filters" : "Hide Filters")
    }

    return (
        <Container maxWidth="md" className="mentionsChart">
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
                    <Grid item xs={3}>
                        <Button
                            endIcon={<FilterListIcon>{filtersLabel}</FilterListIcon>}
                            onClick={toggleShowFilter}
                            className="showFilters"
                        >{filtersLabel}</Button>
                    </Grid>
                </Grid>
            {/* TODO: Remove collapse not needed */}
            { showFilters ?
                <Collapse in={showFilters} style={{paddingTop: '12px', paddingBottom: '12px'}}>
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
                </Collapse> : null
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    { fetching ?
                        <div className="spinnerWrapper"><CircularProgress className="loadingSpinner" /></div> :
                        <BarChart tickers={mentions}/>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}

render(<App />, document.getElementById("root"));
