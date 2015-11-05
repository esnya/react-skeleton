'use strict';

var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var webserver = require('gulp-webserver');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var jest = require('jest-cli');
var through = require('through');
var open = require('open');
require('harmonize')();

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
    var b = browserify({
        entries: 'js/script.js',
        debug: true,
        transform: [babelify.configure({ presets: ['es2015', 'react'] })],
    });

    return b.bundle()
        .on('error', notify.onError('<%= error.message %>'))
        .pipe(source('js/script.js'))
        .pipe(buffer())
        .pipe(gulp.dest(config.dest))
        .pipe(notify('Task <script> done!'))
        ;
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
