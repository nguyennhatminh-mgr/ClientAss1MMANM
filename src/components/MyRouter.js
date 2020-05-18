import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import FormGetFile from './FormGetFile';
import CheckSum from './CheckSum';

class MyRouter extends Component {
    render() {
        return (
            <div>
                <Route exact path="/crypt" component={FormGetFile}></Route>
                <Route exact path="/" component={FormGetFile}></Route>
                <Route exact path="/checksum" component={CheckSum}></Route>
            </div>
        );
    }
}

export default MyRouter;