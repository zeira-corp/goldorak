var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

const conf = require('../conf/gulp.conf');

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
