var gulp = require('gulp');
var deployGH = require('gulp-gh-pages');

const conf = require('../conf/gulp.conf');

gulp.task('deploy', deploy);

function deploy() {
  return gulp.src(conf.path.dist("/**/*"))
    .pipe(deployGH());
}
