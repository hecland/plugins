;(function(root, factory){
    factory(root.jQuery);
})(window, function($) {

    var animationEnd = (function(el) {
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

    var MARGIN = 20;
    var ANIMATION = {
        in: {
            bottom: 'animateInFromBottom',
            left: 'animateInFromLeft',
            right: 'animateInFromRight',
        },
        out: {
            bottom: 'animateOutToBottom',
            left: 'animateOutToLeft',
            right: 'animateOutToRight',
        },
    };

    $.fn.cssAnimate = function(animation, callback) {
        var display = this.css('display');
        this.css({display:'block'}).one(animationEnd, function() {
            $(this).removeClass(animation).css({
                'display': display
            });
            if (typeof callback === 'function') callback.call($(this));
        }).addClass(animation);
        return this;
    };

    function Submenu($menu, options) {
        this._$menu = $menu;
        this._opts = $.extend({}, options);
        this._$item = $menu.parent();
        this._level = this._$item.parent().hasClass('menu__mainmenu') ? 1 : 2;
        this._side = 'bottom';
        return this;
    }

    Submenu.prototype = {
        constructor: Submenu,
        position: function() {
            var itemRect = this._$item[0].getBoundingClientRect();
            var menuRect = this._$menu[0].getBoundingClientRect();
            var left, top;
            if (this._level < 2) {
                top = itemRect.top + itemRect.height;
                left = Math.max(Math.min(itemRect.left, window.innerWidth - menuRect.width - MARGIN), MARGIN);
                this._side = 'bottom';
            } else {
                top = itemRect.top
                left = itemRect.left + itemRect.width;
                this._side = 'right';
                if (left + menuRect.width + MARGIN > window.innerWidth && itemRect.left - menuRect.width > 0) {
                    left = itemRect.left - menuRect.width;
                    this._side = 'left';
                }
            }
            this._$menu.css({
                top: top + 'px',
                left: left + 'px',
            });
            return this;
        },

        show: function() {
            this._$menu.css({'clip':'auto'});
            if (this._opts.animate) this._$menu.cssAnimate('submenuAnimated '+ANIMATION.in[this._side]);
        },

        hide: function() {
            if (this._opts.animate) {
                this._$menu.cssAnimate('submenuAnimated '+ANIMATION.out[this._side], function(){
                    this.css({'clip':'rect(0,0,0,0)'});
                });
            } else {
                this._$menu.css({'clip':'rect(0,0,0,0)'});
            }   
        },
    };

    function Navmenu($menu, options) {
        this._$root = $menu;

        options = $.extend({
            breakPoint: 992,
            auto: false,
            animate: false,
        }, options || {});
        options.breakPoint = options.breakPoint > 0 ? options.breakPoint : 992;

        $menu.find('.menu__item--branch').each(function(){
            this._submenu = new Submenu($(this).children('.menu__submenu'), options);
        });
        
        this._opts = options;

        var mediaQuery = matchMedia('(min-width: ' + this._opts.breakPoint + 'px)');
        this._mode = mediaQuery.matches ? 'lg' : 'sm';
        if (this._opts.auto) {
            var mainmenu = this;
            mediaQuery.addListener(function(){
                mainmenu._mode = this.matches ? 'lg' : 'sm';
                mainmenu.modeSwitch();
            });
        }
        this.modeSwitch();
        return this;
    }

    Navmenu.prototype = {
        constructor: Navmenu,
        modeSwitch: function() {
            if (this._mode === 'sm') {
                this._$root.find('.menu__submenu').parent().off('mouseenter mouseleave').css({
                        'display': '',
                        'clip': '',
                    });
                this._$root.find('.menu__btn, .menu__toggle').off('click').on('click', function(e) {
                        e.stopPropagation();
                        console.log(this);
                        $(this).parent().toggleClass('menu__item--open').children('.menu__mainmenu, .menu__submenu').slideToggle(120);
                    }).siblings('.menu__mainmenu, .menu__submenu').hide().parent().removeClass('menu__item--open');

            } else {
                this._$root.find('.menu__btn, .menu__toggle').off('click')
                    .siblings('.menu__mainmenu, .menu__submenu').show()
                    .parent().removeClass('menu__item--open');

                this._$root.find('.menu__submenu').css({
                    'display': 'block',
                    'clip': 'rect(0px, 0px, 0px, 0px)',
                }).parent().on('mouseenter', function() {
                    $(this).addClass('menu__item--open');
                    this._submenu.position().show();
                }).on('mouseleave', function() {
                    var $this = $(this);
                    $(this).removeClass('menu__item--open');
                    this._submenu.hide();
                });
            }
        },
    };

    $.fn.navmenu = function(options) {
        return new Navmenu(this, options);
    };
});
