var gulp = require('gulp');
var deployGH = require('gulp-gh-pages');

const conf = require('../conf/gulp.conf');

gulp.task('deploy', deploy);

function deploy() {
  return gulp.src("dist/**/*")
    .pipe(deployGH());
}
