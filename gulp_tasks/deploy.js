var gulp        = require('gulp');
var deployGH    = require('gulp-gh-pages');

gulp.task('deploy', deploy);

function deploy() {
  return gulp.src("./dist/**/*")
    .pipe(deployGH());
}
