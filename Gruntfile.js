var webpack = require("webpack"),
    Dot = require("mocha/lib/reporters/dot"),
    sys = require('sys'),
    exec = require('child_process').exec;


function withStatusIcon(Reporter) {
    var StatusImage = {
        "status": "./status.png",
        "failed": "./test/tools/status-failed.png",
        "success": "./test/tools/status-success.png"
    };

    return function updateIon(runner) {
        runner.on("end", function () {
            var image = StatusImage.success;
            if (runner.failures > 0) {
                image = StatusImage.failed;
            }
            child = exec("cp " + image + " " + StatusImage.status, function (err) {
                err && console.log(err);
            });
        });

        return new Reporter(runner);
    }
}

module.exports = function (grunt) {

    grunt.initConfig({

        "mochaTest": {

            "test": {
                src: ['test/**/*.test.js'],
                options: {
                    reporter: withStatusIcon(Dot),
                    quiet: false // Optionally suppress output to standard out (defaults to false)
                }
            }
        },

        "watch": {

            "scripts": {
                files: ['test/**/*.test.js', 'lib/**/*.js'],
                tasks: ['mochaTest'],
                options: {
                    spawn: true
                }
            }
        },

        "webpack": {

            "build": {
                // webpack options
                entry: "./lib/index.js",
                output: {
                    path: "build/",
                    filename: "JsonLibrary.js",
                    // libraryTarget: "var",
                    library: "JsonLibrary"
                },

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                // stats: false disables the stats output
                storeStatsTo: "xyz", // writes the status to a variable named xyz
                // you may use it later in grunt i.e. <%= xyz.hash %>

                progress: false, // Don't show progress
                // Defaults to true
                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue
                watch: false, // use webpacks watcher
                // You need to keep the grunt process alive
                keepalive: false, // don't finish the grunt task
            },

            "dist": {
                // webpack options
                entry: "./lib/index.js",
                output: {
                    path: "dist/",
                    filename: "JsonLibrary.min.js",
                    // libraryTarget: "var",
                    library: "JsonLibrary"
                },

                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                // stats: false disables the stats output
                storeStatsTo: "xyz", // writes the status to a variable named xyz
                // you may use it later in grunt i.e. <%= xyz.hash %>

                progress: false, // Don't show progress
                // Defaults to true
                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue
                watch: false, // use webpacks watcher
                // You need to keep the grunt process alive
                keepalive: false, // don't finish the grunt task
                // module: {
                //     loaders: [
                //         {
                //             test: /.*\.js$/, loader: "uglify"
                //         }
                //     ]
                // }
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            drop_console: true
                        }
                    })
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webpack');
    // grunt.loadNpmTasks('grunt-notify');

    // testing
    grunt.registerTask('test', "mochaTest");
    grunt.registerTask('tdd', 'watch');
    // build
    grunt.registerTask('build', 'webpack:build');
    grunt.registerTask('dist', ['test', 'webpack:dist']);
};
