/**
 * @author Roy Riojas
 */
(function ($) {

  window.Astrea = window.Astrea || {};
  
  if (Astrea.loaded)
    return; //just avoid to run this function again if already loaded astrea
  
  $.extend(Astrea, {
    w : window,
    doc : document,
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
      //safer way to convert a pseudo array to an object array
      var args = Array.prototype.slice.call(arguments);
      
      var s = args.shift();
      return s.replace(pattern, function(c) {
        return args[c.match(/\d+/)] || '';
      });
    },
    ns : function (namespace) {
      var r = Astrea.w;
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
  
  
  Astrea.ns('Astrea.Sniff');
  Astrea.Sniff.__defineGetter__("isiPad", function () {
    return /^iPad$/.test(Astrea.w.navigator.platform); 
  });
  Astrea.Sniff.__defineGetter__("isiPhone", function () {
    return /^iPhone$/.test(Astrea.w.navigator.platform); 
  });

  Astrea.loaded = true;
  window.$a = Astrea;
})(jQuery);
