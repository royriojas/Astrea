/*********************************************************************
 *
 * Renderer
 *
 *********************************************************************/
jQuery.Namespace('Astrea');
/**
 * Renderer receives a dataset and a itemtemplate and renders each template
 * filling the tokens with the values per each row in the dataset like a 
 * Repeater
 * 
 * @param {Object} options
 */
Astrea.Renderer = function(options) {
  var me = this;
  var opts = {
    dataSource: [],
    itemTemplate: "",
    onRendering: null,
    onItemRendering: null,
    onItemRendered: null,
    onRendered: null
  };
  
  var tokenPattern = /\{[\w\S]+?(?:(?:\|\w+\:\'){1}.+?\')*\}/g;
  var propertyTokens = [];
  $.extend(opts, options);
  /**
   * proceed to render the dataset
   */
  me.render = function() {
    propertyTokens = opts.itemTemplate.match(tokenPattern) || [];
    
    if (opts.onRendering) {
      opts.onRendering();
    }
    var rowsRendered = "";
    for (var ix = 0; ix < opts.dataSource.length; ix++) {
    
      var row = opts.dataSource[ix];
      
      rowsRendered += me.renderSingle(row)
      
    }
    return rowsRendered;
  };
  /**
   * render a single row of the dataset
   * @param {Object} row
   */
  me.renderSingle = function(row) {
    var args = {};
    args.me = me;
    args.row = row;
    args.index = ix;
    args.skip = false;
    
    if (opts.onItemRendering) {
      opts.onItemRendering(args);
    }
    
    var result = opts.itemTemplate;
    
    if (!args.skip) {
      for (var ij = 0; ij < propertyTokens.length; ij++) {
        var token = propertyTokens[ij];
        var tokenRegex = token.replace(/[\|\[\]\(\)\.\$\%\+\-\*\/\?\!\:]/g, "\\$&");
        var rgex = new RegExp(tokenRegex, 'g');
        var objValue = Astrea.Util.findValueByKey(args.row, token);
        result = result.replace(rgex, typeof objValue === 'undefined' ? "" : objValue);
      }
      args = {};
      args.me = me;
      args.row = row;
      args.index = ix;
      args.result = result;
      if (opts.onItemRendered) {
        opts.onItemRendered(args);
      }
      return args.result;
    }
    return '';
  };
  /**
   * set the options, all at the same time
   * @param {Object} opts
   */
  me.setOptions = function(options) {
    $.extend(opts, options)
    return me;
  };
  /**
   * return all the options
   */
  me.getOptions = function() {
    return opts;
  };
  /**
   * get the option with the given name
   * @param {Object} optionName
   */
  me.getOption = function(optionName) {
    return opts[optionName];
  };
  
  /**
   * set a option with the given name and value
   * @param {Object} optionName
   * @param {Object} optionValue
   */
  me.setOption = function(optionName, optionValue) {
    opts[optionName] = optionValue;
    return me;
  };
  
  /**
   * set the datasource
   * @param {Object} dataSource
   */
  me.setDataSource = function(dataSource) {
    opts.dataSource = dataSource;
    return me;
  };
  /**
   * set the Item Template
   * @param {Object} itemTemplate
   */
  me.setItemTemplate = function(itemTemplate) {
    opts.itemTemplate = itemTemplate;
    return me;
  };
};



