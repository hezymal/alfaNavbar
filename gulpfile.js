/*eslint-env node*/

// for build
const gulp = require('gulp');
const concat = require('gulp-concat');
const config = require('./package.json');

// for CSS
const stylus = require('gulp-stylus');
const nib = require('nib');
const csso = require('gulp-csso');

// for JS
const uglify = require('gulp-uglify');



// configuration
const options = {
    clean: {
        selector: ['./dist/**', '!./dist']
    },
    js: {
        source: ['./src/**/*.js'],
        build: './dist/',
        devName: config.name + '.js',
        minName: config.name + '.min.js'
    },
    stylus: {
        source: ['./src/**/*.styl'],
        build: './dist/',
        devName: config.name + '.css',
        minName: config.name + '.min.css'
    }
};



gulp.task('clean', () => {
    const del = require('del');
    
    del(options.clean.selector, { force: true, dryRun: true })
});



gulp.task('iterate', () => {
    const fs = require('fs');
    const semver = require('semver');
    const space = '  ';

    config.version = semver.inc(config.version, 'patch');

    fs.writeFile("package.json", JSON.stringify(config, null, space));
}); 



gulp.task('js', function() {
    gulp.src(options.js.source)
        .pipe(concat(options.js.devName))
        .pipe(gulp.dest(options.js.build));
});



gulp.task('js-min', function() {
    gulp.src(options.js.source)
        .pipe(uglify())
        .pipe(concat(options.js.minName))
        .pipe(gulp.dest(options.js.build));
});



gulp.task('stylus', function() {
    gulp.src(options.stylus.source)
        .pipe(stylus({ use: nib() }))
        .on('error', console.error.bind(console))
        .pipe(concat(options.stylus.devName))
        .pipe(gulp.dest(options.stylus.build));
});



gulp.task('stylus-min', function() {
    gulp.src(options.stylus.source)
        .pipe(stylus({ use: nib() }))
        .pipe(csso())
        .pipe(concat(options.stylus.minName))
        .pipe(gulp.dest(options.stylus.build));
});



gulp.task('watch', ['js', 'stylus'], function() {
    gulp.watch(options.js.source, ['js']);
    gulp.watch(options.stylus.source, ['stylus']);
});



gulp.task('build', ['clean', 'iterate', 'js', 'js-min', 'stylus', 'stylus-min']);
gulp.task('default', ['clean', 'watch']);
