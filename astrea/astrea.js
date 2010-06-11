/**
 * create a object namespace
 *
 * @param {Object} ns the namespace to be created
 * @example
 *
 * $.ns('my.custom.namespace');
 *
 * will create under the window global object this structure:
 *
 * window.my {
 *  custom : {
 *    namespace : { }
 *  }
 * }
 */
jQuery.Namespace = function(ns) {
  var nsParts = ns.split(".");
  var root = window;
  for (var i = 0; i < nsParts.length; i++) {
    if (typeof root[nsParts[i]] == "undefined") {
      root[nsParts[i]] = {};
    }
    root = root[nsParts[i]];
  }
  return root;
};
/**
 * replaces the {n} tokens found in the string with the arguments in the n index
 * the first argument is the string itself so the arguments to be replaced start at index 1
 * @param {Object} s the string to be formatted
 */
jQuery.stringFormat = function(s) {
  for (var i = 1; i < arguments.length; i++) {
    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    s = s.replace(re, arguments[i]);
  }
  return s;
}

jQuery.Namespace('Astrea.Util');

/**
 * find the value in an object and apply the modifiers included in the token, default and format values are supported now
 * @param {Object} row
 * @param {Object} token
 */
Astrea.Util.findValueBykey = function(row, token) {
  var expression, pattern, numberFormat, numberReadable = null;
  //TODO: allow other modifiers, test them against the browsers for performance
  //      and make 
  //extract the modifiers in the token 
  var re = /\|\w+:'.*?'/g;
  var m = token.match(re);
  if (m) {
    // save its values into expression and pattern
    for (var i = 0; i < m.length; i++) {
      var reAux = m[i].match(/'(.*?)'/);
      if (reAux !== null) {
        if (m[i].match(/\|default:'/)) {
          expression = reAux[1];
        }
        else 
          if (m[i].match(/\|format:'/)) {
            pattern = reAux[1];
          }
      }
    }
    // clean the token, removing the modifiers from the token 
    token = token.replace(re, '');
  }
  
  var tokens = token.replace(/\{|\}/g, '').split(".") || [];
  var obj = row;
  for (var ix = 0; ix < tokens.length; ix++) {
    try {
      obj = obj[tokens[ix]];
    } 
    catch (ex) {
      console.log('[Error findValueBykey token ' + tokens[ix] + '] : ' + ex.message);
      obj = null;
      break;
    }
  }
  // if the object has no value, then the default expression will be used
  if (expression != null && (!obj || obj === '' || obj === 0)) {
    obj = expression || "";
    // if there is a pattern, we have to fit the obj to it
  }
  else 
    if (obj != null) {
      if (pattern) {
        obj = pattern.replace(/\[0\]/, obj);
      }
    }
  return obj;
  
};