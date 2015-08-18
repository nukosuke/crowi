/* jshint browser: true, jquery: true */
/* global FB, marked */
/* Author: Sotaro KARASAWA <sotarok@crocos.co.jp>
*/

var $ = require('jquery');
//var marked = require('marked');
//var hljs = require('highlight');
var io = require('socket.io-client');

require('jquery.cookie/jquery.cookie');
require('bootstrap');

var Crowi = {};

Crowi.createErrorView = function(msg) {
  $('#main').prepend($('<p class="alert-message error">' + msg + '</p>'));
};

//Crowi.linkPath = function(revisionPath) {
//  var $revisionPath = revisionPath || '#revision-path';
//  var $title = $($revisionPath);
//  if (!$title.get(0)) {
//    return;
//  }
//
//  var path = '';
//  var pathHtml = '';
//  var splittedPath = $title.html().split(/\//);
//  splittedPath.shift();
//  splittedPath.forEach(function(sub) {
//    path += '/';
//    pathHtml += ' <a href="' + path + '">/</a> ';
//    if (sub) {
//      path += sub;
//      pathHtml += '<a href="' + path + '">' + sub + '</a>';
//    }
//  });
//  if (path.substr(-1, 1) != '/') {
//    path += '/';
//    pathHtml += ' <a href="' + path + '" class="last-path">/</a>';
//  }
//  $title.html(pathHtml);
//};

Crowi.correctHeaders = function(contentId) {
  // h1 ~ h6 の id 名を補正する
  var $content = $(contentId || '#revision-body-content');
  var i = 0;
  $('h1,h2,h3,h4,h5,h6', $content).each(function(idx, elm) {
    var id = 'head' + i++;
    $(this).attr('id', id);
    $(this).addClass('revision-head');
    $(this).append('<span class="revision-head-link"><a href="#' + id +'"><i class="fa fa-link"></i></a></span>');
  });
};

Crowi.revisionToc = function(contentId, tocId) {
  var $content = $(contentId || '#revision-body-content');
  var $tocId = $(tocId || '#revision-toc');

  var $tocContent = $('<div id="revision-toc-content" class="revision-toc-content collapse"></div>');
  $tocId.append($tocContent);

  $('h1', $content).each(function(idx, elm) {
    var id = $(this).attr('id');
    var title = $(this).text();
    var selector = '#' + id + ' ~ h2:not(#' + id + ' ~ h1 ~ h2)';

    var $toc = $('<ul></ul>');
    var $tocLi = $('<li><a href="#' + id +'">' + title + '</a></li>');


    $tocContent.append($toc);
    $toc.append($tocLi);

    $(selector).each(function()
    {
      var id2 = $(this).attr('id');
      var title2 = $(this).text();
      var selector2 = '#' + id2 + ' ~ h3:not(#' + id2 + ' ~ h2 ~ h3)';

      var $toc2 = $('<ul></ul>');
      var $tocLi2 = $('<li><a href="#' + id2 +'">' + title2 + '</a></li>');

      $tocLi.append($toc2);
      $toc2.append($tocLi2);

      $(selector2).each(function()
      {
        var id3 = $(this).attr('id');
        var title3 = $(this).text();

        var $toc3 = $('<ul></ul>');
        var $tocLi3 = $('<li><a href="#' + id3 +'">' + title3 + '</a></li>');

        $tocLi2.append($toc3);
        $toc3.append($tocLi3);
      });
    });
  });
};


Crowi.escape = function(s) {
  s = s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    ;
  return s;
};
Crowi.unescape = function(s) {
  if (!s) {
    return '';
  }
  s = s.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, '\'')
    .replace(/&quot;/g, '"')
    ;
  return s;
};

Crowi.getRendererType = function() {
  return new Crowi.rendererType.markdown();
};

