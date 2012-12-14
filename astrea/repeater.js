/**
 * @author Roy Riojas
 */
(function ($, $a) {
  $a.Repeater = function (options) {
    var opts = {
      data : [],
      template : ""
    };
    
    var me = this;
    
    $.extend(opts, options);
    
    $a.createDispatchers('Render', me);
    $a.createDispatchers('ItemRendered', me);
    
    me.render = function (start, end) {
      var _data = opts.data;
      start = start || 0;
      end = end || _data.length - 1;
      var len = _data.length;
      var args = {}
      
      me.raiseBeforeRender(args);
      
      me.renderItem()
    }
  };
  
})(jQuery, window.Astrea);
