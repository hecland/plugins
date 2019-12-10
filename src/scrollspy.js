/**
 * Version 0.2.0
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
    return val && typeof val === 'string' && val.trim().length
  }

  function isFunction(val) {
    return val && typeof val === 'function'
  }

  function Scrollspy(options) {

    // 待检测元素
    var _$anchors = $();

    // 接收反馈的锚点链接
    var _$targets = $();

    // 使用 options 提取参数
    if (isSelector(options) || options === document || options === window) {
      options = {
        container: options
      }

      _$container = $(options);

    } else if (! isObject(options)) {
      options = {}

      // // 提取容器信息
      // if (options.container) {
      //   _$container = $(options.container);
      // }

      // if (options.method) {
      //   _method = options.method
      // }
    }

    // 被监听的容器
    var _$container = $(options.container || window);

    // 确保窗口有效
    if (! _$container.length || !(_$container[0] === window || _$container[0] instanceof HTMLElement)) {
      _$container = $(window);
    }

    var _isWindow = _$container[0] === window;

    // 获取容器的 BoundingRect
    var _getContainerRect = (function() {
      if (_isWindow) {
        return function() {
          var width = _$container.width();
          var height = _$container.height();
          return {
            x: 0,
            y: 0,
            width: width,
            height: height,
            top: 0,
            right: width,
            bottom: height,
            left: 0,
          }
        }
      }
      return function() {
        return _$container[0].getBoundingClientRect()
      }
    })();

    // 设置检测器
    var _sensor = {
      position: .2, // 检测器位置（相对于容器顶部）
      unit: '%',    // 检测器位置单位，'px' 或 '%'
      current: null,
    };

    // 从 options 提取检测线位置值，以及确定值的单位
    if (options.offset) {
      _sensor.position = parseFloat(options.offset)
      if (isNaN(_sensor.position)) {
        _sensor.position = .2
        _sensor.unit = '%'
      } else {
        if (options.offset.substr(-1) === '%') {
          _sensor.position /= 100
          _sensor.unit = '%'
        } else {
          _sensor.position = Math.round(_sensor.position)
          _sensor.unit = 'px'
        }
      }
    }

    // 根据滚动窗口、检测线位置值单位、检测线位置值正负三个特征，确定获取检测线位置的方法
    _sensor.getPosition = (function() {
      if (_sensor.unit === '%') {
        if (_sensor.position >= 0) {
          return function() {
            var containerRect = _getContainerRect();
            return containerRect.top + containerRect.height * this.position
          }
        } else {
          return function() {
            var containerRect = _getContainerRect();
            return containerRect.top + containerRect.height * (1 - this.position)
          }
        }
      } else {
        if (_sensor.position >= 0) {
          return function() {
            var containerRect = _getContainerRect();
            return containerRect.top + this.position
          }
        } else {
          return function() {
            var containerRect = _getContainerRect();
            return containerRect.top + containerRect.height - this.position
          }
        }
      }
    })();

    // 检测一个元素与容器的交叉百分比
    function _getIntersection(anchor) {
      var rect = anchor.getBoundingClientRect();
      var containerRect = _getContainerRect();
      if (rect.bottom <= containerRect.top || rect.top >= containerRect.bottom) {
        return 0
      }
      var top = Math.max(rect.top, containerRect.top);
      var bottom = Math.min(rect.bottom, containerRect.bottom);
      return (bottom - top) / rect.height
    };

    // 使用 near 方式获取『当前元素』
    function _getNearAnchor() {
      var threshold = _sensor.getPosition();
      var current = null, currentDistance = 999999;
      for (var index = 0, len = _$anchors.length; index < len; index++) {
        var anchor = _$anchors[index];
        if (_getIntersection(anchor) <= 0) {
          continue
        }
        var rect = anchor.getBoundingClientRect();
        var distance = Math.abs(threshold - (rect.top + rect.height/2));
        if (distance < currentDistance) {
          current = anchor;
          currentDistance = distance;
        }
      }
      return current
    };

    // 使用 strike 方式获取『当前元素』
    function _getStrikeAnchor() {
      var threshold = _sensor.getPosition();
        for (var index = 0, len = _$anchors.length; index < len; index++) {
          var anchor = _$anchors[index];
          var rect = anchor.getBoundingClientRect();
          if (threshold >= rect.top && threshold <= rect.top + rect.height) {
            return anchor;
          }
        }
        return null
    };

    // 确定检测『当前元素』的方法
    switch(options.method) {
      case 'strike':
        _sensor.getCurrent = function() {
          return _getStrikeAnchor();
        }
        break;

      case 'near':
        _sensor.getCurrent = function() {
          return _getNearAnchor();
        }
        break;

      default:
        _sensor.getCurrent = function() {
          return _getStrikeAnchor() || _getNearAnchor();
        }
        break;
    }

    // 设置反馈器
    var _feedback = {
      cls: 'is-active',
      active: function(target, cls) {
        $(target).addClass(cls)
      },
      deactive: function(target, cls) {
        $(target).removeClass(cls)
      },
    };

    return {
      version: '0.2.0',
      feedback: function(targets, active, deactive) {
        this.stop();

        // 筛选出锚点链接
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

        // 设置正反馈方式（高亮链接）
        if (isClassName(active)) {
          _feedback.cls = active
        } else if (isFunction(active)) {
          _feedback.active = active
        }

        // 设置负反馈方式（取消链接高亮）
        if (isFunction(deactive)) {
          _feedback.deactive = deactive
        }

        _$anchors = $();
        _$targets.each(function() {
          var target = this;
          var anchor = getAnchor(this);
          if (anchor instanceof HTMLElement) {
            _$anchors = _$anchors.add(anchor);
            $(anchor).on('strike', function() {
              _feedback.active(target, _feedback.cls)
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

        return this;
      },

      // 发生滚动时计算元素位置并更新监听结果
      update: function() {
        var current = _sensor.getCurrent();

        if (current !== _sensor.current) {
          _$targets.each(function(){ _feedback.deactive(this, _feedback.cls) })
          _sensor.current = current
        }

        if (current) {
          $(current).trigger('strike')
        }

        return this;
      },

      // 开始监听
      start: function() {
        _$targets.each(function(){ _feedback.deactive(this, _feedback.cls) })
        _$container.off('scroll.spy').on('scroll.spy', _.bind(_.throttle(this.update, 100), this));
        this.update();
        return this;
      },

      // 停止监听
      stop: function() {
        _$targets.each(function(){ _feedback.deactive(this, _feedback.cls) })
        _$container.off('scroll.spy');
        return this;
      },

      // 查看检测器配置
      sensor: function() {
        return {
          position: _sensor.position,
          unit: _sensor.unit,
          current: _sensor.current,
        }
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
