const { src, dest, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

function LazyScript() {
  return src(['src/LazyScript.js'])
    .pipe(dest('dist/'))
    .pipe(uglify())
    .pipe(rename('lazyscript.min.js'))
    .pipe(dest('dist/'));
}

function LazyScriptJquery() {
  return src(['node_modules/jquery/dist/jquery.js', 'src/LazyScript.js', 'src/jquery.preload.js'])
    .pipe(concat('lazyscript.jquery.js'))
    .pipe(dest('dist/'))
    .pipe(uglify())
    .pipe(rename('lazyscript.jquery.min.js'))
    .pipe(dest('dist/'));
}

function customjs() {
  return src(['src/custom.js'])
    .pipe(dest('dist/'));
}

function otherjs() {
  return src(['node_modules/underscore/underscore.js', 'src/*.js', '!src/_*.js', '!src/LazyScript.js', '!src/jquery.preload.js'])
  .pipe(dest('dist/src/'))
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(dest('dist/src/'));
}

exports.default = parallel(LazyScript, LazyScriptJquery, customjs, otherjs);
