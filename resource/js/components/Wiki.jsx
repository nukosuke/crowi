import React from 'react';
import marked from 'marked';
import hljs from 'highlight';
import request from 'superagent';
import { Nav, NavItem, DropdownButton, MenuItem, TabbedArea, TabPane } from 'react-bootstrap';

import WikiHeader from './WikiHeader';
import Sidebar from './Sidebar';

marked.setOptions({
  gfm: true,
  highlight: function (code, lang, callback) {
    var result, hl;
    if (lang) {
      try {
        hl = hljs.highlight(lang, code);
        result = hl.value;
      } catch (e) {
        result = code;
      }
    } else {
      //result = hljs.highlightAuto(code);
      //callback(null, result.value);
      result = code;
    }
    return callback(null, result);
  },
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

var Wiki = React.createClass({

  propTypes: {
    configLoaded: React.PropTypes.boolean,
    config: React.PropTypes.object.isRequired,
    router: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      data: {},
      pageLoaded: false,
      contentTab: 1,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("Wiki.componentWillReceiveProps", nextProps, this.props);
    let currentPath = nextProps.router.getCurrentPath().substr(1);
    console.log("Wiki.componentWillReceiveProps call API with: ", currentPath);

    this.setState({pageLoaded: false});
    request.get(`/_api/page/${currentPath}`).end((err, res) => {
      console.log(res);
      this.setState({
        status: res.body.status,
        data: res.body.data,
        pageLoaded: true,
      });
    });
  },

  componentWillUpdate: function(nextProps, nextState) {
    console.log("Wiki.componentWillUpdate", nextProps, nextState);
  },

  componentWillMount: function() {
    console.log("Wiki.componentWillMount", this.props);
  },

  componentDidMount: function() {
    console.log("Wiki.componentDidMount", this.props);
  },

  handleTabSelect: function(selectedKey) {
    console.log(selectedKey);
    this.setState({contentTab: selectedKey});
  },

  renderPage: function() {
    if (this.state.data.path) {
      var path = this.state.data.path;
      var page = this.state.data.page;
      var revision = this.state.data.revision;
      var author = this.state.data.author;
      var formattedBody = marked(revision.body);

      return (
        <article>
          <WikiHeader page={ this.state.data } path={ path } />

          <div id="content-main" className="content-main">
            <Nav bsStyle="tabs" className="hidden-print" onSelect={ this.handleTabSelect }>
              <NavItem className="" eventKey={1} href="#revision-body"><i className="fa fa-magic"></i></NavItem>
              <NavItem className="" eventKey={2}  href="#edit-form"><i className="fa fa-pencil-square-o"></i> 編集</NavItem>

              <DropdownButton pullRight={ true } navItem={ true } title=<i className="fa fa-wrench"></i>>
                <MenuItem href="#" data-target="#renamePage" data-toggle="modal"><i className="fa fa-share"></i> 移動</MenuItem>
                <MenuItem href="?presentation=1" className="toggle-presentation"><i className="fa fa-arrows-alt"></i> プレゼンモード (beta)</MenuItem>
              </DropdownButton>
            </Nav>

            <TabbedArea defaultActiveKey={1} activeKey={ this.state.contentTab } className="wiki-content">
              <div className="alert alert-info">
                <strong>移動しました: </strong> このページは <code> page </code> から移動しました。
              </div>
              <div className="alert alert-warning">
                <strong>注意: </strong> これは現在の版ではありません。
              </div>

              <TabPane eventKey={1} id="revision-body">
                <div className="reision-toc" id="revision-toc">
                  <a data-toggle="collapse" data-parent="#revision-toc" href="#revision-toc-content" className="revision-toc-head collapsed">目次</a>
                </div>
                <div className="wiki" id="revision-body-content" dangerouslySetInnerHTML={{__html: formattedBody }} />
              </TabPane>
              <TabPane eventKey={2} id="revision-form">
                Edit
              </TabPane>
            </TabbedArea>

          </div>
          <footer>
            <p className="meta">
            Path: <span id="pagePath">{ page.path }</span><br />
            Revision: { revision._id }<br />
            Last Updated User: <a href="/user/{ author.username }">{ author.name }</a><br />
            Created: { page.createdAt }<br />
            Updated: { page.updatedAt }<br />
            </p>
          </footer>

        </article>
      );
    } else {
      return (
        <div>
        ...
        </div>
      );
    }
  },

  render: function() {
    let page = this.renderPage();
    let loadingIndicator = "";
    if (!this.state.pageLoaded) {
      loadingIndicator = ""; // @TODO
    }

    return (
      <div className="container-fluid">
        { loadingIndicator }
        <div className="row">
          <div id="main" className="main col-md-9">

          { page }

          </div>
          <Sidebar />
        </div>
      </div>
    );
  }
});

export default Wiki;
