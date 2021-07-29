import React from 'react';
import { render } from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import './index.scss';
import MentionsView from "./MentionsView";
import TickerView from "./TickerView";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <MentionsView />
                </Route>
                <Route path="/mentions/:ticker" children={<TickerView />} />
            </Switch>
        </Router>
    )
}

render(<App />, document.getElementById("root"));
