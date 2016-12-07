const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('bower');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const sh = require('shelljs');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const beautify = require('gulp-beautify');
const notify = require('gulp-notify');

const paths = {
    sass: ['./scss/**/*.scss'],
    js: ['./www/js/**/*.js']
};

gulp.task('default', ['beautify-js']);

gulp.task('sass', (done) => {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', () => {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], () => {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', (done) => {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

gulp.task('beautify-js', () => {
    const destination = './www/js';
    return gulp.src(paths.js)
        .pipe(beautify({indent_size: 4}))
        .pipe(gulp.dest(destination));
});

gulp.task('compile-bundle', () => {
    const destination = './www';
    return gulp.src(paths.js)
        .pipe(concat('bundle.js'))
        .pipe(babel())
        .pipe(notify('Compiled <%= file.relative %>'))
        .pipe(gulp.dest(destination));
});

const watchJsDependencies = ['compile-bundle'];
gulp.task('watch-js', watchJsDependencies, () => {
    return gulp.watch(paths.js, watchJsDependencies);
});
