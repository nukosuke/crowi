import React from 'react';

import {Link} from 'react-router';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    var crowiTitle = 'Crowi Wiki';

    return (
      <nav className="crowi-header navbar navbar-default" role="navigation">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">{ crowiTitle }</a>
        </div>
      </nav>
    );
  }
}

export default Header;
