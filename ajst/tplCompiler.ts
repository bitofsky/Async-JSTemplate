import { Option, Compiler } from './ns';

/**
 * Create Template Compiler
 */
export const tplCompiler = (tplString: string, option: Option) => {

    if (tplString === undefined) throw new Error('AJST tplCompiler tplString undefined.');

    const args = `$id, data, option, ${Object.keys(option.global).join(', ')}`;
    const fn = `
var print          = function(){ _s += Array.prototype.join.call(arguments, ''); };
var printf         = function(){ _s += sprintf.apply(this, arguments); };
var uid            = util.makeUID('template');
var sprintf        = util.sprintf;
var _promises      = [];
var includeExecute = function(){
    var uid     = util.makeUID('include');
    var syncOut = undefined;
    var args    = util.toArray(arguments);
    util.extend(args, {2:{global:{$parent:$id},_log:option._log}});
    _s += uid;
    _promises.push(
        this.apply(this, args).then(function(output){
            syncOut = output;
            _s = _s.replace(uid, output);
        })
    );
    return syncOut !== undefined ? syncOut : uid;
};
var include = function(){
    return includeExecute.apply(AJSTget, arguments);
};
var includeAjax = function(){
    return includeExecute.apply(AJSTajax, arguments);
};
var includeEach = function(id, data, option){
    return includeExecute.apply(AJSTeach, arguments);
};
var _s = '${tplString.replace(regexp_remove_ws, replace_remove_ws).replace(regexp_compile, replace_compile).replace(regexp_escape, replace_escape)}';
return Promise.all(_promises).then(function(){
    return _s;
});`;

    try {
        const compiler = <Compiler>new Function(args, fn);
        return compiler;
    } catch (e) {

        if (option.debug) {
            console.log('AJST tplCompiler Debug');
            console.log(e.message);
            console.log('tplString :', tplString);
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
