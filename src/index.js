import React from 'react';
import { render } from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import './index.scss';
import MentionsView from "./mentions/MentionsView";
import TickerView from "./ticker/TickerView";
import Container from '@material-ui/core/Container';
import { RecoilRoot } from 'recoil';
import SentimentBreadcrumbs from "./common/SentimentBreadcrumbs";

const App = () => {
    return (
        <RecoilRoot>
            <header>
                <Container maxWidth="md" className="headerContainer">
                    <h1>WSB Mentions</h1>
                    <SentimentBreadcrumbs/>
                </Container>
            </header>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <MentionsView />
                    </Route>
                    <Route path="/ticker/:ticker" children={<TickerView />} />
                </Switch>
            </Router>
        </RecoilRoot>
    )
}

render(<App />, document.getElementById("root"));
