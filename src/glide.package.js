LazyScript.load('jquery', 'glide', function(global){
  "use strict";

  var $ = global.$ || global.jQuery;
  var Glide = global.Glide;

  $.extend(Glide.prototype, {
    isStart: function() {
      return this._c.Run.isStart();
    },
    isEnd: function() {
      return this._c.Run.isEnd();
    },
    emit: function(event) {
      event && this._e.emit(event);
    },
  });

  Object.defineProperty(Glide.prototype, 'count', {
    get: function() {
      return this._c.Run.length + 1;
    },
  });

  $.fn.glide = function(settings) {
    if (!this.length || !(this[0] instanceof HTMLElement)) return;

    var $slidesWrapper = this.find('.glide__slides');
    var $track = this.find('.glide__track');
    if (!$track.length) {
      $slidesWrapper.wrap('<div class="glide__track">');
      $track = $slidesWrapper.parent();
    }
    $track.attr('data-glide-el', 'track');

    settings = $.extend({
      type: 'carousel',
      autoplay: 5000,
      animationDuration: 600,
    }, settings);

    if (settings.rewind == null) {
      settings.rewind = false;
      if (settings.loop != null) settings.rewind = !!settings.loop;
      else if (settings.type === 'carousel') settings.rewind = true;
    }

    var glide = new Glide(this[0], settings);

    // 补全左右切换按钮
    if (glide.settings.arrows) {
      var $arrowsWrapper = this.find('.glide__arrows');
      if (!$arrowsWrapper.length) {
        $arrowsWrapper = $('<div class="glide__arrows">').appendTo(this);
      }
      $arrowsWrapper.attr('data-glide-el', 'controls');

      while ($arrowsWrapper[0].children.length < 2) {
        $('<button class="glide__arrow">').appendTo($arrowsWrapper);
      }
      var $arrows = $arrowsWrapper.children();

      $arrows.eq(0).addClass('glide__arrow--left').attr('data-glide-dir', '<');
      $arrows.eq(1).addClass('glide__arrow--right').attr('data-glide-dir', '>');
    }

    // 补全点状导航
    if (glide.settings.bullets) {
      var $bulletsWrapper = this.find('.glide__bullets');
      if (!$bulletsWrapper.length) {
        $bulletsWrapper = $('<div class="glide__bullets">').appendTo(this);
      }
      $bulletsWrapper.attr('data-glide-el', 'controls[nav]');

      var slides = $slidesWrapper.children();
      while ($bulletsWrapper[0].children.length < slides.length) {
        $('<button class="glide__bullet">').appendTo($bulletsWrapper);
      }
      $bulletsWrapper.children().each(function(index, el){
        el.setAttribute('data-glide-dir', '='+index);
      });
    }

    glide.mount();

    return glide;
  };
});
