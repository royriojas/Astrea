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
    window.console &&
    window.console.log &&
    window.console.log.apply(window.console, arguments);
  }
  
  function iterate(items, fn, cb) {
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
      }, 20);
    };
    process(true);
  }
  
  function notNullOrEmpty(val) {
    return (val != null) && (val != '');
  }
  
  var rules = {};
  $.astrea = $.astrea || {};
  $.astrea.validator = {
    addRule: function(name, func, checkEmpty) {
      rules[name] = checkEmpty ? function(validator, val, field, callback) {
        var allowEmpty = !(validator.attr('data-optional') === "false");
        if (allowEmpty && val === '') {
          callback(true);
          return;
        };
        func(validator, val, field, callback);
      } : func;
    },
    getRule: function(name) {
      var fn = rules[name];
      return fn;
    },
    checkRule: function(validator, val, field, callback) {
      var validatorType = $.trim(validator.attr('data-v-type'));      
      var fn = $.astrea.validator.getRule(validatorType);
      
      if (fn) {
        fn(validator, val, field, callback);
      }
      else {
        //if not validation function this validator should fail? or succeed?
        callback(true); //trying to succeed
      }
    }
  }
  
  var basicRules = [{
    name: 'required',
    fn: function(validator, val, field, callback) {
      var valid = notNullOrEmpty(val);
      callback(valid);
    },
    checkEmpty : false
  }, {
    name: 'compare',
    fn: function(validator, val, field, callback) {
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
      callback(valid);
    }
  }, {
    name: 'range',
    fn: function(validator, val, field, callback) {
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
      callback(valid);
    }
  }, {
    name: 'regex',
    fn: function(validator, val, field, callback) {
      var exp = $.trim(validator.attr('data-regex'));
      var valid = false;
      var modifiers = $.trim(validator.attr('data-modifiers'));
      modifiers = (!modifiers || modifiers == '') ? null : modifiers;
      if (!exp || exp == '') 
        return false;
      
      try {
        var rx = null;
        if (notNullOrEmpty(modifiers)) {
          rx = new RegExp(exp, modifiers);
        }
        else {
          rx = new RegExp(exp);
        }
        valid = rx != null && rx.test(val);
      } 
      catch (e) {
        log(e.message);
      }
      callback(valid);
    }
  }, {
    name: 'custom',
    fn: function(validator, val, field, callback) {
      var func = validator.attr('data-custom-function');
      if (!func) {
        callback && callback(false);
        return;
      }
      if (typeof window[func] == 'function') {
        //custom validation that do ajax work should return undefined and use the callback
        window[func](validator, val, field, callback) !== false;
      }
    }
  }];
  
  var addRule = $.astrea.validator.addRule;
  
  $.each(basicRules, function (i, obj) {
    var checkEmpty = obj.checkEmpty == null ? true : obj.checkEmpty;
    addRule(obj.name, obj.fn, checkEmpty);
  })
  
  $.widget("ui.validator", {
    /**
     * Creates the ui and initialize dependencies
     */
    _create: function() {
      var opts = this.options, ele = this.element;
      var me = this;
      
      me.refresh();
      
    },
    _evaluateVisibility: function(validator, valid, $field) {
      if (!valid) {
        this.options.showOnError && validator.fadeIn('fast');
        var autoHide = this.options.autoHide;
        var noHide = validator.attr('data-auto-hide') === "false";
        
        if (autoHide && !noHide) {
          var timer = validator.data('showTimer');
          clearTimeout(timer);
          timer = setTimeout(function() {
            validator.fadeOut('slow');
          }, this.options.autoHideThreshold);
          validator.data('showTimer', timer);
        }
        $field.addClass(this.options.failureClass);
        validator.addClass(this.options.failureClass);
        this.options.triggerEvents && $field.trigger('validationFailure', [validator]);
      }
      else {
        this.options.showOnError && validator.fadeOut('slow');
        $field.removeClass(this.options.failureClass);
        validator.removeClass(this.options.failureClass);
        this.options.triggerEvents && $field.trigger('validationSuccess', [validator]);
      }
    },
    
    _getVal: function(field) {
      var f = field;
      if (field.is(':radio') || field.is(':checkbox')) {
        f = f.filter(':checked');
      }
      return $.trim(f.val());
    },
    
    _validateValidator: function(validator, notifyCallback) {
      if (!validator || validator.length == 0) {
        notifyCallback && notifyCallback(true);
        return true;
      }
      var me = this;
      var field = validator.attr('data-field');
      var valid = true;
      var $field = $(field);
      //disabled fields or not found fields should be true. Why validate if they don't exist?
      if ($field.length == 0 || $field.is(':disabled') || !$field.is(':visible')) {
        notifyCallback && notifyCallback(true);
        return true;
      }
      var val = this._getVal($field);
      $.astrea.validator.checkRule(validator, val, $field, function(isValid) {
        me._evaluateVisibility(validator, isValid, $field);
        notifyCallback && notifyCallback(isValid);
      });      
    },
    _initValidator: function(validator) {
      if (!validator || validator.length == 0 || validator.attr('data-validator-initialized') == 'true') 
        return;
      
      var field = $(validator.attr('data-field'));
      var notDynamic = $.trim(validator.attr('data-dynamic')) === 'false';//bind events automatically??
      if (field.length == 0 || notDynamic) 
        return;//no field to initialize
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
        opts.showOnError && ((!isValid) ? summary.show() : summary.hide());
      }
    },
    
    /**
     * execute the validation of the matched validators asynchronously
     * @param {Object} selector
     * @param {Object} onValidate
     */
    validate: function(selector, onValidate) {
      var me = this, opts = this.options;
      selector = selector || opts.validators;
      var validators = this.element.find(selector).filter(opts.validators);
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
        var validationGroup = $this.attr('data-validation-group') || opts.validators;
        var doValidate = function(isValid) {
          if (isValid) {
            $this.triggerHandler('validationsuccess');
            $this.removeClass(opts.failureClass);
          }
          else {
            $this.triggerHandler('validationfailure');
            $this.addClass(opts.failureClass);
            if (opts.autoHide) {
              var timer = $this.data('showTimer');
              timer = setTimeout(function() {
                $this.removeClass(opts.failureClass);
              }, opts.autoHideThreshold);
              
              $this.data('showTimer', timer);
            }
          }
        };
        
        
        me.validate(validationGroup, function(isValid) {
          doValidate(isValid);
        });
                
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
        opts.showOnError && $this.hide();
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
        opts.showOnError && summary.hide();
      }
    },
    /* defaults */
    options: {
      /* the class for the validators */
      validators: '.validator',
      /* show the validators on Error */
      showOnError: true,
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
      clearTrigger: 'validation-clear',
      /* autoHide */
      autoHide: true,
      /* autoHideThreshold */
      autoHideThreshold: 4000
    }
  });
  
})(jQuery);
