/**
 * 导航菜单
 */
LazyScript.load('jquery', function (global) {
  "use strict";

  var $ = global.$ || global.jQuery;

  var animationEnd = (function (el) {
    var animations = {
      animation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd',
    };
    for (var t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  })(document.createElement('div'));

  // 定位子菜单时, 与边界的最小间距
  var MARGIN = 20;

  // 子菜单对象, 主要用于管理子菜单的淡入淡出动画
  function Submenu(menu, options) {
    this.$menu = $(menu);
    this.$branch = this.$menu.parent();

    this.opts = $.extend({}, options);
    this._level = this.$branch.parent().hasClass('menu__mainmenu') ? 1 : 2;
    this._side = 'Bottom';

    return this;
  }

  Submenu.prototype = {
    constructor: Submenu,

    // 根据模式进行初始化
    init: function(mode) {
      if (mode === 'sm') {
        this.$menu.hide();
        this.$branch.off('mouseenter mouseleave').css({
          'display': null,
          'clip': null,
        });
      } else if (mode === 'lg') {
        var _self = this;
        var $submenu = this.$menu;

        this.$menu.css({
          'display': 'block',
          'clip': 'rect(0px, 0px, 0px, 0px)',
        }).parent().on('mouseenter', function (e) {
          if ($submenu[0] === e.target || $submenu.has(e.target).length) return;
          $(this).addClass('menu__item--open');
          _self.show();
        }).on('mouseleave', function () {
          $(this).removeClass('menu__item--open');
          _self.hide();
        });
      }
    },

    // 定位子菜单
    findPosition: function () {
      var itemRect = this.$branch[0].getBoundingClientRect();
      var menuRect = this.$menu[0].getBoundingClientRect();
      var left, top;
      if (this._level < 2) {
        top = itemRect.top + itemRect.height;
        left = Math.max(Math.min(itemRect.left, window.innerWidth - menuRect.width - MARGIN), MARGIN);
        this._side = 'Bottom';
      } else {
        top = itemRect.top;
        left = itemRect.left + itemRect.width;
        this._side = 'Right';
        if (left + menuRect.width + MARGIN > window.innerWidth && itemRect.left - menuRect.width > 0) {
          left = itemRect.left - menuRect.width;
          this._side = 'Left';
        }
      }
      this.$menu.css({
        top: top + 'px',
        left: left + 'px',
      });
      return this;
    },

    // 开始动画
    animate: function(animation, callback) {
      // 停止正在进行的动画
      this.stop();

      var $menu = this.$menu;
      this.status = {
        "animation": animation,
        "display": $menu.css('display'),
      };
      this.callback = callback;

      var _self = this;
      $menu.css({ display: 'block' }).one(animationEnd, function () {
        _self.stop();
        if (typeof _self.callback === 'function') _self.callback();
      }).addClass(animation);

      return this;
    },

    // 结束动画
    stop: function() {
      if (this.status) {
        this.$menu.removeClass(this.status.animation).css({'display': this.status.display});
        this.status = null;
      }
      return this;
    },

    // 显示菜单
    show: function () {
      var $menu = this.$menu;
      this.findPosition();
      if (this.opts.animate) {
        this.animate('submenuAnimated animateInFrom' + this._side)
      }
      $menu.css({'clip':'auto'});
    },

    // 隐藏菜单
    hide: function () {
      var $menu = this.$menu;
      if (this.opts.animate) {
        this.animate('submenuAnimated animateOutTo' + this._side, function() {
          $menu.css({'clip':'rect(0,0,0,0)'});
        });
      } else {
        $menu.css({'clip':'rect(0,0,0,0)'});
      }
    },
  };

  function Navmenu($menu, options) {
    // 设置
    options = $.extend({
      // 模式切换的临界宽度
      breakpoint: 992,

      // 是否自动切换模式
      autoSwitch: false,

      // 是否有子菜单动画
      animate: true,
    }, options || {});

    // 确保 breakpoint > 0
    options.breakpoint = options.breakpoint > 0 ? options.breakpoint : 992;

    // 根元素
    this.$root = $menu;

    // 主菜单
    this.$mainmenu = this.$root.find('.menu__mainmenu');

    // 所有子菜单
    var submenus = [];
    this.$root.find('.menu__submenu').each(function () {
      submenus.push(new Submenu(this, options));
    });
    this.submenus = submenus;

    this.$btns = this.$root.find('.menu__btn,.menu__toggle');

    // 查询当前窗口宽度
    var mediaQuery = matchMedia('(min-width: ' + options.breakpoint + 'px)');

    // 根据当前窗口宽度调整模式
    this.switchMode(mediaQuery.matches ? 'lg' : 'sm');

    // 模式自动切换
    if (options.autoSwitch) {
      var menu = this;
      mediaQuery.addListener(function () {
        menu.switchMode(this.matches ? 'lg' : 'sm');
      });
    }

    return this;
  }

  Navmenu.prototype = {
    constructor: Navmenu,

    // 模式切换
    switchMode: function (mode) {

      var open = 'menu__item--open';

      for (var i = 0, len = this.submenus.length; i < len; i++) {
        this.submenus[i].init(mode);
      }

      if (mode === 'sm') {
        // 添加按钮 click 事件
        this.$btns.off('click').on('click', function (e) {
          e.stopPropagation();
          $(this).parent().toggleClass('menu__item--open').children('.menu__mainmenu,.menu__submenu').slideToggle(120);
        });

        // 隐藏主菜单, 并去掉父级菜单项的 menu__item--open 类名
        this.$mainmenu.hide().parent().removeClass(open);

      } else if (mode === 'lg') {
        // 清除按钮的 click 事件
        this.$btns.off('click');

        // 显示主菜单, 并去掉父级菜单项的 menu__item--open 类名
        this.$mainmenu.show().parent().removeClass(open);
      }
    },
  };

  $.fn.navmenu = function (options) {
    return new Navmenu(this, options);
  };
});
