import React from 'react';

var WikiHeader = React.createClass({
  propTypes: {
    path: React.PropTypes.string,
  },

  //getInitialState: function() {
  //  return {
  //    page: this.props.page,
  //    path: this.props.path,
  //  }
  //},

  componentDidMount: function() {
    //console.log("WikiHeader.componentDidMount: ", this.state.page);
  },

  render: function() {
    var pageTitle = this.props.path || 'Loading ...';

    return (
      <div className="header-wrap">
        <header id="page-header">
          <p className="stopper"><a href="#" data-affix-disable="#page-header"><i className="fa fa-chevron-up"></i></a></p>

          <h1 className="title" id="revision-path">{ pageTitle }</h1>
        </header>
      </div>
    );
  },
});


export default WikiHeader;
