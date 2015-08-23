/**
 *
 */

import React from 'react';
import Router from 'react-router';
import request from 'superagent';
import {Route, RouteHandler, NotFoundRoute, HistoryLocation, Link} from 'react-router';

//import PageStore from './stores/PageStore';
import Wiki from './components/Wiki';
import Header from './components/Header';

var Crowi = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      config: {},
      configLoaded: false,
    };
  },

  componentDidMount: function() {
    console.log("Crowi.componentDidMount");

    request.get('/_api/config').end((err, res) => {
      console.log("config.response", res);
      let {data, status} = res.body;

      console.log("config.status", status);
      console.log("config.data", data);

      this.setState({
        config: data,
        configLoaded: true,
      });
    });
  },

  render: function () {
    let contents = "";
        //contents = <div className=""><i className="fa fa-spinner fa-spin"></i> loading config ... </div>;

    return (
      <div>
        <Header config={ this.state.config } />
        <RouteHandler {... this.context} {...this.props} {...this.state} config={this.state.config} />
      </div>
    );
  }
});

    //<Route path="/logout" name="wiki" handler={ServerSideRendering} />
var routes = (
  <Route path="/" handler={Crowi}>
    <Route name="wiki" handler={Wiki} path="*" />
  </Route>
);

Router.run(routes, HistoryLocation, (Root) => {
  React.render(<Root/>, document.body);
});
