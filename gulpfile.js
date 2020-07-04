const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify-es').default;
const gulpif = require('gulp-if');
const cssnano = require('gulp-cssnano');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('scss', () => {
  return (
    gulp
      .src('./src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      // CSS output style (nested | expanded | compact | compressed)
      .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./src/css'))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
});

gulp.task('html', () => {
  return gulp.src('src/*.html').pipe(
    browserSync.reload({
      stream: true,
    })
  );
});

gulp.task('script', () => {
  return gulp.src('src/js/**/*.js').pipe(
    browserSync.reload({
      stream: true,
    })
  );
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './src',
    },
  });
});

gulp.task('useref', () => {
  return gulp
    .src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(
      gulpif(
        '*.css',
        autoprefixer({
          overrideBrowserslist: ['last 8 versions'],
        })
      )
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', () => {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
});

gulp.task('img', () => {
  return gulp.src('src/img/**/*').pipe(gulp.dest('dist/img'));
});

gulp.task('clean', async () => {
  del.sync('dist');
});

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('src/*.html', gulp.parallel('html'));
  gulp.watch('src/js/**/*.js', gulp.parallel('script'));
});

gulp.task('default', gulp.parallel('scss', 'browser-sync', 'watch'));

gulp.task('build', gulp.series('clean', 'useref', 'fonts', 'img'));
