/**
 * 为页面滚动添加缓动效果
 * v0.3.0
 * 需要 jQuery.js
 */
LazyScript.load('jquery', function(global){
  "use strict";

  var $ = global.$ || global.jQuery;
  
  var html = document.documentElement;
  var body = document.body;
  var docEl = html.scrollTop != null ? html : body;

  // 缓动至目标元素或位置
  function inchingTo(options) {
    options = options || {};
    if(!options.target) return;

    // 滚动容器, 如果非 HTML 元素 (如 window), 则使用 $('html,body')
    var scroll = $(options.scroll)[0];
    var isDoc = false;
    if (!(scroll instanceof HTMLElement) || scroll === html || scroll === body) {
      scroll = docEl;
      isDoc = true;
    }
    var $scroll = $(scroll);

    // 目标位置
    var target = options.target;
    if (/^\s*\d+(?:\.\d*)?(?:\s*px)?\s*$/i.test(target)) {
      target = parseFloat(target);
    } else {
      var $target = $(target);
      if (!$target.length) return;
      target = $target.offset().top;
      if (!isDoc) target += $scroll.scrollTop() - $scroll.offset().top;
    }
    target -= parseFloat(options.offset) || 0;

    // 滚动距离与时间
    var distance = Math.abs($scroll.scrollTop() - target);
    var duration = options.duration;
    if (typeof duration === 'function') duration = duration(distance);
    if (/^\d+$/.test(duration)) duration = parseInt(duration);
    else {
      duration = distance < 1 ? 0 : Math.round(Math.max(Math.log(distance) - 2, 1) * 3) * 17;
    }

    // 开始滚动
    if (duration > 0) $scroll.animate({scrollTop: target}, duration);
  }

  // 判断是否锚点链接
  function isAnchor() {
    return this instanceof HTMLElement && 
      this.tagName === 'A' && 
      this.hash && 
      this.hostname === window.location.hostname && 
      this.pathname === window.location.pathname;
  }

  // 获取滚动父容器
  function getScrollParent(node) {
    if (!node || node.tagName == 'BODY') return window;
    var parent = node.parentNode, css;
    while(true) {
      if (parent.tagName == 'BODY') break;
      css = window.getComputedStyle(parent);
      if (css.overflowY == 'scroll' || css.overflowY == 'auto') {
        return parent;
      }
      parent = parent.parentNode
    }
    return window;
  }

  // 使容器缓动至目标位置
  $.fn.inchingTo = function(options) {
    options = options || {};
    options.scroll = options.scroll || this;
    inchingTo(options);
  };

  // 为锚点链接添加点击缓动效果
  $.fn.clickInching = function(options) {
    options = options || {};
    this.filter(isAnchor).on('click.inching', function(e){
      e.preventDefault();
      options.scroll = options.scroll || getScrollParent($(this.hash)[0]);
      options.target = this.hash;
      inchingTo(options);
    });
  };

  // 当页面 URL 中存在锚点时, 为页面的默认跳转行为添加缓动效果
  $.fn.loadInching = function(options) {
    options = options || {};
    options.target = options.target || window.location.hash;
    if (options.target) {
      options.scroll = options.scroll || this;
      var $scroll = $(options.scroll);
      var _top = $scroll.scrollTop();
      $(function(){
        $scroll.scrollTop(_top);
        inchingTo(options);
      });
    }
  };

  global.inchingTo = inchingTo;
});
