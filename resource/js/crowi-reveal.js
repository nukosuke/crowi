var $ = require('jquery');
var head = require('head');
var html5shiv = require('html5shiv');
var Reveal = require('reveal');

Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  transition: 'slide',

  // Optional libraries used to extend on reveal.js
  dependencies: [
    { src: '/bower_components/reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: '/bower_components/reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '/bower_components/reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: '/bower_components/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: '/bower_components/reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
    { src: '/bower_components/reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
  ]
});

Reveal.addEventListener('ready', function(event) {
  // event.currentSlide, event.indexh, event.indexv
  $('.reveal section').each(function(e) {
    var $self = $(this);
    if ($self.children().length == 1) {
      $self.addClass('only');
    }
  });
});
