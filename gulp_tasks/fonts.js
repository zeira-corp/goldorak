const gulp = require('gulp');

const conf = require('../conf/gulp.conf');

gulp.task('fonts', fonts);

function fonts() {
  /**
   *  TODO: Dest should be in the content folder but a CSS processor seems to rewrite
   *  "/bower_components" in "/"
   */
  return gulp.src(conf.path.bower('font-awesome/fonts/*.*'))
    .pipe(gulp.dest(conf.path.dist('fonts/')));
}
