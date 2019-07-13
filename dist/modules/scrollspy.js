/*!
 * 滚动监听
 */
LazyScript.load('jquery', 'underscore', function(global){
  "use strict";

  var $ = global.$;
  var _ = global._;

  function Scrollspy(selector, callback) {
    // 被监听的容器
    var $scrollParent = $(selector);

    // 判断被监听容器是否窗口
    var isWindow = $.isWindow($scrollParent[0]);

    var scrollCallback = null,
        options = null,
        $spyTargets = null,
        feedbackTargets = null,
        calcThreshold = null,
        lastSpyTarget = null;

    var spy = {
      // 初始化
      init: function(callback) {
        this.stop();

        scrollCallback = null;
        options = null;
        $spyTargets = null;
        feedbackTargets = null;
        calcThreshold = null;
        lastSpyTarget = null;

        if (typeof callback === 'function') {
          scrollCallback === callback;
        }

        this.start();

        return this;
      },

      // 监听节点
      spy: function(selector, threshold, callback) {
        options = options || new Object(null);
        options.threshold = threshold || 0;
        if (typeof callback === 'function') {
          options.callback = callback;
        } else if (typeof options.callback !== 'function') {
          options.callback = null;
        }

        // 获取阈值
        // 阈值是指被监听窗口上边沿距窗口顶部距离 + options.threshold
        // 阈值用于计算一个被监听元素是否为当前元素
        if (isWindow) {
          calcThreshold = function() {
            return options.threshold;
          };
        } else {
          calcThreshold = function(){
            return $scrollParent[0].getBoundingClientRect().top + options.threshold;
          };
        }

        // 获取被监听元素
        if (!isWindow && typeof selector === 'string') {
          $spyTargets = $scrollParent.find(selector);
        } else {
          $spyTargets = $(selector);
        }
        $spyTargets = $spyTargets.filter(function() {
          return this instanceof HTMLElement;
        });

        // 当前进入窗口的元素
        lastSpyTarget = null;
        this.update();

        return this;
      },

      // 连接一组接收监听反馈的节点
      feedback: function(selector, isRelated, callback) {
        var $targets = $(selector).filter(function() {
          return this instanceof HTMLElement;
        });
        if (!$targets.length) return;

        // 判断是否锚点链接
        function isAnchor(el) {
          return el instanceof HTMLElement && 
            el.tagName === 'A' && 
            el.hash && 
            el.hostname === window.location.hostname && 
            el.pathname === window.location.pathname;
        }
        
        // 指定如何判断被监听节点与接收反馈的节点是相关的
        if (typeof isRelated !== 'function') {
          isRelated = function(el1, el2) {
            return el1.id && isAnchor(el2) && el2.hash === '#'+el1.id;
          };
        }

        // 指定一个回调函数, 当接收到反馈时执行该函数
        if (typeof callback !== 'function') {
          callback = function($toBeActive, $actived) {
            if ($actived) $actived.removeClass('is-active');
            if ($toBeActive) $toBeActive.addClass('is-active');
          };
        }

        // 关联被监听节点与反馈接收节点
        var connected = [];
        $spyTargets.each(function(i, el) {
          $targets.each(function(j, el2){
            if (isRelated(el, el2)) {
              if (!connected[i]) connected[i] = $();
              connected[i] = connected[i].add(el2);
            }
          });
        });

        feedbackTargets = feedbackTargets || []
        feedbackTargets.push({
          elements: connected,
          callback: callback,
        });

        connected = null;
        isRelated = null;
        callback = null;

        lastSpyTarget = null;
        this.update();

        return this;
      },

      // 发生滚动时计算元素位置并更新监听结果
      update: function() {
        if (typeof scrollCallback === 'function') {
          scrollCallback.call($scrollParent[0]);
        }

        if ($spyTargets) {
          // 获取阈值
          var threshold = calcThreshold();
          var current, currentTop = 0;

          // 依次计算每个被监听元素的位置
          // 当被监听窗口上边沿位于某一元素内部时, 被认为
          $spyTargets.each(function(index) {
            var top = this.getBoundingClientRect().top;
            var bottom = top + $(this).outerHeight();
            if (top <= threshold && bottom >= threshold && (current == null || currentTop < top)) {
              current = this;
              currentTop = top;
            }
          });

          // 更新当前元素
          if (current && lastSpyTarget != current) {
            if (options.callback) {
              options.callback(current, lastSpyTarget);
            }
            if (feedbackTargets && feedbackTargets.length) {
              var index = $spyTargets.index(current),
                  currentIndex = $spyTargets.index(lastSpyTarget),
                  fbEls;
              for (var i = 0; i < feedbackTargets.length; i++) {
                fbEls = feedbackTargets[i].elements;
                if (fbEls[index]) {
                  feedbackTargets[i].callback.call(this, fbEls[index], fbEls[currentIndex] || null);
                }
              }
            }
          }
          lastSpyTarget = current;
          current = null;
        }
        return this;
      },

      // 开始监听
      start: function() {
        $scrollParent.on('scroll.spy', _.bind(_.throttle(this.update, 100), this));
        this.update();
        return this;
      },

      // 停止监听
      stop: function() {
        $scrollParent.off('scroll.spy');
        return this;
      },
    };

    // 初始化并返回
    return spy.init(callback);
  }

  $.fn.scrollspy = function(callback) {
    return Scrollspy(this, callback);
  }

  global.Scrollspy = Scrollspy;
});
