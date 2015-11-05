'use strict';

var gulp = require('gulp');
var notify = require('gulp-notify');
var webserver = require('gulp-webserver');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var jest = require('jest-cli');
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
        .on('error', notify.onError('[SCRIPT] <%= error.message %>'))
        .pipe(source('js/script.js'))
        .pipe(buffer())
        .pipe(gulp.dest(config.dest))
        .pipe(notify('[SCRIPT] Generated script: <%= file.relative %> '))
        ;
});

gulp.task('test', function(callback) {
    var _write = process.stdout.write;
    var output = '';
    process.stdout.write = function(str) {
        if (str && str.match(/^{.*}$/)) {
            output += str;
        } else {
            _write.apply(this, arguments);
        }
    };

    jest.runCLI({ json: true, }, __dirname, function(success) {
        process.stdout.write = _write;

        var data;
        try {
            data = JSON.parse(output);
        } catch (e) {
            notify.onError('<%= error.message %>').call(new Buffer(''), e);
            return callback();
        }

        var endTime = data.testResults
            .map(r => r.endTime)
            .reduce(Math.max.bind(Math));

        var result = `${data.numPassedTests} test passed (${data.numTotalTests} total in ${data.numTotalTestSuites}, run time ${(endTime - data.startTime) / 1000}s)`;
        if (data.numFailedTests) result = `${data.numFailedTests} test failed, ${result}`;
        result = `[TEST] ${result}`;

        var logLevel = notify.logLevel();
        notify.logLevel(0);
        if (success) {
            notify('<%= file.message %>', { onLast: false})
                ._transform({ message: result }, null, () => callback);
        } else {
            data.testResults
                .filter(r => !r.success)
                .map(r => r.message)
                .forEach(function (message) {
                    var _message = message.replace(/\u001b\[[0-9]*m/g, '');
                    notify.onError('<%= error.message %>').call(new Buffer(''), new Error(_message));
                });

            notify.onError('<%= error.message %>').call(new Buffer(''), new Error(result));
        }
        notify.logLevel(logLevel);

        return callback();
    });
});

gulp.task('watch:script', ['script'], function() {
    return gulp.watch(config.script.path + '/**/*.js', ['script']);
});
gulp.task('watch:test', ['test'], function() {
    return gulp.watch([config.script.path + '/**/*.js', config.test.path + '/**/*.js'], ['test']);
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
