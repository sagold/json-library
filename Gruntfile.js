var Dot = require("mocha/lib/reporters/dot"),
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

        mochaTest: {

            test: {
                src: ['test/**/*.test.js'],
                options: {
                    reporter: withStatusIcon(Dot),
                    quiet: false // Optionally suppress output to standard out (defaults to false)
                }
            }
        },

        watch: {

            scripts: {

                files: ['test/**/*.test.js', 'lib/**/*.js'],
                tasks: ['mochaTest'],
                options: {

                    spawn: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-notify');

    grunt.registerTask('test', "mochaTest");
    grunt.registerTask('tdd', 'watch');
};
