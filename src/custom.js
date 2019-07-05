LazyScript.config({
  debug: false,
  base: 'plugins/',
  suffix: '.min',
});

// 如果使用 lazyscript.jquery.js
// LazyScript.preload('jquery');

LazyScript.load(function(global) {
  // ...
});