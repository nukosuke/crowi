import React from 'react/addons';
import {Link} from 'react-router';

var WikiHeader = React.createClass({
  propTypes: {
    path: React.PropTypes.string,
  },

  componentDidMount: function() {
    //console.log("WikiHeader.componentDidMount: ", this.state.page);
  },

  renderWikiTitle: function(path) {
    if (!path) {
      return 'Loading...';
    }

    let builtPath = {};
    let currentPath = '';

    let splittedPath = path.split(/\//);
    splittedPath.shift();

    for (let i = 0, count = splittedPath.length; i < count; i++) {
      let childPath = splittedPath[i];
      currentPath += '/';
      builtPath[currentPath] = <Link to={ currentPath }>/</Link>;
      if (childPath) {
        currentPath += childPath;
        builtPath[currentPath] = <Link to={ currentPath }>{ childPath }</Link>;
      }
    }
    if (currentPath.substr(-1, 1) != '/') {
      currentPath += '/';
      builtPath[currentPath] = <Link to={ currentPath } className="last-path">/</Link>;
    }

    return React.addons.createFragment(builtPath);
  },

  render: function() {
    //if (!this.props.configLoaded) {
    //  return <div className=""><i className="fa fa-spinner fa-spin"></i> loading ... </div>;
    //}

    var pageTitle = this.renderWikiTitle(this.props.path);

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
