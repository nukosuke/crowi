import React from 'react';
import { Nav, NavItem, DropdownButton, MenuItem, TabbedArea, TabPane } from 'react-bootstrap';
import {Link} from 'react-router';

var Header = React.createClass({

  getDefaultProps: function() {
    return {
      config: {},
    };
  },

  render: function() {
    let crowiTitle = 'Crowi ...';
    console.log("Header.reander", this.props.config);

    if (this.props.config.crowi) {
      let config = this.props.config;
      crowiTitle = config.crowi['app:title'] || 'Wiki';
    }

    return (
      <nav className="crowi-header navbar navbar-default" role="navigation">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">{ crowiTitle }</a>
        </div>
      </nav>
    );
  }
});

export default Header;
