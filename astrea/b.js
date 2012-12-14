/**
 * @author Roy Riojas
 */
(function ($) {

  window.Astrea = window.Astrea || {};

  if (Astrea.loaded)
    return; //just avoid to run this function again if already loaded astrea

  $.extend(Astrea, {
    w : window, //set as property for unit testing purposes
    doc : document, //set as property for unit testing purposes
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
    ns : function (namespace, root) {
      var r = root || Astrea.w,
      base = r, //base is used to return the original root
      ns = namespace.split('.');
      for (var i = 0, len = ns.length; i < len; i++) {
        var part = ns[i];
        if (!r[part]) {
          r[part] = {};
        }
        r = r[part];
      }
      var returnValue = ns.length > 0 ? base[ns[0]] : null;
      return returnValue;
    },
    /**
     * debounce will execute a function one time in a given interval time
     * and no more 
     */
    debounce : function (f, ms, ctx) {
      //just return the wrapper function
      return function () {
        //if this is the first time of the sequence of calls to this function
        if (f.timer == null) {
          //store the original arguments used to call this function
          var args = arguments;
          //try to execute it almost inmediately
          f.timer = setTimeout( function() {
            //call the function with the ctx and the original arguments
            f.apply(ctx,args);
            //set the timer
            f.timer = setTimeout( function () {
              //to make sure the next set of calls will be executing the first call as soon as possible
              f.timer = null;
            }, ms || 1);
          },0);
          return;
        }
      };
    },
    /**
     * throttle will execute a function after pass a minimum of time between the last call and the current time. 
     * 
     */
    throttle : function (f, ms, ctx) {
      return function() {
        var args = arguments;
        clearTimeout(f.timer);
        f.timer = setTimeout( function() {
          f.timer = null;
          f.apply(ctx, args);
        }, ms || 0);
      }
    },
    /**
     * return the value of the given key in a given object
     */
    getValue : function (obj, key) {
      key = $.trim(key);
      if (!obj || key == '')
      var subkeys = key.split(".") || [];
      var tempObj = obj;
      var theVal = null;
      for (var i = 0, len = subkeys.length; i < len; i++) {
        var theKey = subkeys[i];
        theVal = tempObj[theKey];
        if (typeof theVal == 'undefined' || theVal == null) break;
        tempObj = theVal;
      }
      return theVal;
    },
    /**
     * iterate over a set of items asynchronously
     */
    iterate : function (items, fn, cb) {
      var len = items.length;
      var current = 0;
      //closure fuction to iterate over the items async
      var process = function(lastValue) {
        //var currentItem
        if (current == len) {
          cb && cb(lastValue);
          return;
        }
        var item = items[current++];
        setTimeout(function() {
          fn(item, function(val) {
            process(val && lastValue);
          });
        }, 0);
      };
      process(true);
    },
    /**
     * create the methods for dispatch events
     */
    createDispatchers : function (eName, obj) {
      var eventName = 'on' + eName,
      raiseName = 'raise' + eName,
      beforeEventName = 'onBefore' + eName,
      raiseBeforeName = 'raiseBefore' + eName;
      
      if (!obj) return; 
      
      obj[raiseName] = function () {
        if ($.isFunction (obj[eventName])) {
          obj[eventName].apply(obj, arguments);
        }
      };
      
      obj[raiseBeforeName] = function () {
        if ($.isFunction (obj[beforeEventName])) {
          obj[beforeEventName].apply(obj, arguments);
        }
      };
    }
  });


  var _isiPad = null, _isiPhone = null;
  Astrea.ns('Astrea.Sniff');
  Astrea.Sniff.__defineGetter__("isiPad", function () {
    if (_isiPad == null) {
      _isiPad = /^iPad$/.test(Astrea.w.navigator.platform);
    }
    return _isiPad;
  });
  Astrea.Sniff.__defineGetter__("isiPhone", function () {
    if (_isiPhone == null)  {
      _isiPhone = /^iPhone$/.test(Astrea.w.navigator.platform);
    }
    return _isiPhone;
  });
  Astrea.loaded = true;
  window.$a = Astrea;
})(jQuery);
