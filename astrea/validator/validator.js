/**
 * Validation widget
 */
(function($) {
  /**
   * Create the validation widget
   */
  $.fn.bindUnique = function() {
    if (arguments.length < 2) 
      return this;
    var ns = arguments[0];
    
    return this.unbind(ns).bind.apply(this, arguments);
  };
  
  var comparison = {
    notEqual: 'notEqual',
    equal: 'equal',
    greaterThan: 'greaterThan',
    lesserThan: 'lesserThan',
    lesserOrEqual: 'lesserOrEqual',
    greaterOrEqual: 'greaterOrEqual'
  };
  
  var log = function() {
    window.console && window.console.log && window.console.log.apply(window.console, arguments);
  }
  
  function iterate(items, fn, cb) {
    //copy the items
    var copied = [].concat($.makeArray(items));
    //closure fuction to iterate over the items async
    var process = function(lastValue) {
      //var currentItem
      var item = copied.shift();
      if (copied.length == 0) {
        cb && cb(lastValue);
        return;
      }
      fn(item, function(val) {
        process(val && lastValue);
      });
    };
    process(true);
  }
  
  $.widget("ui.validator", {
    /**
     * Creates the ui and initialize dependencies
     */
    _create: function() {
      var opts = this.options, ele = this.element;
      var me = this;
      
      me.refresh();
      
    },
    _validateUnique: function(validator, val) {
      return val && val != '';
    },
    _validateCompare: function(validator, val) {
      var compareValue = validator.attr('data-comparison-value'), valid = false;
      //extract the comparison type. if none is provided the comparison type not equal will be used
      var comparisonType = validator.attr('data-comparison-type') || comparison.notEqual;
      if (compareValue) {
        switch (comparisonType) {
          case comparison.notEqual:
            valid = compareValue != val;
            break;
          case comparison.equal:
            valid = compareValue == val;
            break;
          case comparison.greaterThan:
            valid = compareValue > val;
            break;
          case comparison.lesserThan:
            valid = compareValue < val;
            break;
          case comparison.greaterOrEqual:
            valid = compareValue >= val;
            break;
          case comparison.lesserOrEqual:
            valid = compareValue <= val;
            break;
          default:
            valid = true;
            break;
        }
      }
      else {
        valid = true;
      }
      return valid;
    },
    
    _validateRegex: function(validator, val) {
      var exp = $.trim(validator.attr('data-regex'));
      var modifiers = $.trim(validator.attr('data-modifiers'));
      modifiers = (!modifiers || modifiers == '') ? null : modifiers;
      if (!exp || exp == '') 
        return false;
      
      var rx = new RegExp(exp, modifiers);
      return rx.test(val);
    },
    
    _validateRangeValidator: function(validator, val) {
      var valid = false;
      try {
        var minVal = validator.attr('data-min-value');
        var maxVal = validator.attr('data-max-value');
        var numValue = null;
        
        numValue = parseFloat(val);
        valid = numValue != null && (numValue >= parseFloat(minVal)) && (numValue <= parseFloat(maxVal));
      } 
      catch (e) {
        log('Error parsing number : ' + e.message);
      }
      return valid;
    },
    
    _validateCustomValidator: function(validator, val, field, callback) {
      var func = validator.attr('data-custom-function'), valid = false;
      if (!func) 
        return false;
      if (typeof window[func] == 'function') {
        valid = window[func](field, val, validator, callback) !== false;
      }
      return valid;
    },
    
    _evaluateVisibility: function(validator, valid, $field) {
      if (!valid) {
        this.options.hideShow && validator.fadeIn('fast');
        $field.addClass(this.options.failureClass);
        validator.addClass(this.options.failureClass);
        this.options.triggerEvents && $field.trigger('validationFailure', [validator]);
      }
      else {
        this.options.hideShow && validator.fadeOut('fast');
        $field.removeClass(this.options.failureClass);
        validator.removeClass(this.options.failureClass);
        this.options.triggerEvents && $field.trigger('validationSuccess', [validator]);
      }
    },
    _validateValidator: function(validator, notifyCallback) {
      if (!validator || validator.length == 0) 
        return;
      var valid = true;
      var field = validator.attr('data-field');
      var $field = $(field);
      var val = $.trim($field.val());
      var me = this;
      var onValidate = function(v, iv, f) {
        me._evaluateVisibility(v, iv, f);
        notifyCallback && notifyCallback(iv);
      };
      //only validate visible fields
      if ($field.is(':visible')) {
        valid = true;
        if (validator.is('.required')) {
          valid = this._validateUnique(validator, val);
        }
        if (validator.is('.compare')) {
          valid = valid && this._validateCompare(validator, val);
        }
        if (validator.is('.regex')) {
          valid = valid && this._validateRegex(validator, val);
        }
        if (validator.is('.range')) {
          valid = valid && this._validateRangeValidator(validator, val);
        }
        if (validator.is('.custom')) {
          var validForCallback = valid;
          valid = valid &&
          this._validateCustomValidator(validator, val, $field, function(isValid) {
            onValidate(validator, validForCallback && isValid, $field);
          });
          if (notifyCallback) {
            return;
          }
        }
      }
      onValidate(validator, valid, $field);
      return valid;
    },
    _initValidator: function(validator) {
      if (!validator || validator.length == 0 || validator.attr('data-validator-initialized') == 'true') 
        return;
      
      var field = $(validator.attr('data-field'));
      var me = this;
      var opts = this.options;
      field.bindUnique('blur.validator change.validator', function(e) {
        var timer = field.data('timer');
        clearTimeout(timer);
        timer = setTimeout(function() {
          me._validateValidator(validator);
        }, opts.validationThreshold);
        field.data('timer', timer);
      });
      
      if (field.is(':radio')) {
        field.bindUnique('click.validator', function(e) {
          var timer = field.data('timer');
          clearTimeout(timer);
          timer = setTimeout(function() {
            me._validateValidator(validator);
          }, opts.validationThreshold);
          field.data('timer', timer);
        });
      }
      
      if (field.is(':checkbox')) {
        field.bindUnique('click.validator', function(e) {
          var timer = field.data('timer');
          clearTimeout(timer);
          timer = setTimeout(function() {
            me._validateValidator(validator);
          }, opts.validationThreshold);
          field.data('timer', timer);
        });
      }
      
      validator.attr('data-validator-initialized', 'true');
      
    },
    
    _showSummary: function(isValid) {
      var me = this, opts = this.options, ele = this.element;
      
      if (opts.summary) {
        var summary = ele.find(opts.summary);
        summary.toggleClass(opts.failureClass, !isValid);
        opts.showHide && ((!isValid) ? summary.show() : summary.hide());
      }
    },
    
    /**
     * execute the validation of the matched validators asynchronously
     * @param {Object} selector
     * @param {Object} onValidate
     */
    validateAsync: function(selector, onValidate) {
      var me = this, opts = this.options;
      var validators = this.element.find(selector).filter(opts.validator);
      iterate(validators, function(validator, cb) {
        me._validateValidator($(validator), cb);
      }, function(isValid) {
        me._showSummary(isValid);
        onValidate(isValid);
      });
    },
    
    refresh: function() {
      var me = this, opts = this.options, ele = this.element;
      
      
      opts.dynamic &&
      ele.find(opts.validators).each(function() {
        me._initValidator($(this));
      });
      
      opts.autowire &&
      ele.find(opts.triggers).bindUnique('click.validate', function(e) {
        var $this = $(this);
        var validationGroup = $this.attr('data-validator-group') || opts.validators;
        var validationType = $this.attr('data-validation-method') || 'sync';
        
        if (validationType == 'async') {
          me.validateAsync(validationGroup, function(isValid) {
            if (isValid) {
              $this.triggerHandler('validationsuccess');
              $this.removeClass(opts.failureClass);
            }
            else {
              $this.triggerHandler('validationfailure');
              $this.addClass(opts.failureClass);
            }
          });
        }
        if (validationType == 'sync') {
          if (me.validate(validationGroup)) {
            $this.triggerHandler('validationsuccess');
            $this.removeClass(opts.failureClass);
          }
          else {
            $this.triggerHandler('validationfailure');
            $this.addClass(opts.failureClass);
          }
        }
        //always cancel default, and prevent propagation
        return false;
      });
      
      opts.clearTrigger &&
      ele.find('.validation-clear').bindUnique('click.validate', function() {
        me.clear();
        return false;
      });
    },
    
    clear: function(selector) {
      var me = this, opts = this.options, ele = this.element;
      selector = selector || opts.validators;
      //TODO avoid filter the validators if currently they're all the validators;
      ele.find(selector).filter(opts.validators).each(function() {
        var $this = $(this);
        var field = $($this.attr('data-field'));
        field.removeClass(me.options.failureClass);
        $this.removeClass(me.options.failureClass);
        opts.hideShow && $this.hide();
      });
      var triggers;
      if (selector === opts.validators) {
        triggers = ele.find(opts.triggers);
      }
      else {
        triggers = ele.find(opts.triggers).filter('*[data-validator-group={0}]'.replace('{0}', selector))
      }
      triggers.removeClass(opts.failureClass);
      if (opts.summary) {
        var summary = ele.find(opts.summary).removeClass(opts.failureClass);
        opts.showHide && summary.hide();
      }
    },
    
    /**
     * execute the validation of the validators that match the selector
     * @param {Object} selector
     * @return {Boolean} whether the validation has passed
     **/
    validate: function(selector) {
      selector = selector || this.options.validators;
      var me = this;
      var validators = this.element.find(selector).filter(this.options.validators);
      var isValid = true;
      validators.each(function() {
        var lastVal = me._validateValidator($(this));
        isValid = isValid && lastVal;
      });
      me._showSummary(isValid);
      return isValid;
    },
    
    /* defaults */
    options: {
      /* the class for the validators */
      validators: '.validator',
      /* show the validators on Error */
      hideShow: true,
      /* the class added to the field and the validator when the field does not pass the validation */
      failureClass: 'failed',
      /* if is dynamic the target fields will execute the validators on blur, change or click events */
      dynamic: true,
      /* where the fields trigger the custom events */
      triggerEvents: true,
      /* autowire the autotriggers */
      autowire: true,
      /* the auto trigger selector */
      triggers: '.validation-trigger',
      /* the summary element to be shown when the validation fails */
      summary: '.validation-summary',
      /* delay to debounce the code in the event handlers */
      validationThreshold: 200,
      /* clear trigger */
      clearTrigger: 'validation-clear'
    }
  
  
  });
  
  
  
  
})(jQuery);
