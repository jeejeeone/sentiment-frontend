import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from 'axios';
import BarChart from "./BarChart";
import './index.scss';
import CircularProgress from '@material-ui/core/CircularProgress';

const timeFilterValues = ['24 hours', '7 days', '30 days', '100 days'];

const MentionsView = () => {
    const [timeFilter, setTimeFilter] = React.useState(timeFilterValues[0]);
    const [showFilters, setShowFilters] = React.useState(false);
    const [filtersLabel, setFiltersLabel] = React.useState("Show Filters");
    const [mentionsView, setMentionsView] = React.useState([])
    const [mentions, setMentions] = React.useState([])
    const [fetching, setFetching] = React.useState(false)
    const [tickerFilter, setTickerFilter] = React.useState([])
    const [sectorFilter, setSectorFilter] = React.useState([])
    const [industryFilter, setIndustryFilter] = React.useState([])

    useEffect(() => {
        if (!fetching) {
            setFetching(true);

            axios.get(`/api/ui/mentions/last/` + timeFilter).then(
                res => {
                    setMentions(JSON.parse(JSON.stringify(res.data.mentions)))
                    setMentionsView(getFilteredMentions(res.data.mentions, tickerFilter, sectorFilter, industryFilter))
                    setFetching(false)
                }
            )
        }
    }, [timeFilter]);

    const toggleShowFilter = () => {
        setShowFilters(!showFilters)

        setFiltersLabel(showFilters ? "Show Filters" : "Hide Filters")
    }

    const getTickers = () => {
        return mentions.map(item => item.ticker)
    }

    const getSectors = () => {
        return [...new Set(mentions.map(item => item.sector))];
    }

    const getIndustries = () => {
        return [...new Set(mentions.map(item => item.industry))];
    }

    const filterByTicker = (tickers) => {
        setTickerFilter(tickers)
        setMentionsView(getFilteredMentions(mentions, tickers, sectorFilter, industryFilter))
    }

    const filterBySectors = (sectors) => {
        setSectorFilter(sectors)
        setMentionsView(getFilteredMentions(mentions, tickerFilter, sectors, industryFilter))
    }

    const filterByIndustries = (industries) => {
        setIndustryFilter(industries)
        setMentionsView(getFilteredMentions(mentions, tickerFilter, sectorFilter, industries))
    }

    const getFilteredMentions = (mentionsArray, tickerFilter, sectorFilter, industryFilter) => {
        const showMention = (mention) => {
            return (sectorFilter.length == 0 && tickerFilter.length == 0 && industryFilter.length == 0)
                || (industryFilter.includes(mention.industry)
                    || tickerFilter.includes(mention.ticker)
                    || sectorFilter.includes(mention.sector));
        }

        return mentionsArray.filter(mention => showMention(mention));
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
            { showFilters ?
                <div style={{paddingTop: '12px', paddingBottom: '12px'}}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Autocomplete
                                multiple
                                limitTags={1}
                                options={getTickers()}
                                id="tickers-filter"
                                renderInput={(params) => <TextField {...params} label="Ticker" variant="outlined" />}
                                onChange={(event, newValue) => {
                                    filterByTicker(newValue);
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                multiple
                                limitTags={1}
                                options={getSectors()}
                                id="sector-filter"
                                renderInput={(params) => <TextField {...params} label="Sector" variant="outlined" />}
                                onChange={(event, newValue) => {
                                    filterBySectors(newValue);
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                multiple
                                limitTags={1}
                                options={getIndustries()}
                                id="industry-filter"
                                renderInput={(params) => <TextField {...params} label="Industry" variant="outlined" />}
                                onChange={(event, newValue) => {
                                    filterByIndustries(newValue);
                                }}
                            />
                        </Grid>
                    </Grid>
                </div> : null
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    { fetching ?
                        <div className="spinnerWrapper"><CircularProgress className="loadingSpinner" /></div> :
                        <BarChart tickers={mentionsView}/>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}

export default MentionsView