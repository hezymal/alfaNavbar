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

        source: `./src/js/${config.name}.js`,
        build: './dist/',
        devName: config.name + '.js',
        minName: config.name + '.min.js',

    },

    stylus: {

        source: './src/stylus/**/*.styl',
        build: './dist/',
        devName: config.name + '.css',
        minName: config.name + '.min.css',

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



gulp.task('stylus', () => {

    const stylus = require('gulp-stylus');
    const nib = require('nib');

    return gulp
        .src(options.stylus.source)
        .pipe(stylus({ use: nib() }))
        .on('error', console.error.bind(console))
        .pipe(concat(options.stylus.devName))
        .pipe(gulp.dest(options.stylus.build));
});



gulp.task('stylus-min', () => {

    const stylus = require('gulp-stylus');
    const nib = require('nib');
    const csso = require('gulp-csso');

    return gulp
        .src(options.stylus.source)
        .pipe(stylus({ use: nib() }))
        .pipe(csso())
        .pipe(concat(options.stylus.minName))
        .pipe(gulp.dest(options.stylus.build));

});



gulp.task('watch', ['js', 'stylus'], () => {

    gulp.watch(options.js.source, ['js']);
    gulp.watch(options.stylus.source, ['stylus']);

});



gulp.task('build', ['clean', 'iterate', 'js', 'js-min', 'stylus', 'stylus-min']);
gulp.task('default', ['clean', 'watch']);