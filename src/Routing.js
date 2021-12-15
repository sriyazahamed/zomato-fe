import React, { Component } from 'react';
import { Route,BrowserRouter } from 'react-router-dom';

import Home from './Components/Home';
import Filter from './Components/Filter';
import Details from './Components/Details';
import Navigation from './Components/Navigation';

export default class Routing extends Component {
    render() {
        return (
            <BrowserRouter>
                    <Navigation/>
                    <Route path="/" exact component={Home } />
                    <Route path="/Home" component={Home} />
                    <Route path="/Filter" component={Filter } />
                    <Route path="/Details" component={Details} />
            </BrowserRouter>
        )
    }
}
