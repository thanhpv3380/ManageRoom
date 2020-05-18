import React from 'react';
import { Switch, Route, PrivateRoute, Redirect } from 'react-router-dom';

//components
import Login from './components/auth/Login';
import Content from './components/content/Content';
import NotFound from './components/notfound/NotFound';

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path="/home" render={props =>
                    localStorage.getItem('user') ? (
                        <Content />
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/"
                                }}
                            />
                        )
                    } 
                />
                <Route path="*" component={NotFound} />
            </Switch>
        </div>
    );
}
export default App;
