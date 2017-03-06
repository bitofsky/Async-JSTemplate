require.config({
    baseUrl: './', //By default load any module IDs from js/lib
    paths: {
        ajst: location.hostname == '127.0.0.1' ? '/ajst/ajst' : 'https://rawgit.com/bitofsky/Async-JSTemplate/master/dist/ajst',
        showdown: 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.6.4/showdown.min'
    }
});

// requirejs promise util
require.promise = function (modules) {
    return new Promise(function (resolve, reject) {
        require(modules.constructor === Array ? modules : [modules], resolve, reject);
    });
};

require.promise('lib/index')['catch'](function (err) { console.error(err); });
