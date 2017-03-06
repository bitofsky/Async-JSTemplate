module.exports = function (grunt) {

    const project = '.';

    const buildTsc = project => new Promise((resolve, reject) => {
        const args = ['-p', project];
        grunt.log.writeln(`tsc ${args.join(' ')} : ${new Date()}`);
        try { require('fs').unlinkSync('./index.d.ts'); } catch (e) { } // for recreate
        grunt.util.spawn({
            cmd: 'tsc',
            args,
            opts: { stdio: [process.stdin, process.stdout, process.stderr] }
        }, err => resolve(err));
    });

    grunt.initConfig({});

    grunt.registerTask('ajst:build', 'Typescript Build', async function () {

        require('time-grunt')(grunt);

        const done = this.async();
        const err = await buildTsc(project);

        err && grunt.log.error(err);

        done(err ? false : true);

    });

    grunt.registerTask('ajst:watch', 'Typescript Build Watch', async function () {

        const execute = () => buildTsc(project);
        const watchGlob = require('watch-glob');
        const done = this.async();

        await execute(); // init build

        watchGlob(['**/*.ts'], { delay: 100 }, execute, execute);

    });

    grunt.registerTask("default", ["ajst:build"]);

};