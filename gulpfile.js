const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src(['node_modules/underscore/underscore.js', 'src/*.js', '!src/_*.js'])
  .pipe(dest('dist/plugins/'))
  .pipe(uglify())
  .pipe(rename({extname: '.min.js'}))
  .pipe(dest('dist/plugins/'));
}
