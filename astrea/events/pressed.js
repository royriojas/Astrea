/**
 * pressed event. only raised when the button is enabled
 * @param {Object} data
 * @param {Object} namespaces
 * @param {Object} eventHandle
 */
(function($) {
  $.event.special.pressed = {
    setup: function(data, namespaces, eventHandle) {
      var ele = $(this);
      var binded = ele.data('binded');
      
      if (binded == 'true') 
        return false;
      
      ele.bind('click.pressed', function(e) {
        if (!$(this).is(':disabled') && !($(e.target).is(':disabled'))) {
          $(this).triggerHandler('pressed', [e.target]); //do we need bubbling?
        }
        return false; //always avoid default? 
      }).data('binded', 'true');
      
      return false; //not default binding
    },
    add: function(handleObj) {
      //store the original handler
      var old_handler = handleObj.handler;
      //replace it for a handler that will receive the 
      handleObj.handler = function(event, elem) {
        //restore the original target
        event.target = elem;
        //call the real handler
        old_handler.apply(this, arguments);
      };
    },
    teardown: function() {
      $(this).unbind('click.pressed');
    }
  };
})(jQuery);
