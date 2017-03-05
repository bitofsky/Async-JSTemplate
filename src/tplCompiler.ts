// Create Template Compiler
export const tplCompiler = (str: string, option: any) => {

    const args = '$id, data, option, ' + Object.keys(option.global).join(', '),
        fn = '\n\
      var print     = function(){ _s += Array.prototype.join.call(arguments,""); },\n\
          printf    = function(){ _s += sprintf.apply(this, arguments); },\n\
          uid       = util.makeUID("template");\n\
          sprintf   = util.sprintf,\n\
          _promises = [],\n\
          includeExecute = function(){\n\
            var uid     = util.makeUID("include");\n\
                syncOut = undefined,\n\
                args    = util.toArray(arguments);\n\
            util.extend(args, {2:{global:{$parent:$id},_log:option._log}});\n\
            _s += uid;\n\
            _promises.push(\n\
              this.apply(null, args).then(function(output){\n\
                syncOut = output;\n\
                _s = _s.replace(uid, output);\n\
              })\n\
            );\n\
            return syncOut !== undefined ? syncOut : uid;\n\
          },\n\
          include = function(){\n\
            return includeExecute.apply(AJST, arguments);\n\
          },\n\
          includeAjax = function(){\n\
            return includeExecute.apply(AJST.ajax, arguments);\n\
          },\n\
          includeEach = function(id, data, option){\n\
            return includeExecute.apply(AJST.each, arguments);\n\
          };\n\
      var _s = \'' + str.replace(regexp_remove_ws, replace_remove_ws).replace(regexp_compile, replace_compile).replace(regexp_escape, replace_escape) + '\';\n\
      return Promise.all(_promises).then(function(){\n\
        return _s;\n\
      });';

    try {

        return <AJST.AJSTCompiler>new Function(args, fn);

    } catch (e) {

        if (option.debug) {
            console.log('AJST tplCompiler Debug');
            console.log(e.message);
            console.log('template :', str);
            console.log('option :', option);
            console.log('args: ', args);
            console.log('fn: ', fn);
        }

        throw e;

    }

};

const regexp_remove_ws = /(?:<\?([\s\S]+?)\?>)/g;
const replace_remove_ws = s => s
    .split('\n')
    .join(' ')
    .replace(/'/g, '_ESCAPE__1_')
    .replace(/"/g, '_ESCAPE__2_')
    .replace(/\\n/g, '_ESCAPE__NEWLINE_');
const regexp_escape = /_ESCAPE__1_|_ESCAPE__2_|{{script}}|{{\/script}}|_ESCAPE__NEWLINE_/g;
const replace_escape = s => {
    return {
        _ESCAPE__1_: '\'',
        _ESCAPE__2_: '"',
        '{{script}}': '<script>',
        '{{/script}}': '</script>',
        _ESCAPE__NEWLINE_: '\\n'
    }[s] || s;
};
const regexp_compile = /([\s'\\])(?![^\?]*\?>)|(?:<\?(=)([\s\S]+?)\?>)|(<\?)|(\?>)/g;
const replace_compile = (s, p1, p2, p3, p4, p5) => {
    if (p1) // whitespace, quote and backslash in interpolation context
        return {
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            ' ': ' '
        }[s] || '\\' + s;
    if (p2) // interpolation: <?=prop?>
        return `'+(${p3})+'`;
    if (p4) // evaluation start tag: <?
        return `';\n`;
    if (p5) // evaluation end tag: ?>
        return `;\n_s+='`;
};