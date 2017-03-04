define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // tslint:disable-next-line:whitespace
    var CommentStripper = function () { var i = '/', r = '\\', n = '*', e = '"', s = "'", h = '\n', o = '\r', u = function () { }; return u.prototype = { string: '', length: 0, position: 0, output: null, getCurrentCharacter: function () { return this.string.charAt(this.position); }, getPreviousCharacter: function () { return this.string.charAt(this.position - 1); }, getNextCharacter: function () { return this.string.charAt(this.position + 1); }, add: function () { this.output.push(this.getCurrentCharacter()); }, next: function () { this.position++; }, atEnd: function () { return this.position >= this.length; }, isEscaping: function () { if (this.getPreviousCharacter() === r) {
            for (var t = this.position - 1, i_1 = !1; t > 0;) {
                if (this.string.charAt(t--) !== r)
                    return i_1;
                i_1 = !i_1;
            }
            return i;
        } return !1; }, processSingleQuotedString: function () { if (this.getCurrentCharacter() === s)
            for (this.add(), this.next(); !this.atEnd();) {
                if (this.getCurrentCharacter() === s && !this.isEscaping())
                    return;
                this.add(), this.next();
            } }, processDoubleQuotedString: function () { if (this.getCurrentCharacter() === e)
            for (this.add(), this.next(); !this.atEnd();) {
                if (this.getCurrentCharacter() === e && !this.isEscaping())
                    return;
                this.add(), this.next();
            } }, processSingleLineComment: function () { if (this.getCurrentCharacter() === i && this.getNextCharacter() === i)
            for (this.next(); !this.atEnd();)
                if (this.next(), this.getCurrentCharacter() === h || this.getCurrentCharacter() === o)
                    return; }, processMultiLineComment: function () { if (this.getCurrentCharacter() === i && this.getNextCharacter() === n)
            for (; !this.atEnd();)
                if (this.next(), this.getCurrentCharacter() === n && this.getNextCharacter() === i)
                    return this.next(), void this.next(); }, process: function () { for (; !this.atEnd();)
            this.processDoubleQuotedString(), this.processSingleQuotedString(), this.processSingleLineComment(), this.processMultiLineComment(), this.atEnd() || (this.add(), this.next()); }, reset: function () { this.string = '', this.length = 0, this.position = 0, this.output = []; }, strip: function (t) { return this.reset(), this.string = t, this.length = this.string.length, this.process(), this.output.join(''); } }, null, u; }();
    exports.default = new CommentStripper();
});
//# sourceMappingURL=CommentStripper.js.map