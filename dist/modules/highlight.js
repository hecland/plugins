/**
 * 常用 js 工具
 */
LazyScript.load('jquery', function(global){
  "use strict";

  var $ = global.$ || global.jQuery;

  // 高亮菜单
  $.fn.highlight = function(opt) {

    opt = $.extend({
      class: 'is-active',
      links: 'a[href]',
      light: null,   // 回调函数
      test: 'both', // url, dom
    }, opt || {});

    if (typeof opt.light != 'function') {
      opt.light = function(cls) {
        $(this).parent('li').addClass(cls);
      };
    }

    function completeURL(url) {
      if (!(/\/|\.\w+$/.test(url))) {
        url += '/';
      }
      if (url.slice(-1) === '/') url += 'index.html';
      return url;
    }

    var thisURL = completeURL(location.pathname);
    
    var trail = [];
    var path = '/';
    var subpath = thisURL.split('/').slice(1, -1);
    for (var i = 0; i < subpath.length; i++) {
      path += subpath[i] + '/';
      trail.push(path);
    }
    trail.push(thisURL);

    this.each(function() {
      var menu = this;
      var $links = $(this).find(opt.links).filter('a[href]');
      var $targets = $();

      if (opt.test == 'both' || opt.test == 'dom') {
        $links.each(function() {
          if (completeURL(this.pathname) !== thisURL) return true;
          var $related = $(this).parentsUntil(menu).children('a[href]');
          if (opt.links !== 'a[href]') {
            $related = $related.filter(function() {
              return $(this).is(opt.links);
            });
          }
          $targets = $targets.add($related);
        });
      }

      if (opt.test == 'both' || opt.test == 'url') {
        $targets = $targets.add($links.filter(function() {
          return trail.indexOf(completeURL(this.pathname)) >= 0;
        }));
      }

      $targets.each(function() {
        opt.light.call(this, opt.class);
      });
    });
  };

  global.highlight = function(selector, opt) {
    $(selector).highlight(opt);
  };
});
