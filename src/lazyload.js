/*!
 * Lazy Load - JavaScript plugin for lazy loading images
 */
LazyScript.load('jquery', 'polyfill:IntersectionObserver', function (global) {
  "use strict";

  var $ = global.$ || global.jQuery;

  function Lazyload(options, images) {
    if (!(this instanceof Lazyload)) return new Lazyload(options, images);

    this.settings = $.extend({
      src: "data-src",
      srcset: "data-srcset",
      selector: ".lazyload",
      placeholder: '',
      delay: 0,
    }, options || {});

    this.images = images || document.querySelectorAll(this.settings.selector);
    this.observer = null;
    this.init();

    return this;
  }

  Lazyload.prototype = {
    init: function init() {

      /* Without observers load everything and bail out early. */
      if (!window.IntersectionObserver) {
        this.loadImages();
        return;
      }

      var self = this;
      var observerConfig = {
        root: null,
        rootMargin: "0px",
        threshold: [0]
      };

      this.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0) {
            self.observer.unobserve(entry.target);
            self.loadImage(entry.target);
          }
        });
      }, observerConfig);

      this.images.forEach(function (image) {
        if (self.settings.placeholder) {
          if (image.tagName == 'IMG') {
            image.src = self.settings.placeholder;
          } else {
            image.style.backgroundImage = "url(\"" + src + "\")";
          }
        }
        self.observer.observe(image);
      });
    },

    loadAndDestroy: function loadAndDestroy() {
      if (!this.settings) { return; }
      this.loadImages();
      this.destroy();
    },

    loadImages: function loadImages() {
      if (!this.settings) { return; }

      var self = this;
      this.images.forEach(function (image) {
        self.loadImage(image);
      });
    },

    loadImage: function loadImage(image) {
      var src = image.getAttribute(this.settings.src);
      var srcset = image.getAttribute(this.settings.srcset);
      var settings = this.settings;

      setTimeout(function() {

        if ("IMG" == image.tagName) {
          if (typeof settings.onerror === 'function') {
            image.onerror = function(){
              settings.onerror.call(this);
            }
          }
          if (typeof settings.onload === 'function') {
            image.onload = function(){
              settings.onload.call(this);
            }
          }

          if (src) {
            image.src = src;
          }
          if (srcset) {
            image.srcset = srcset;
          }
        } else {
          var img = new Image();
          if (typeof settings.onerror === 'function') {
            img.onerror = function(){
              settings.onerror.call(image);
            }
          }
          if (typeof settings.onload === 'function') {
            img.onload = function(){
              settings.onload.call(image);
            }
          }
          image.style.backgroundImage = "url(" + src + ")";
          img.src = src;
        }
      }, settings.delay);
    },

    destroy: function destroy() {
      if (!this.settings) { return; }
      this.observer.disconnect();
      this.settings = null;
    }
  };

  $.fn.lazyload = function (options) {
    return new Lazyload(options, $.makeArray(this));
  };

  global.Lazyload = Lazyload;
});
