module.exports = function (grunt) {

    const buildTsc = project => new Promise((resolve, reject) => {
        const args = ['-p', project, '--listEmittedFiles'];
        grunt.log.writeln(`tsc ${args.join(' ')} : ${new Date()}`);
        try { require('fs').unlinkSync('./dist/ajst.d.ts'); } catch (e) { } // for recreate
        grunt.util.spawn({
            cmd: 'tsc',
            args,
            opts: { stdio: [process.stdin, process.stdout, process.stderr] }
        }, err => resolve(err));
    });

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        clean: { build: ['./src/**.js', './src/**.map', './ajst.js', './*.map'] }
    });

    grunt.registerTask('ajst:build', 'Typescript Build', async function () {

        require('time-grunt')(grunt);

        grunt.task.run('clean:build');

        const project = '.';
        const done = this.async();
        const err = await buildTsc(project);

        err && grunt.log.error(err);

        done(err ? false : true);

    });

    grunt.registerTask('ajst:watch', 'Typescript Build Watch', function () {

        const project = '.';
        const execute = () => buildTsc(project);
        const watchGlob = require('watch-glob');
        const done = this.async();

        execute(); // init build

        watchGlob(['ajst.ts', 'src/**/*.ts'], { delay: 100 }, execute, execute);

    });

    grunt.registerTask("default", ["ajst:build"]);

};