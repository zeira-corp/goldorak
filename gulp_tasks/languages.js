const gulp = require('gulp');

const conf = require('../conf/gulp.conf');

gulp.task('languages', languages);

function languages() {

  var locales = conf.languages.map(function (locale) {
    return conf.path.bower('angular-i18n/angular-locale_' + locale + '.js');
  });

  /**
   * TODO: overwrite the angular-i18n locale by the i18n/angular-locale ones.
   */
  return gulp.src(locales)
    .pipe(gulp.dest(conf.path.dist('i18n/')));
}
