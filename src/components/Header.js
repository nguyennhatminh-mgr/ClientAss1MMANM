import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <div className="mb-5">
                <nav className="navbar navbar-light bg-light d-flex justify-content-center">
                    <a className="navbar-brand text-white" href="/crypt">
                        ASE - RSA
                    </a>
                </nav>
                <ul className="nav nav-tabs container">
                    <li className="nav-item">
                        <NavLink activeClassName="selected" className="nav-link" to="/crypt">Encrypt - Decrypt</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="selected" className="nav-link" to="/checkintegrity">Check Integrity</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;