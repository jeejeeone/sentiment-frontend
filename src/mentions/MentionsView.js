import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from 'axios';
import BarChart from "./BarChart";
import '../index.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import { atom, useRecoilState } from 'recoil';
import { persistAtom } from "../common/persist";

const timeFilterValues = ['24 hours', '7 days', '30 days', '100 days'];

const MentionsView = () => {
    const [timeFilter, setTimeFilter] = useRecoilState(timeFilterState)
    const [showFilters, setShowFilters] = useRecoilState(showFiltersState)
    const [mentionsView, setMentionsView] = React.useState([])
    const [mentions, setMentions] = React.useState([])
    const [fetching, setFetching] = React.useState(false)
    const [tickerFilter, setTickerFilter] = useRecoilState(tickerFilterState)
    const [sectorFilter, setSectorFilter] = useRecoilState(sectorFilterState)
    const [industryFilter, setIndustryFilter] = useRecoilState(industryFilterState)

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
        const showFiltersValue = {
            show: !showFilters.show,
            label: showFilters.show ? "Show Filters" : "Hide Filters"
        }

        setShowFilters(showFiltersValue)
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
                        endIcon={<FilterListIcon>{showFilters.label}</FilterListIcon>}
                        onClick={toggleShowFilter}
                        className="showFilters"
                    >{showFilters.label}</Button>
                </Grid>
            </Grid>
            { showFilters.show ?
                <div style={{paddingTop: '12px', paddingBottom: '12px'}}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Autocomplete
                                multiple
                                limitTags={1}
                                value={tickerFilter}
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
                                value={sectorFilter}
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
                                value={industryFilter}
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

const tickerFilterState = atom({
    key: 'tickerFilterState',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

const sectorFilterState = atom({
    key: 'sectorFilterState',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

const industryFilterState = atom({
    key: 'industryFilterState',
    default: [],
    effects_UNSTABLE: [persistAtom]
});

const timeFilterState = atom({
    key: 'timeFilterState',
    default: timeFilterValues[0],
    effects_UNSTABLE: [persistAtom]
});

const showFiltersState = atom({
    key: 'showFiltersState',
    default: {
        show: false,
        label: "Show Filters"
    },
    effects_UNSTABLE: [persistAtom]
});

export default MentionsView