Crowi.rendererType = {};
Crowi.rendererType.markdown = function(){};
Crowi.rendererType.markdown.prototype = {
  render: function(contentText) {
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

    var contentHtml = Crowi.unescape(contentText);
    contentHtml = this.expandImage(contentHtml);
    contentHtml = this.link(contentHtml);

    var $body = this.$revisionBody;
    // Using async version of marked
    marked(contentHtml, {}, function (err, content) {
      if (err) {
        throw err;
      }
      $body.html(content);
    });
  },
  link: function (content) {
    return content
      //.replace(/\s(https?:\/\/[\S]+)/g, ' <a href="$1">$1</a>') // リンク
      .replace(/\s<((\/[^>]+?){2,})>/g, ' <a href="$1">$1</a>') // ページ間リンク: <> でかこまれてて / から始まり、 / が2個以上
      ;
  },
  expandImage: function (content) {
    return content.replace(/\s(https?:\/\/[\S]+\.(jpg|jpeg|gif|png))/g, ' <a href="$1"><img src="$1" class="auto-expanded-image"></a>');
  }
};

Crowi.renderer = function (contentText, revisionBody) {
  var $revisionBody = revisionBody || $('#revision-body-content');

  this.contentText = contentText;
  this.$revisionBody = $revisionBody;
  this.format = 'markdown'; // とりあえず
  this.renderer = Crowi.getRendererType();
  this.renderer.$revisionBody = this.$revisionBody;
};
Crowi.renderer.prototype = {
  render: function() {
    this.renderer.render(this.contentText);
  }
};

$(function() {
  //Crowi.linkPath();

  $('[data-toggle="tooltip"]').tooltip();
  $('[data-tooltip-stay]').tooltip('show');

  $('.copy-link').on('click', function () {
    $(this).select();
  });

  $('#createMemo').on('shown.bs.modal', function (e) {
    $('#memoName').focus();
  });
  $('#createMemoForm').submit(function(e)
  {
    var prefix = $('[name=memoNamePrefix]', this).val();
    var name = $('[name=memoName]', this).val();
    if (name === '') {
      prefix = prefix.slice(0, -1);
    }
    top.location.href = prefix + name;

    return false;
  });

  $('#renamePage').on('shown.bs.modal', function (e) {
    $('#newPageName').focus();
  });
  $('#renamePageForm').submit(function(e) {
    var path = $('#pagePath').html();
    $.ajax({
      type: 'POST',
      url: '/_api/page_rename' + path,
      data: $('#renamePageForm').serialize(),
      dataType: 'json'
    }).done(function(data) {
      if (!data.status) {
        $('#newPageNameCheck').html('<i class="fa fa-times-circle"></i> ' + data.message);
        $('#newPageNameCheck').addClass('alert-danger');
      } else {
        $('#newPageNameCheck').removeClass('alert-danger');

        $('#newPageNameCheck').html('<img src="/images/loading_s.gif"> 移動しました。移動先にジャンプします。');

        setTimeout(function() {
          top.location.href = data.page.path + '?renamed=' + path;
        }, 1000);
      }
    });

    return false;
  });

});

