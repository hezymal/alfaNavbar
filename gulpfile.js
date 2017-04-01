// for build
const gulp = require('gulp');
const concat = require('gulp-concat');
const config = require('./package.json');


// configuration
const options = {

    clean: {

        selector: ['./dist/**', '!./dist'],

    },

    js: {

        source: `./src/${config.name}.js`,
        build: './dist/',
        devName: config.name + '.js',
        minName: config.name + '.min.js',

    },

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



gulp.task('js', () => {

    const babel = require('gulp-babel');
    const browserify = require('gulp-browserify');

    return gulp
        .src(options.js.source)
        .pipe(browserify({
            insertGlobals : false,
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat(options.js.devName))
        .pipe(gulp.dest(options.js.build));

});



gulp.task('js-min', () => {

    const babel = require('gulp-babel');
    const browserify = require('gulp-browserify');
    const uglify = require('gulp-uglify');

    return gulp
        .src(options.js.source)
        .pipe(browserify({
            insertGlobals : false,
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat(options.js.minName))
        .pipe(gulp.dest(options.js.build));

});



gulp.task('watch', ['js'], () => {

    gulp.watch(options.js.source, ['js']);

});



gulp.task('build', ['clean', 'iterate', 'js', 'js-min']);
gulp.task('default', ['clean', 'watch']);