import React from 'react';

// Component
import Header from './../header/Header';
import Main from './main/Main';
import Notification from './notification/Notification';
import BetGame from './betgame/BetGame';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
function Content() {
    let match = useRouteMatch();
    return(
        <div>
            <Header />
            <div className="container">
                <Switch>
                    <Route exact path={match.path} > <Main /></Route>
                    <Route exact path={`${match.path}/notification`} > <Notification/></Route>
                    <Route exact path={`${match.path}/betgame`} > <BetGame/></Route>
                </Switch>
            </div>
        </div>
    )
}
export default Content;