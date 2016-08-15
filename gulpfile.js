const gulp         = require('gulp'),
      babel        = require('gulp-babel'),
      cleanCSS     = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      uglify       = require('gulp-uglify'),
      browserSync  = require('browser-sync').create(),
      browserify   = require('gulp-browserify'),
      concatCss = require('gulp-concat-css');

gulp.task('minify:css', function() {
  return gulp.src('styles/*.css')
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(concatCss('style.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

gulp.task('minify:js', function() {
  return gulp.src('scripts/bundle.js')
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('index.html')
    .pipe(browserSync.stream());
});

gulp.task('serve', ['minify:css','minify:js'], function() {
  browserSync.init({
    server: {
      baseDir : './'
    }
  });

  gulp.watch('scripts/**/*.js', ['minify:js']);
  gulp.watch('styles/*.css', ['minify:css']);
  gulp.watch('index.html', ['html']);
});

gulp.task('default', ['serve']);