$(function(){
    //var renderer = new Crowi.renderer($('#raw-text-original').html());
    //renderer.render();
    //Crowi.correctHeaders('#revision-body-content');
    //Crowi.revisionToc('#revision-body-content', '#revision-toc');

    $('a[data-toggle="tab"][href="#edit-form"]').on('show.bs.tab', function() {
      $('.content-main').addClass('on-edit');
    });
    $('a[data-toggle="tab"][href="#edit-form"]').on('hide.bs.tab', function() {
      $('.content-main').removeClass('on-edit');
    });

    $('#edit-form').submit(function()
    {
      //console.log('save');
      //return false;
    });

    //data-spy="affix" data-offset-top="80"
    var headerHeight = $('#page-header').outerHeight(true);
    $('.header-wrap').css({height: headerHeight + 'px'});
    $('#page-header').affix({
      offset: {
        top: function() {
          return headerHeight + 74; // (54 header + 20 padding-top)
        }
      }
    });
    $('[data-affix-disable]').on('click', function(e) {
      $elm = $($(this).data('affix-disable'));
      $(window).off('.affix');
      $elm.removeData('affix').removeClass('affix affix-top affix-bottom');
      return false;
    });
});
$(function() {
  //var pageId = $('#content-main').data('crowi-page-id');
  //$.get('/_api/page/' + pageId + '/bookmark', function(data) {
  //  if (data.bookmarked) {
  //    $('#bookmarkButton')
  //      .removeClass('btn-default')
  //      .addClass('btn-warning active bookmarked');
  //    $('#bookmarkButton i')
  //      .removeClass('fa-star-o')
  //      .addClass('fa-star');
  //  }
  //});

  //$('#bookmarkButton').click(function() {
  //  $.post('/_api/page/' + pageId + '/bookmark', function(data) {
  //  });
  //});
  //$('#pageLikeButton').click(function() {
  //  $.post('/_api/page/' + pageId + '/like', function(data) {
  //  });
  //});
});
//$(function() {
//  var me = {{ user|json|safe }};
//  var socket = io();
//  socket.on('page edited', function (data) {
//    if (data.user._id != me._id
//      && data.page.path == {{ page.path|json|safe }}) {
//      $('#notifPageEdited').removeClass('fk-hide').css({bottom: 0});
//      $('#notifPageEdited .edited-user').html(data.user.name);
//    }
//  });
//});
$(function() {
  var presentaionInitialized = false
    , $b = $('body');

  $(document).on('click', '.toggle-presentation', function(e) {
    var $a = $(this);

    e.preventDefault();
    $b.toggleClass('overlay-on');

    if (!presentaionInitialized) {
      presentaionInitialized = true;

      $('<iframe />').attr({
        src: $a.attr('href')
      }).appendTo($('#presentation-container'));
    }
  }).on('click', '.fullscreen-layer', function() {
    $b.toggleClass('overlay-on');
  });
});
$(function() {
  $('#toggle-sidebar').click(function(e) {
    var $mainContainer = $('.main-container');
    if ($mainContainer.hasClass('aside-hidden')) {
      $('.main-container').removeClass('aside-hidden');
      $.cookie('aside-hidden', 0, { expires: 30, path: '/' });
    } else {
      $mainContainer.addClass('aside-hidden');
      $.cookie('aside-hidden', 1, { expires: 30, path: '/' });
    }
    return false;
  });
});
$(function() {
  if ($.cookie('aside-hidden') == 1) {
    $('.main-container').addClass('aside-hidden');
  }
});

$(function() {
  // preview watch
  var prevContent = "";
  //var watchTimer = setInterval(function() {
  //  var content = $('#form-body').val();
  //  if (prevContent != content) {
  //    var renderer = new Crowi.renderer($('#form-body').val(), $('#preview-body'));
  //    renderer.render();

  //    prevContent = content;
  //  }
  //}, 500);

  // tabs handle
  $('textarea#form-body').on('keydown', function(event){
    var self  = $(this)
        start = this.selectionStart,
        end   = this.selectionEnd
        val   = self.val();

    if (event.keyCode === 9) {
      // tab
      event.preventDefault();
      self.val(
        val.substring(0, start)
        + '    '
        + val.substring(end, val.length)
      );
      this.selectionStart = start + 4;
      this.selectionEnd   = start + 4;
    } else if (event.keyCode === 27) {
      // escape
      self.blur();
    }
  });
});

$(function(){
    $('#view-timeline .timeline-body').each(function()
    {
      var id = $(this).attr('id');
      var contentId = '#' + id + ' > script';
      var revisionBody = '#' + id + ' .revision-body';
      var revisionPath = '#' + id + ' .revision-path';
      var renderer = new Crowi.renderer($(contentId).html(), $(revisionBody));
      renderer.render();
    });
    //$('.tooltip .tabs').tabs();
});
