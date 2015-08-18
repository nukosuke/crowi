import React from 'react';
import marked from 'marked';
import hljs from 'highlight';
import request from 'superagent';

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

  getInitialState: function() {
    return {
      data: {},
      pageLoading: true,
    };
  },

  componentWillMount: function() {
    console.log("Wiki.componentWillMount", this.props);
  },

  componentDidMount: function() {
    console.log("Wiki.componentDidMount", this.props.params.splat);

    //this.setState({
    //  status: 'ok',
    //  page: {
    //    path: '/this/is/title',
    //    content: '# this is body',
    //  },
    //});
    request.get(`/_api/page/${this.props.params.splat}`).end((err, res) => {
      console.log(res);
      this.setState({
        status: res.body.status,
        data: res.body.data,
      });
    });
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
            <ul className="nav nav-tabs hidden-print">
              <li className="">
                <a href="#revision-body" data-toggle="tab"> <i className="fa fa-magic"></i> </a>
              </li>
              <li className=""><a href="#edit-form" data-toggle="tab"><i className="fa fa-pencil-square-o"></i> 編集</a></li>

              <li className="dropdown pull-right">
                <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                  <i className="fa fa-wrench"></i> <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                 <li><a href="#" data-target="#renamePage" data-toggle="modal"><i className="fa fa-share"></i> 移動</a></li>
                 <li><a href="?presentation=1" className="toggle-presentation"><i className="fa fa-arrows-alt"></i> プレゼンモード (beta)</a></li>
                </ul>
              </li>
            </ul>

            <div className="tab-content wiki-content">
              <div className="alert alert-info">
                <strong>移動しました: </strong> このページは <code> page </code> から移動しました。
              </div>
              <div className="alert alert-warning">
                <strong>注意: </strong> これは現在の版ではありません。
              </div>

              <div className="tab-pane active" id="revision-body">
                <div className="revision-toc" id="revision-toc">
                  <a data-toggle="collapse" data-parent="#revision-toc" href="#revision-toc-content" className="revision-toc-head collapsed">目次</a>
                </div>
                <div className="wiki" id="revision-body-content" dangerouslySetInnerHTML={{__html: formattedBody }} />
              </div>
            </div>

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
    var page = this.renderPage();

    return (
      <div className="container-fluid">
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
