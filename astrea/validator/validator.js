(function($) {
  $.validation = {
    comparisonType: {
      NotEqual: 'NotEqual',
      Equal: 'Equal',
      GreaterThan: 'GreaterThan',
      LesserThan: 'LesserThan'
    }
  };
  
  function log (msg) {
    window.console && window.console.log && window.console.log(msg);
  }
  function val(input) {
    return $.trim(input.val());
  }
  function validate(ele, callback, lastResult) {
    var jEle = $(ele);
    var input = jEle.attr('data-field');
    var input = $(input);
    var trimmedInput = val(input);
    var isValid = true;
    
    if (input.is(':visible') || input.attr('type') == 'hidden') {
      isValid = false;
      // Required Validator
      if (jEle.is('.Required')) {
        isValid = $.notNullOrEmpty(trimmedInput);
      }
      // Compare Validator
      if (jEle.is('.Compare')) {
        var compare_value = jEle.attr('data-compare-value');
        var comparison_type = jEle.attr('data-comparison-type') || $.validation.comparisonType.NotEqual;
        
        if (compare_value) {
          var val = val(input);
          
          switch (comparison_type) {
            case $.validation.comparisonType.NotEqual:
              isValid = compare_value != val;
              break;
            case $.validation.comparisonType.Equal:
              isValid = compare_value == val;
              break;
            case $.validation.comparisonType.GreaterThan:
              isValid = compare_value > val;
              break;
            case $.validation.comparisonType.LesserThan:
              isValid = compare_value < val;
              break;
            default:
              console.log('ComparisonType Not supported!, setting its valid to true');
              isValid = true;
              break;
          }
        }
        else { // Nothing to compare
          isValid = true;
        }
      }
      //TODO include the other kind of Validators that could be used
      
      if (jEle.is('.RegularExpression')) {
        var exp = jEle.attr('data-regex');
        var modifiers = jEle.attr('data-modifiers');
        var rx = new RegExp(exp, modifiers);
        //var matches = rx.exec(trimmedInput);
        isValid = rx.test(trimmedInput);
      }
      
      if (jEle.is('.RangeValidator')) {
        //TODO: check numbers
        var minVal = jEle.attr('data-min-value');
        var maxVal = jEle.attr('data-max-value');
        var numValue = null;
        try {
          numValue = parseFloat(trimmedInput);
        } 
        catch (exc) {
          console.log('Error parsing number : ' + exc.message);
        }
        
        
        isValid = numValue != null && (numValue >= parseFloat(minVal)) && (numValue <= parseFloat(maxVal));
      }
      
      
      // Custom Validator
      if (jEle.is('.Custom')) {
        var func = jEle.attr('data-custom-function');
        if (typeof window[func] == 'function') {
          window[func](input, function(result) {
            evaluateVisibility(jEle, result, input);
            if (!callback) 
              return;
            if (!ele.next) {
              callback(result && lastResult);
            }
            else {
              validate(ele.next, callback, lastResult && result);
            }
            
          });
        }
        return;
      }
    }
    
    
  evaluateVisibility(jEle, isValid, input);
    if (!callback) 
      return;
    if (!ele.next) {
      callback(isValid && lastResult);
    }
    else {
      validate(ele.next, callback, lastResult && isValid);
    }
  }
  
   function evaluateVisibility(jEle, result, input) {
    if (!result) {
      jEle.fadeIn('fast');
      input.addClass('failed');
    }
    else {
      jEle.fadeOut('fast');
      input.removeClass('failed');
    }
  }
  
  function doValidate(me, callback) {
    var group = $.val(me.attr('data-validation-group'), '');
    var validators = $('.validator' + group);
    
    var current = null;
    var previous = null;
    var first = null;
    validators.each(function() {
      current = this;
      if (previous != null) {
        previous.next = current;
      }
      else {
        first = current;
      }
      previous = current;
    });
    
    if (first == null) {
      callback(true); // no validators found
      return;
    }
    validate(first, callback, true);
  }
  
  function setAutoValidator(me) {
    var group = me.attr('data-validation-group');
    var validators = $('.validator' + group);
    validators.each(function() {
      var validator = this;
      var field = $(validator.attr('data-field'));
      var event = validator.attr('data-event');
      if (event) {
        event = event + '.autovalidator';
        field.unbind(event).bind(event, function() {
          validate(validator);
        });
      }
      else {
        field.unbind('change.autovalidator blur.autovalidator').bind('change.autovalidator blur.autovalidator', function() {
          validate(validator);
        });
      }
      
      if (field.is(':radio')) {
        field.unbind('click.autovalidator').bind('click.autovalidator', function() {
          validate(validator);
        });
      }
      
    });
  }
  
  $.notNullOrEmpty = function (value) {
    return (value != null && $.trim(value) != '') ? value;
  };
  
  $.val = function (val, defaultValue) {
    return $.notNullOrEmpty(val) ? val : defaultValue;
  };
  
  $.fn.initValidation = function(options) {
    var opts = {
      validationClass : 'validator-trigger'
    };
    
    $.extend(opts, options);
    
    this.find(opts.validationClass).each(function() {
      var me = $(this);
      if (me.attr('data-validator-initialized') == 'true' || me.is('.validator-clone')) {
        return true;
      }
      var id = $.val(me.attr('id'), new Date().getTime());
      me.clone().attr('id', id + '_clone').addClass('validator-clone').insertAfter(me).click(function() {
        var clone = $(this);
        var onValidate = function(result) {
          if (!result) {
            clone.addClass('failed');
            me.trigger('validationfailed');
            return;
          }
          clone.removeClass('failed');
          me.trigger('validationsuccess');
          if (me.attr('onclick') && !(me[0].onclick && me[0].onclick.apply)) {
            me[0].onclick = new Function(me.attr('onclick'));                        
          }          
          try {
            me.trigger('click');
          } 
          catch (ex) {
            log(ex.message);
          }
      };
      
      doValidate(me, onValidate);
      return false;
    });
    setAutoValidator(me);
    me.hide().attr('data-validator-initialized', 'true');
    
    var isLink = me.attr("href");
    if (isLink && isLink.indexOf('javascript:') > -1) {
      me.attr('onclick', isLink.replace('javascript:', ''));
    }
  });
  
};
$.validation.clear = function(selector, group) {
  selector = $(selector);
  linkSelector = 'a.validator-trigger[data-validation-group={0}]';
  if (!group) {
    group = '';
    linkSelector = 'a.validator-trigger';
  }
  var validators = selector.find('.validator' + group);
  
  validators.each(function() {
    var field = $(this).attr('data-field');
    $(field).removeClass('failed');
  });
  
  validators.hide();
  
  selector.find($.stringFormat(linkSelector, group)).removeClass('failed');
}
  
})(jQuery);


