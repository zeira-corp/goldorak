var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

const conf = require('../conf/gulp.conf');

gulp.task('deploy', deploy);

function deploy() {
  return gulp.src(conf.path.dist('**/*'))
    .pipe(ghPages());
}
