'use strict';

var gulp = require('gulp');
var browserify = require('gulp-browserify');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var webserver = require('gulp-webserver');

var babelify = require('babelify');
var reactify = require('reactify');

var jest = require('jest-cli');
var through = require('through');
var open = require('open');
require('harmony')();

var config = {
    dest: 'public',
    script: {
        path: 'js',
        main: 'js/script.js',
    },
    test: {
        path: '__tests__',
    },
};

gulp.task('script', function() {
    return gulp.src(config.script.main)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>'),
        }))
        .pipe(browserify({
            transform: [
                babelify.configure({
                    ignore: ['**/*/firebase*'],
                }),
                reactify,
            ],
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(notify('Task <script> done!'));
});

gulp.task('test', function(callback) {
    jest.runCLI(
            {
            },
            __dirname,
            function(result) {
                gulp.src('__tests__')
                    .pipe(plumber({
                        errorHandler: notify.onError('Task <test> failed!')
                    }))
                    .pipe(through(function () {
                        if (!result) {
                            this.emit('error', new Error('Test failed'));
                        }
                    }))
                    .pipe(notify('Task <test> succeeded!'));
                callback();
            });
});

gulp.task('watch:script', ['script'], function() {
    gulp.watch(config.script.path + '/**/*.js', ['script']);
});
gulp.task('watch:test', ['test'], function() {
    gulp.watch([config.script.path + '/**/*.js', config.test.path + '/**/*.js'], ['test']);
});
gulp.task('watch', ['watch:script', 'watch:test']);

gulp.task('server', function() {
    gulp.src(config.dest)
        .pipe(webserver({
            livereload: true,
            open: false,
        }));
});
gulp.task('open', function() {
    open('http://localhost:8000/');
});

gulp.task('tdd', ['server', 'watch']);
gulp.task('tdd-open', ['tdd', 'open']);

gulp.task('default', ['script', 'test']);
