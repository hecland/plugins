/*!
 * 滚动监听
 */
LazyScript.load('jquery', 'underscore', function(global){
  "use strict";

  var $ = global.$;
  var _ = global._;

  function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  }

  function isSelector(val) {
    return val && (typeof val === 'string' || val instanceof HTMLElement || val instanceof $)
  }

  function isClassName(val) {
    return typeof val === 'string' && val.trim().length
  }

  function Scrollspy(options) {
    // 被监听的容器
    var _$container = $(window);

    // 感测线位置（相对于容器顶部）
    var _sensor = .2;

    // 感测线位置数据的单位，'px' 或 '%'
    var _unit = '%';

    if (isSelector(options) || options === document || options === window) {

      _$container = $(options);

    }

    // 从 options 提取设置值
    else if (isObject(options)) {

      // 提取容器信息
      if (options.container) {
        _$container = $(options.container);
      }

      // 提取感测线位置值，以及确定值的单位
      if (options.sensor) {
        _sensor = parseFloat(options.sensor)
        if (isNaN(_sensor)) {
          _sensor = .2
          _unit = '%'
        } else {
          if (options.sensor.substr(-1) === '%') {
            _unit = '%'
            _sensor /= 100
          } else {
            _unit = 'px'
            _sensor = Math.round(_sensor)
          }
        }
      }
    }

    // 确保窗口有效
    if (! _$container.length || !(_$container[0] === window || _$container[0] instanceof HTMLElement)) {
      _$container = $(window);
    }

    var _isWindow = _$container[0] === window;

    // 根据滚动窗口、感测线位置值单位、感测线位置值正负三个特征，确定获取感测线位置的方法
    var _getSensorOffsetTop = (function() {
      if (_isWindow) {
        if (_unit === '%') {
          if (_sensor < 0) {
            return function() {
              return _$container.height() * (1 - _sensor)
            }
          } else {
            return function() {
              return _$container.height() * _sensor
            }
          }
        } else {
          if (_sensor < 0) {
            return function() {
              return _$container.height() - _sensor
            }
          } else {
            return function() {
              return _sensor
            }
          }
        }
      } else {
        if (_unit === '%') {
          if (_sensor < 0) {
            return function() {
              return _$container[0].getBoundingClientRect().top + _$container.height() * (1 - _sensor)
            }
          } else {
            return function() {
              return _$container[0].getBoundingClientRect().top + _$container.height() * _sensor
            }
          }
        } else {
          if (_sensor < 0) {
            return function() {
              return _$container[0].getBoundingClientRect().top + _$container.height() - _sensor
            }
          } else {
            return function() {
              return _$container[0].getBoundingClientRect().top + _sensor
            }
          }
        }
      }
    })();

    var _$anchors = $();
    var _$targets = $();

    return {
      feedback: function(targets, active) {
        this.stop();

        _$targets = $(targets);
    
        if (! _$targets.is('a[href^="#"]')) {
          _$targets = _$targets.find('a[href^="#"]');
        }
        _$targets = _$targets.filter(function(){
          return $(this).is('a[href^="#"]')
        })

        if (! _$targets.length) {
          return
        }

        active = isClassName(active) ? active : 'is-active';

        _$anchors = $();
        _$targets.each(function() {
          var feedbackTarget = this;
          var anchor = getAnchor(this);
          if (anchor instanceof HTMLElement) {
            _$anchors = _$anchors.add(anchor);
            $(anchor).on('strike', function() {
              _$targets.removeClass(active)
              $(feedbackTarget).addClass(active)
            })
          }
        })

        if (_$anchors.length) {
          this.start();
        }

        function getAnchor(feedbackTarget) {
          var target = feedbackTarget.getAttribute('href');
          return _isWindow ? $(target)[0] : _$container.find(target)[0]
        }
      },

      // 发生滚动时计算元素位置并更新监听结果
      update: function() {
        var threshold = _getSensorOffsetTop();
        for (var index = 0, len = _$anchors.length; index < len; index++) {
          var anchor = _$anchors[index];
          var rect = anchor.getBoundingClientRect();
          if (threshold >= rect.top && threshold <= rect.top + rect.height) {
            $(anchor).trigger('strike');
            break
          }
        }

        return this;
      },

      // 开始监听
      start: function() {
        _$container.off('scroll.spy').on('scroll.spy', _.bind(_.throttle(this.update, 100), this));
        this.update();
        return this;
      },

      // 停止监听
      stop: function() {
        _$container.off('scroll.spy');
        return this;
      },
    }
  }

  $.fn.scrollspy = function(options) {
    options = isObject(options) ? options : {}
    options.container = this
    return Scrollspy(options);
  }

  global.Scrollspy = Scrollspy;
});
