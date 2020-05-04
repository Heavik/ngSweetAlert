const gulp = require('gulp');
const minify = require('gulp-minify');
 
gulp.task('compress', function() {
  gulp.src(['SweetAlert.js'])
    .pipe(minify({ ext: '.min.js' }))
    .pipe(gulp.dest('./'))
});