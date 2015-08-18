/**
 *
 */

import React from 'react';
import Router from 'react-router';
import {Route, RouteHandler, NotFoundRoute, HistoryLocation, Link} from 'react-router';

//import PageStore from './stores/PageStore';
import Wiki from './components/Wiki';
import Header from './components/Header';

var Crowi = React.createClass({
  render: function () {

    return (
      <div>
        <Header />
        <RouteHandler { ...this.props} />
      </div>
    );
  }
});

    //<Route path="/logout" name="wiki" handler={ServerSideRendering} />
var routes = (
  <Route path="/" handler={Crowi}>
    <NotFoundRoute name="wiki" handler={Wiki} />
  </Route>
);

Router.run(routes, HistoryLocation, (Root) => {
  React.render(<Root/>, document.body);
});
