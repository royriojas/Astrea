/**
 * @author Roy Riojas
 */
(function ($) {

  var Astrea = window.$a || {};

  if (Astrea.loaded)
    return; //just avoid to run this function again if already loaded astrea

  $.extend(Astrea, {
    /**
     * return a string formatted with the passed arguments
     * @example
     *
     * var s = $a.format('Some {0} with a {1} mood {2}', 'String', 'good', 'arrived');
     * //output
     * //s = 'Some String with a good mood arrived'
     */
    format : function () {
      var pattern = /\{\d+\}/g;
      var args = arguments;
      var s = Array.prototype.shift.apply(args);
      return s.replace(pattern, function(c) {
        return args[c.match(/\d+/)] || '';
      });
    },
    ns : function (namespace) {
      var r = window;
      var ns = namespace.split('.');
      for (var i = 0, len = ns.length; i < len; i++) {
        var part = ns[i];
        if (!r[part]) {
          r[part] = {};
        }
        r = r[part];
      }
    }
  });

  Astrea.loaded = true;
  window.$a = Astrea;
})(jQuery);
