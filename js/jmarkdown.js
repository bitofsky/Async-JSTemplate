(function() {
  var jMarkdown = window.jMarkdown || (window.jMarkdown = {});
  var DEBUG = true;
  jMarkdown.md2html = function(input) {
    'use strict';

    if (DEBUG)
      console.log('input: ' + input);

    var lines, output, i, len, currentNode = null, line, numSymbol, ul,
        numLeadingSpaces, leadingWhitespaceRegex, trailingWhitespaceRegex,
        strippedLine, headingClosed, oper, lastNode = null, listLevel = 0;

    leadingWhitespaceRegex = /^\s+/;
    trailingWhitespaceRegex = /\s+$/;

    // get array of lines in input
    lines = input.split('\n');

    // initialize output container
    output = document.createElement('div');

    // iterate over lines
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];

      // check if blank line
      if (line.replace(/\s*/, '') === '') {
        lastNode = currentNode || lastNode;
        currentNode = null;
        continue;
      }

      // get number of leading spaces
      numLeadingSpaces = getNumLeadingSpaces(line);

      // check for code block
      if ((!currentNode || currentNode.nodeName === 'PRE') && numLeadingSpaces >= 4) {
        if (!currentNode) {
          currentNode = document.createElement('pre');
          output.appendChild(currentNode);
        }
        line = line.substr(4) + '\n';
        currentNode.appendChild(document.createTextNode(line));
        continue;
      }

      // strip leading whitespace
      strippedLine = line.replace(leadingWhitespaceRegex, '');

      // check for heading
      if (startsWith('#', strippedLine)) {
        // get number of hashes at beginning
        numSymbol = 1;
        while (strippedLine[numSymbol] && strippedLine[numSymbol] === '#') {
          numSymbol++;
        }
        if (numSymbol > 6) {
          throw new jMarkdownError('invalid syntax: more than 6 hashes detected at front of line.');
        }

        // create only if last line was blank (block level element rule)
        if (!currentNode) {
          currentNode = document.createElement('h' + numSymbol);
          output.appendChild(currentNode);

          // check for closing atx-style tag
          strippedLine = strippedLine.replace(trailingWhitespaceRegex, '');
          if (strippedLine[strippedLine.length - 1] === '#') {
            // remove trailing hash
            strippedLine = strippedLine.replace(/\s*#+\s*$/, '');
          }

          // remove leading hash
          strippedLine = strippedLine.replace(/^#+\s*/, '');
          currentNode.appendChild(document.createTextNode(strippedLine));
          continue;
        }
      }

      // check for list item
      if (startsWith('*', strippedLine)) {
        // list markers are required to be followed by 1-3 spaces or a tab
        if (strippedLine.length > 1 && (strippedLine[1] === ' ' || strippedLine[1] === '\t')) {
          if (strippedLine[1] === ' ') {
            spacesAfterMarker = getNumLeadingSpaces(strippedLine.substr(1));
            if (spacesAfterMarker > 3) {
              throw new jMarkdownError('invalid syntax: after list marker must be 1-3 spaces or a tab.');
            }
          }

          if (!currentNode && (!lastNode || lastNode.nodeName !== 'LI')) {
            ul = document.createElement('ul');
            output.appendChild(ul);
            listLevel++;
          }

          // check if nested list
          if (numLeadingSpaces > 0) {
            if (numLeadingSpaces % 4 !== 0) {
              throw new jMarkdownError('invalid syntax: indented list items must be indented by a multiple of four.')
            }

            if (parseInt(numLeadingSpaces / 4) !== listLevel) {
              // TODO go back to previous ancestor ul. check if leading spaces goes past current level.
            }
          }
          strippedLine = strippedLine.replace(trailingWhitespaceRegex, '').replace(/^[*+-]\s*/, '');
          currentNode.appendChild(document.createTextNode(strippedLine));
          ul.appendChild(currentNode);
        }
      }

      // paragraph or html or continuation
      if (currentNode) {
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].indexOf(currentNode.nodeName) !== -1) {
          throw new jMarkdownError('invalid syntax: heading element can only be on one line and should be followed by blank line');
        }
        strippedLine = ' ' + strippedLine.replace(trailingWhitespaceRegex, '');
      } else {
        currentNode = document.createElement('p');
        output.appendChild(currentNode);
        strippedLine = strippedLine.replace(trailingWhitespaceRegex, '');
      }
      currentNode.appendChild(document.createTextNode(strippedLine));
    }
    if (DEBUG)
      console.log(output.innerHTML);
    return output.innerHTML;
  };

  function getNumLeadingSpaces(subject) {
    var numLeadingSpaces = 0;
    while (subject.length > numLeadingSpaces && subject[numLeadingSpaces] === ' ') {
      numLeadingSpaces++;
    }
    return numLeadingSpaces;
  }

  function processLine(line) {

  }

  function startsWith(search, subject) {
    return subject.indexOf(search) === 0;
  }
  function jMarkdownError(msg) {
    this.name = 'jMarkdownError';
    this.message = msg || '';
  }
  jMarkdownError.prototype = new Error();
})();
