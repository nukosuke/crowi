import React from 'react';

import {Link} from 'react-router';

var Huga = React.createClass({
  render: function() {

    return (
      <div>
        <h2>This is fuga</h2>
        <Link to="/">Top</Link>
      </div>
    );
  },
});

export default Huga;

