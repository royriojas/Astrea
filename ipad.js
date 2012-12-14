const iPad = (navigator.platform == "iPad");
const ADSupportsTouches = ("createTouch" in document);
const ADStartEvent = ADSupportsTouches ? "touchstart" : "mousedown";
const ADMoveEvent = ADSupportsTouches ? "touchmove" : "mousemove";
const ADEndEvent = ADSupportsTouches ? "touchend" : "mouseup";
function ADUtils(){
}

ADUtils.assetsPath = "";
ADUtils.t = function(b, a){
  return ADUtils.t3d(b, a, 0)
};
ADUtils.t3d = function(b, a, c){
  return "translate3d(" + b + "px, " + a + "px, " + c + "px)"
};
ADUtils.r3d = function(a, d, c, b){
  return "rotate3d(" + a + ", " + d + ", " + c + ", " + b + "rad)"
};
ADUtils.px = function(a){
  return a + "px"
};
ADUtils.degreesToRadians = function(a){
  return (a / 360) * (Math.PI * 2)
};
ADUtils.radiansToDegrees = function(a){
  return (a / (Math.PI * 2)) * 360
};
ADUtils.copyPropertiesFromSourceToTarget = function(b, c){
  for (var a in b) {
    c[a] = b[a]
  }
};
ADUtils.objectIsFunction = function(a){
  return (typeof a == "function")
};
ADUtils.objectIsUndefined = function(a){
  return (a === undefined)
};
ADUtils.objectIsString = function(a){
  return (typeof a == "string" || a instanceof String)
};
ADUtils.objectIsArray = function(a){
  return (a instanceof Array)
};
ADUtils.objectHasMethod = function(b, a){
  return (b !== null && !this.objectIsUndefined(b[a]) && this.objectIsFunction(b[a]))
};
ADUtils.disableScrolling = function(a){
  a.stopPropagation();
  window.addEventListener("touchmove", ADUtils.preventEventDefault, true);
  window.addEventListener("touchend", ADUtils.restoreScrollingBehavior, true);
  window.addEventListener("touchcancel", ADUtils.restoreScrollingBehavior, true)
};
ADUtils.preventEventDefault = function(a){
  a.preventDefault()
};
ADUtils.restoreScrolling = function(){
  window.removeEventListener("touchmove", ADUtils.preventEventDefault, true);
  window.removeEventListener("touchend", ADUtils.restoreScrollingBehavior, true);
  window.removeEventListener("touchcancel", ADUtils.restoreScrollingBehavior, true)
};
ADUtils.createUIEvent = function(a, b){
  return ADSupportsTouches ? this.createEventWithTouch(a, b) : this.createEventWithMouse(a, b)
};
ADUtils.createEventWithTouch = function(b, a){
  var c = document.createEvent("TouchEvent");
  c.initTouchEvent(b, a.bubbles, a.cancelable, window, a.detail, a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, a.touches, a.targetTouches, a.changedTouches, a.scale, a.rotation);
  return c
};
ADUtils.createEventWithMouse = function(a, c){
  var b = document.createEvent("MouseEvent");
  b.initMouseEvent(a, c.bubbles, c.cancelable, document.defaultView, c.detail, c.screenX, c.screenY, c.clientX, c.clientY, c.ctrlKey, c.altKey, c.shiftKey, c.metaKey, c.metaKey, c.button, c.relatedTarget);
  return b
};
ADUtils.init = function(){
  if (iPad) {
    document.body.addClassName("iPad")
  }
  for (var c = 0; c < document.styleSheets.length; c++) {
    var b = document.styleSheets[c];
    var a = b.href ? b.href.indexOf("dist/AdLib") : -1;
    if (a != -1) {
      ADUtils.assetsPath = b.href.substring(0, a) + "assets/";
      break
    }
  }
};
ADUtils.preloadImageAsset = function(a){
  new Image().src = ADUtils.assetsPath + a
};
ADUtils.setupDisplayNames = function(a, c){
  var d = c || a.name;
  for (var b in a) {
    if (a.__lookupGetter__(b)) {
      continue
    }
    var e = a[b];
    if (ADUtils.objectIsFunction(e)) {
      e.displayName = ADUtils.createDisplayName(d, b)
    }
  }
  for (var b in a.prototype) {
    if (a.prototype.__lookupGetter__(b)) {
      continue
    }
    var e = a.prototype[b];
    if (ADUtils.objectIsFunction(e)) {
      e.displayName = ADUtils.createDisplayName(d, b)
    }
  }
};
ADUtils.createDisplayName = function(b, a){
  return b + "." + a + "()"
};
ADUtils.createNodeFromString = function(b){
  var a = document.implementation.createHTMLDocument();
  a.write(b);
  return document.importNode(a.body.firstElementChild, true)
};
window.addEventListener("DOMContentLoaded", ADUtils.init, false);
ADUtils.setupDisplayNames(ADUtils, "ADUtils");
var ADEventTriage = {};
ADEventTriage.handleEvent = function(c){
  if (this instanceof ADObject) {
    this.callSuper(c)
  }
  var b = c.type;
  var a = "handle" + b.charAt(0).toUpperCase() + b.substr(1);
  if (ADUtils.objectHasMethod(this, a)) {
    this[a](c)
  }
};
ADUtils.setupDisplayNames(ADEventTriage, "ADEventTriage");
var ADEventTarget = {};
ADEventTarget.addEventListener = function(b, c, a){
  this.eventTarget.addEventListener(b, c, a)
};
ADEventTarget.removeEventListener = function(b, c, a){
  this.eventTarget.removeEventListener(b, c, a)
};
ADEventTarget.dispatchEvent = function(a){
  this.eventTarget.dispatchEvent(a)
};
ADUtils.setupDisplayNames(ADEventTarget, "ADEventTarget");
var ADPropertyTriage = {};
ADPropertyTriage.handlePropertyChange = function(c, b){
  var a = "handle" + b.charAt(0).toUpperCase() + b.substr(1) + "Change";
  if (ADUtils.objectHasMethod(this, a)) {
    this[a](c)
  }
};
ADUtils.setupDisplayNames(ADPropertyTriage, "ADPropertyTriage");
Element.prototype.hasClassName = function(a){
  return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className)
};
Element.prototype.addClassName = function(a){
  if (!this.hasClassName(a)) {
    this.className = [this.className, a].join(" ")
  }
};
Element.prototype.removeClassName = function(b){
  if (this.hasClassName(b)) {
    var a = this.className;
    this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ")
  }
};
Element.prototype.toggleClassName = function(a){
  this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a)
};
ADUtils.setupDisplayNames(Element, "Element");
Node.prototype.getNearestView = function(){
  var a = this;
  while (ADUtils.objectIsUndefined(a._view) && a.parentNode) {
    a = a.parentNode
  }
  return (ADUtils.objectIsUndefined(a._view)) ? null : a._view
};
ADUtils.setupDisplayNames(Node, "Node");
function ADClass(e){
  if (ADUtils.objectIsUndefined(e.inherits) && e !== ADObject) {
    e.inherits = ADObject
  }
  if (e.includes) {
    ADClass.mixin(e.prototype, e.includes)
  }
  var b = (e.synthetizes) ? e.synthetizes : [];
  for (var a = 0; a < b.length; a++) {
    ADClass.synthetizeProperty(e.prototype, b[a], true)
  }
  var c = e;
  var b = [];
  while (c.inherits) {
    c = c.inherits;
    if (c.synthetizes) {
      b = c.synthetizes.concat(b)
    }
  }
  for (var a = 0; a < b.length; a++) {
    ADClass.synthetizeProperty(e.prototype, b[a], false)
  }
  for (var a in e.prototype) {
    if (e.prototype.__lookupGetter__(a)) {
      continue
    }
    var d = e.prototype[a];
    if (ADUtils.objectIsFunction(d)) {
      d._class = e;
      d._name = a;
      d.displayName = ADUtils.createDisplayName(e.name, a)
    }
  }
  if (e !== ADObject) {
    e.prototype.__proto__ = e.inherits.prototype
  }
}

ADClass.synthetizeProperty = function(f, j, k){
  var h = j.charAt(0).toUpperCase() + j.substr(1);
  var i = "get" + h;
  var g = "set" + h;
  var c = ADUtils.objectHasMethod(f, i);
  var a = ADUtils.objectHasMethod(f, g);
  if (!k && !(c || a)) {
    return
  }
  if (a) {
    var e = function(l){
      f[g].call(this, l);
      this.notifyPropertyChange(j)
    };
    e.displayName = "Specified setter for ." + j + " on " + f.constructor.name;
    f.__defineSetter__(j, e)
  }
  else {
    var d = function(l){
      this["_" + j] = l;
      this.notifyPropertyChange(j)
    };
    d.displayName = "Default setter for ." + j + " on " + f.constructor.name;
    f.__defineSetter__(j, d)
  }
  if (c) {
    f.__defineGetter__(j, f[i])
  }
  else {
    var b = function(){
      return this["_" + j]
    };
    b.displayName = "Default getter for ." + j + " on " + f.constructor.name;
    f.__defineGetter__(j, b)
  }
};
ADClass.mixin = function(c, a){
  for (var b = 0; b < a.length; b++) {
    ADUtils.copyPropertiesFromSourceToTarget(a[b], c)
  }
};
ADUtils.setupDisplayNames(ADClass, "ADClass");
const ADObjectPropertyChanged = "handlePropertyChange";
function ADObject(){
  this.observedProperties = {}
}

ADObject.prototype.callSuper = function(){
  var a = ADObject.prototype.callSuper.caller;
  if (ADUtils.objectHasMethod(a, "inherits")) {
    a.inherits.apply(this, arguments)
  }
  else {
    var c = a._class.inherits.prototype;
    var b = a._name;
    if (ADUtils.objectHasMethod(c, b)) {
      return c[b].apply(this, arguments)
    }
  }
};
ADObject.prototype.isPropertyObserved = function(a){
  return !ADUtils.objectIsUndefined(this.observedProperties[a])
};
ADObject.prototype.addPropertyObserver = function(c, b, a){
  if (!this.isPropertyObserved(c)) {
    this.observedProperties[c] = new Array()
  }
  else {
    if (this.observedProperties[c].indexOf(b) > -1) {
      return
    }
  }
  var a = a || ADObjectPropertyChanged;
  if (ADUtils.objectHasMethod(b, a)) {
    this.observedProperties[c].push({
      observer: b,
      methodName: a
    })
  }
};
ADObject.prototype.removePropertyObserver = function(b, a){
  if (!this.isPropertyObserved(b)) {
    return false
  }
  var d = this.observedProperties[b];
  var c = d.indexOf(a);
  if (c > -1) {
    d.splice(c, 1)
  }
  return (c > -1)
};
ADObject.prototype.notifyPropertyChange = function(b){
  if (!this.isPropertyObserved(b)) {
    return
  }
  var d = this.observedProperties[b];
  for (var c = 0; c < d.length; c++) {
    var a = d[c];
    a.observer[a.methodName](this, b)
  }
};
ADObject.prototype.callMethodNameAfterDelay = function(a, d){
  var e = this;
  var c = Array.prototype.slice.call(arguments, 2);
  var b = function(){
    e[a].apply(e, c)
  };
  b.displayName = ADUtils.createDisplayName(this.constructor.name, a);
  return setTimeout(b, d)
};
ADClass(ADObject, "ADObject");
function ADPoint(a, b){
  this.x = (a != null && !isNaN(a)) ? a : 0;
  this.y = (b != null && !isNaN(b)) ? b : 0
}

ADPoint.fromEvent = function(a){
  var a = (a.touches && a.touches.length > 0) ? a.touches[0] : a;
  return new ADPoint(a.pageX, a.pageY)
};
ADPoint.fromEventInElement = function(b, a){
  var b = (b.touches && b.touches.length > 0) ? b.touches[0] : b;
  return window.webkitConvertPointFromPageToNode(a, new WebKitPoint(b.pageX, b.pageY))
};
ADPoint.prototype.toString = function(){
  return "ADPoint[" + this.x + "," + this.y + "]"
};
ADPoint.prototype.copy = function(){
  return new ADPoint(this.x, this.y)
};
ADPoint.prototype.equals = function(a){
  return (this.x == a.x && this.y == a.y)
};
ADUtils.setupDisplayNames(ADPoint, "ADPoint");
function ADSize(b, a){
  this.width = (b != null && !isNaN(b)) ? b : 0;
  this.height = (a != null && !isNaN(a)) ? a : 0
}

ADSize.prototype.toString = function(){
  return "ADSize[" + this.width + "," + this.height + "]"
};
ADSize.prototype.copy = function(){
  return new ADSize(this.width, this.height)
};
ADSize.prototype.equals = function(a){
  return (this.width == a.width && this.height == a.height)
};
ADUtils.setupDisplayNames(ADSize);
function ADEdgeInsets(d, b, a, c){
  this.top = d;
  this.right = b;
  this.bottom = a;
  this.left = c
}

ADImage.inherits = ADObject;
ADImage.synthetizes = ["width", "height"];
function ADImage(a){
  this.callSuper();
  this.url = a;
  this.loaded = false;
  this.element = new Image();
  this.element.src = a;
  this.element.addEventListener("load", this, false);
  this._width = 0;
  this._height = 0
}

ADImage.prototype.getWidth = function(){
  return this.element.width
};
ADImage.prototype.getHeight = function(){
  return this.element.height
};
ADImage.prototype.handleEvent = function(a){
  this.loaded = true;
  this.notifyPropertyChange("loaded")
};
ADClass(ADImage);
const ADAnimatorLinearType = 0;
const ADAnimatorSplinesType = 1;
const ADAnimatorInvalidArgsException = 2;
const ADAnimatorAnimationDidIterate = "animationDidIterate";
const ADAnimatorAnimationDidEnd = "animationDidEnd";
function ADAnimator(b, a, c){
  if (arguments.length != 2 && arguments.length != 3 && arguments.length != 7) {
    throw ADAnimatorInvalidArgsException;
    return false
  }
  this.ready = false;
  this.animating = false;
  this.timer = null;
  this.duration = b;
  this.delegate = a;
  if (!ADUtils.objectHasMethod(this.delegate, ADAnimatorAnimationDidIterate)) {
    return
  }
  if (arguments.length >= 2) {
    this.type = ADAnimatorSplinesType;
    this.x1 = c[0];
    this.y1 = c[1];
    this.x2 = c[2];
    this.y2 = c[3];
    this.init()
  }
  else {
    this.type = ADAnimatorLinearType
  }
  this.ready = true
}

ADAnimator.prototype.init = function(){
  this.cx = 3 * this.x1;
  this.bx = 3 * (this.x2 - this.x1) - this.cx;
  this.ax = 1 - this.cx - this.bx;
  this.cy = 3 * this.y1;
  this.by = 3 * (this.y2 - this.y1) - this.cy;
  this.ay = 1 - this.cy - this.by;
  var c = (this.duration / 1000) * 240;
  this.curve = new Array(c);
  var d = 1 / (c - 1);
  for (var b = 0; b < c; b++) {
    var a = b * d;
    this.curve[b] = {
      x: (this.ax * Math.pow(a, 3)) + (this.bx * Math.pow(a, 2)) + (this.cx * a),
      y: (this.ay * Math.pow(a, 3)) + (this.by * Math.pow(a, 2)) + (this.cy * a)
    }
  }
};
ADAnimator.prototype.start = function(){
  if (!this.ready) {
    var a = this;
    this.timer = setTimeout(function(){
      a.start()
    }, 0);
    return
  }
  this.animating = true;
  this.lastIndex = 0;
  this.startTime = (new Date()).getTime();
  this.iterate()
};
ADAnimator.prototype.stop = function(){
  this.animating = false;
  clearTimeout(this.timer)
};
ADAnimator.prototype.iterate = function(){
  var c = (new Date()).getTime() - this.startTime;
  if (c < this.duration) {
    var b = c / this.duration;
    if (this.type == ADAnimatorSplinesType) {
      var g = 0;
      for (var d = this.lastIndex; d < this.curve.length; d++) {
        var a = this.curve[d];
        if (a.x >= b && d > 0) {
          var e = this.curve[d - 1];
          if ((b - e.x) < (a.x - b)) {
            this.lastIndex = d - 1;
            g = e.y
          }
          else {
            this.lastIndex = d;
            g = a.y
          }
          break
        }
      }
    }
    this.delegate[ADAnimatorAnimationDidIterate]((this.type == ADAnimatorSplinesType) ? g : b);
    var f = this;
    this.timer = setTimeout(function(){
      f.iterate()
    }, 0)
  }
  else {
    this.delegate[ADAnimatorAnimationDidIterate](1);
    if (ADUtils.objectHasMethod(this.delegate, ADAnimatorAnimationDidEnd)) {
      this.delegate[ADAnimatorAnimationDidEnd]()
    }
    this.animating = false
  }
};
ADClass(ADAnimator);
const ADTransitionDidCompleteDelegate = "transitionDidComplete";
const ADTransitionDefaults = {
  duration: 0.5,
  delay: 0,
  removesTargetUponCompletion: false,
  revertsToOriginalValues: false
};
const ADTransitionStyles = ["-webkit-transition-property", "-webkit-transition-duration", "-webkit-transition-timing-function", "-webkit-transition-delay", "-webkit-transition"];
function ADTransition(a){
  this.target = null;
  this.properties = null;
  this.duration = null;
  this.delay = null;
  this.from = null;
  this.to = null;
  this.timingFunction = null;
  this.delegate = null;
  this.removesTargetUponCompletion = null;
  this.revertsToOriginalValues = null;
  this.defaultsApplied = false;
  this.archivedStyles = null;
  this.archivedValues = [];
  ADUtils.copyPropertiesFromSourceToTarget(a, this)
}

ADTransition.prototype.applyDefaults = function(){
  if (this.defaultsApplied) {
    return
  }
  for (var a in ADTransitionDefaults) {
    if (this[a] === null) {
      this[a] = ADTransitionDefaults[a]
    }
  }
  this.defaultsApplied = true
};
ADTransition.prototype.archiveTransitionStyles = function(){
  if (this.archivedStyles !== null) {
    return
  }
  var b = (this.target instanceof ADView) ? this.target.layer : this.target;
  this.archivedStyles = [];
  for (var a = 0; a < ADTransitionStyles.length; a++) {
    this.archivedStyles.push(b.style.getPropertyValue(ADTransitionStyles[a]))
  }
};
ADTransition.prototype.restoreTransitionStyles = function(){
  for (var a = 0; a < ADTransitionStyles.length; a++) {
    this.element.style.setProperty(ADTransitionStyles[a], this.archivedStyles[a], "")
  }
  this.archivedStyles = null
};
ADTransition.prototype.archiveBaseValues = function(){
  if (!this.revertsToOriginalValues) {
    return
  }
  if (this.target instanceof ADView) {
    for (var a = 0; a < this.properties.length; a++) {
      this.archivedValues.push(this.target[this.properties[a]])
    }
  }
  else {
    for (var a = 0; a < this.properties.length; a++) {
      this.archivedValues.push(this.target.layer.style.getPropertyValue(this.properties[a]))
    }
  }
};
ADTransition.prototype.restoreBaseValues = function(){
  if (this.target instanceof ADView) {
    for (var a = 0; a < this.properties.length; a++) {
      this.target[this.properties[a]] = this.archivedValues[a]
    }
  }
  else {
    for (var a = 0; a < this.properties.length; a++) {
      this.target.layer.style.setProperty(this.properties[a], this.archivedValues[a], null)
    }
  }
};
ADTransition.prototype.start = function(){
  if (ADTransaction.openTransactions > 0) {
    ADTransaction.addTransition(this);
    return
  }
  this.applyDefaults();
  if (this.from === null) {
    this.applyToState()
  }
  else {
    this.applyFromState();
    var a = this;
    setTimeout(function(){
      a.applyToState()
    }, 0)
  }
};
ADTransition.prototype.applyFromState = function(){
  if (this.from === null) {
    return
  }
  this.applyDefaults();
  this.archiveTransitionStyles();
  if (this.target instanceof ADView) {
    this.target.layer.style.webkitTransitionDuration = 0;
    for (var a = 0; a < this.properties.length; a++) {
      this.target[this.properties[a]] = this.processTransitionValue(this.from[a])
    }
  }
  else {
    this.target.style.webkitTransitionDuration = 0;
    for (var a = 0; a < this.properties.length; a++) {
      this.target.style.setProperty(this.properties[a], this.from[a], "")
    }
  }
};
ADTransition.prototype.applyToState = function(){
  this.applyDefaults();
  this.archiveTransitionStyles();
  this.archiveBaseValues();
  var d = (this.target instanceof ADView);
  this.cssProperties = [];
  var g = [];
  for (var b = 0; b < this.properties.length; b++) {
    var e = (d) ? this.target.cssPropertyNameForJSProperty(this.properties[b]) : this.properties[b];
    if (this.cssProperties.indexOf(e) > -1) {
      continue
    }
    var f = (ADUtils.objectIsArray(this.duration)) ? this.duration[b] : this.duration;
    var c = (ADUtils.objectIsArray(this.timingFunction)) ? this.timingFunction[b] : this.timingFunction;
    var a = (ADUtils.objectIsArray(this.delay)) ? this.delay[b] : this.delay;
    g.push([e, f + "s", c, a + "s"].join(" "));
    this.cssProperties.push(e)
  }
  if (d) {
    this.element = this.target.layer;
    for (var b = 0; b < this.properties.length; b++) {
      this.target[this.properties[b]] = this.processTransitionValue(this.to[b])
    }
  }
  else {
    this.element = this.target;
    for (var b = 0; b < this.properties.length; b++) {
      this.target.style.setProperty(this.properties[b], this.to[b], "")
    }
  }
  this.element.style.webkitTransition = g.join(", ");
  this.element.addEventListener("webkitTransitionEnd", this, false);
  this.completedTransitions = 0
};
ADTransition.prototype.handleEvent = function(a){
  if (a.currentTarget !== this.element) {
    return
  }
  this.completedTransitions++;
  if (this.completedTransitions != this.cssProperties.length) {
    return
  }
  if (ADUtils.objectHasMethod(this.delegate, ADTransitionDidCompleteDelegate)) {
    this.delegate[ADTransitionDidCompleteDelegate](this)
  }
  if (this.removesTargetUponCompletion) {
    var b = this.target;
    if (this.target instanceof ADView) {
      b.removeFromSuperview()
    }
    else {
      b.parentNode.removeChild(b)
    }
  }
  else {
    this.restoreTransitionStyles()
  }
  if (this.revertsToOriginalValues) {
    this.restoreBaseValues()
  }
};
const ADTransitionWidthRegExp = new RegExp(/\$width/g);
const ADTransitionHeightRegExp = new RegExp(/\$height/g);
ADTransition.prototype.processTransitionValue = function(a){
  if (!ADUtils.objectIsString(a)) {
    return a
  }
  a = a.replace(ADTransitionWidthRegExp, ADUtils.px(this.target.size.width));
  return a.replace(ADTransitionHeightRegExp, ADUtils.px(this.target.size.height))
};
ADClass(ADTransition);
var ADTransaction = {
  transitions: [],
  openTransactions: 0,
  defaults: {},
  defaultsStates: []
};
ADTransaction.begin = function(){
  if (this.openTransactions == 0) {
    this.transitions = [];
    this.defaults = {}
  }
  else {
    this.defaultsStates.push(this.defaults)
  }
  this.openTransactions++
};
ADTransaction.addTransition = function(b){
  for (var a in this.defaults) {
    if (b[a] === null) {
      b[a] = this.defaults[a]
    }
  }
  this.transitions.push(b)
};
ADTransaction.commit = function(){
  if (this.openTransactions == 0) {
    return
  }
  this.openTransactions--;
  if (this.openTransactions != 0) {
    this.defaults = this.defaultsStates.pop();
    return
  }
  var b = this.transitions;
  for (var a = 0; a < b.length; a++) {
    b[a].applyFromState()
  }
  setTimeout(function(){
    for (var c = 0; c < b.length; c++) {
      b[c].applyToState()
    }
  }, 0)
};
ADUtils.setupDisplayNames(ADTransaction, "ADTransaction");
const ADAnimationDidCompleteDelegate = "animationDidComplete";
const ADAnimationDefaults = {
  duration: 1,
  delay: 0,
  removesTargetUponCompletion: false,
  timingFunction: "ease"
};
const ADAnimationStyles = ["-webkit-animation-name", "-webkit-animation-timing-function", "-webkit-animation-duration", "-webkit-animation-iteration-count", "-webkit-animation-direction", "-webkit-animation-delay", "-webkit-animation"];
function ADAnimation(a){
  this.rule = ADAnimation.createRule();
  this.target = null;
  this.duration = null;
  this.delay = null;
  this.keyframes = [];
  this.timingFunction = null;
  this.delegate = null;
  this.removesTargetUponCompletion = null;
  ADUtils.copyPropertiesFromSourceToTarget(a, this);
  this.init()
}

ADAnimation.prototype.init = function(){
  for (var c in ADAnimationDefaults) {
    if (this[c] === null) {
      this[c] = ADAnimationDefaults[c]
    }
  }
  this.archiveAnimationStyles();
  var d = this.target.layer.style;
  for (var c = 0; c < ADAnimationStyles; c++) {
    d.setProperty(ADAnimationStyles[c], "", "")
  }
  for (var c = 0; c < this.keyframes.length; c++) {
    var b = this.keyframes[c];
    var e = (b.offset * 100) + "% {";
    for (var a = 0; a < b.values.length; a += 2) {
      e += this.target.cssPropertyNameForJSProperty(b.values[a]) + ": " + b.values[a + 1] + ";"
    }
    e += "}";
    this.rule.insertRule(e)
  }
};
ADAnimation.prototype.start = function(){
  var a = this.target.layer.style;
  a.webkitAnimationName = this.rule.name;
  a.webkitAnimationDuration = this.duration + "s";
  a.webkitAnimationDelay = this.delay + "s";
  a.webkitAnimationTimingFunction = this.timingFunction;
  this.target.layer.addEventListener("webkitAnimationEnd", this, false)
};
ADAnimation.prototype.archiveAnimationStyles = function(){
  this.archivedStyles = [];
  for (var a = 0; a < ADAnimationStyles.length; a++) {
    this.archivedStyles.push(this.target.layer.style.getPropertyValue(ADAnimationStyles[a]))
  }
};
ADAnimation.prototype.restoreAnimationStyles = function(){
  for (var a = 0; a < ADAnimationStyles.length; a++) {
    this.target.layer.style.setProperty(ADAnimationStyles[a], this.archivedStyles[a], "")
  }
};
ADAnimation.prototype.handleEvent = function(c){
  if (c.currentTarget !== this.target.layer) {
    return
  }
  var a = this.keyframes[this.keyframes.length - 1].values;
  for (var b = 0; b < a.length; b += 2) {
    this.target[a[b]] = a[b + 1]
  }
  if (ADUtils.objectHasMethod(this.delegate, ADAnimationDidCompleteDelegate)) {
    this.delegate[ADAnimationDidCompleteDelegate](this)
  }
  if (this.removesTargetUponCompletion) {
    this.target.removeFromSuperview()
  }
  else {
    this.restoreAnimationStyles()
  }
};
ADClass(ADAnimation);
ADAnimation.counter = 0;
ADAnimation.createRule = function(){
  var c = document.styleSheets[0];
  var b = "AD-Animation-" + this.counter++;
  var a = c.insertRule("@-webkit-keyframes " + b + " { }", c.rules.length);
  return c.rules.item(a)
};
const ADViewTransitionDissolveOut = {
  properties: ["opacity"],
  from: [1],
  to: [0]
};
const ADViewTransitionDissolveIn = {
  properties: ["opacity"],
  from: [0],
  to: [1]
};
const ADViewTransitionZoomIn = {
  properties: ["opacity", "transform"],
  from: [0, "scale(0.2)"],
  to: [1, "scale(1)"]
};
const ADViewTransitionZoomOut = {
  properties: ["opacity", "transform"],
  from: [0, "scale(1.2)"],
  to: [1, "scale(1)"]
};
const ADViewTransitionCrossSpinRight = {
  properties: ["opacity", "transform"],
  from: [0, "rotate(20deg)"],
  to: [1, "rotate(0)"]
};
const ADViewTransitionCrossSpinLeft = {
  properties: ["opacity", "transform"],
  from: [0, "rotate(-20deg)"],
  to: [1, "rotate(0)"]
};
const ADViewTransitionFlipLeftOut = {
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg)"],
  to: ["perspective(800) rotateY(-180deg)"]
};
const ADViewTransitionFlipLeftIn = {
  properties: ["transform"],
  from: ["perspective(800) rotateY(180deg)"],
  to: ["perspective(800) rotateY(0deg)"]
};
const ADViewTransitionFlipRightOut = {
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg)"],
  to: ["perspective(800) rotateY(180deg)"]
};
const ADViewTransitionFlipRightIn = {
  properties: ["transform"],
  from: ["perspective(800) rotateY(-180deg)"],
  to: ["perspective(800) rotateY(0deg)"]
};
const ADViewTransitionCubeLeftOut = {
  base: ["anchorPoint", new ADPoint(1, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg) translateZ(0)"],
  to: ["perspective(800) rotateY(-90deg) translateZ($width)"]
};
const ADViewTransitionCubeLeftIn = {
  base: ["anchorPoint", new ADPoint(0, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(90deg) translateZ($width)"],
  to: ["perspective(800) rotateY(0deg) translateZ(0)"]
};
const ADViewTransitionCubeRightOut = {
  base: ["anchorPoint", new ADPoint(0, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg) translateZ(0)"],
  to: ["perspective(800) rotateY(90deg) translateZ($width)"]
};
const ADViewTransitionCubeRightIn = {
  base: ["anchorPoint", new ADPoint(1, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(-90deg) translateZ($width)"],
  to: ["perspective(800) rotateY(0deg) translateZ(0)"]
};
const ADViewTransitionDoorOpenLeftOut = {
  base: ["anchorPoint", new ADPoint(0, 0.5), "zIndex", 1],
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg)"],
  to: ["perspective(800) rotateY(-90deg)"]
};
const ADViewTransitionDoorCloseLeftIn = {
  base: ["anchorPoint", new ADPoint(0, 0.5), "zIndex", 2],
  properties: ["transform"],
  from: ["perspective(800) rotateY(-90deg)"],
  to: ["perspective(800) rotateY(0deg)"]
};
const ADViewTransitionDoorOpenRightOut = {
  base: ["anchorPoint", new ADPoint(1, 0.5), "zIndex", 1],
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg)"],
  to: ["perspective(800) rotateY(90deg)"]
};
const ADViewTransitionDoorCloseRightIn = {
  base: ["anchorPoint", new ADPoint(1, 0.5), "zIndex", 2],
  properties: ["transform"],
  from: ["perspective(800) rotateY(90deg)"],
  to: ["perspective(800) rotateY(0deg)"]
};
const ADViewTransitionRevolveTowardsLeftOut = {
  base: ["anchorPoint", new ADPoint(0, 0.5)],
  properties: ["transform", "opacity"],
  from: ["perspective(800) rotateY(0deg)", 1],
  to: ["perspective(800) rotateY(-90deg)", 0]
};
const ADViewTransitionRevolveTowardsLeftIn = {
  base: ["anchorPoint", new ADPoint(0, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(90deg)"],
  to: ["perspective(800) rotateY(0deg)"]
};
const ADViewTransitionRevolveAwayLeftOut = {
  base: ["anchorPoint", new ADPoint(0, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg)"],
  to: ["perspective(800) rotateY(90deg)"]
};
const ADViewTransitionRevolveAwayLeftIn = {
  base: ["anchorPoint", new ADPoint(0, 0.5)],
  properties: ["transform", "opacity"],
  from: ["perspective(800) rotateY(-90deg)", 0],
  to: ["perspective(800) rotateY(0deg)", 1]
};
const ADViewTransitionRevolveTowardsRightOut = {
  base: ["anchorPoint", new ADPoint(1, 0.5)],
  properties: ["transform", "opacity"],
  from: ["perspective(800) rotateY(0deg)", 1],
  to: ["perspective(800) rotateY(90deg)", 0]
};
const ADViewTransitionRevolveTowardsRightIn = {
  base: ["anchorPoint", new ADPoint(1, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(-90deg)"],
  to: ["perspective(800) rotateY(0deg)"]
};
const ADViewTransitionRevolveAwayRightOut = {
  base: ["anchorPoint", new ADPoint(1, 0.5)],
  properties: ["transform"],
  from: ["perspective(800) rotateY(0deg)"],
  to: ["perspective(800) rotateY(-90deg)"]
};
const ADViewTransitionRevolveAwayRightIn = {
  base: ["anchorPoint", new ADPoint(1, 0.5)],
  properties: ["transform", "opacity"],
  from: ["perspective(800) rotateY(90deg)", 0],
  to: ["perspective(800) rotateY(0deg)", 1]
};
const ADViewTransitionSpinOut = {
  properties: ["transform", "opacity"],
  from: ["perspective(800) rotate(0)", 1],
  to: ["perspective(800) rotate(-180deg)", 0]
};
const ADViewTransitionSpinIn = {
  base: ["zIndex", 1],
  properties: ["transform", "opacity"],
  from: ["perspective(800) rotate(-180deg)", 0],
  to: ["perspective(800) rotate(0)", 1]
};
const ADViewTransitionScaleIn = {
  base: ["zIndex", 1],
  properties: ["transform"],
  from: ["scale(0.01)"],
  to: ["scale(1)"]
};
const ADViewTransitionScaleOut = {
  base: ["zIndex", 1],
  properties: ["transform"],
  from: ["scale(1)"],
  to: ["scale(0.01)"]
};
function ADViewLayerInsertionNotificationHelper(){
  this.callSuper();
  this.views = [];
  document.addEventListener("DOMSubtreeModified", this, true)
}

ADViewLayerInsertionNotificationHelper.prototype.considerView = function(a){
  if (this.views.indexOf(a) == -1) {
    a._ignoreView = false;
    this.views.push(a)
  }
};
ADViewLayerInsertionNotificationHelper.prototype.handleEvent = function(a){
  this.processViews()
};
ADViewLayerInsertionNotificationHelper.prototype.processViews = function(){
  if (this.views.length < 1) {
    return
  }
  var a;
  for (var c = 0; c < this.views.length; ++c) {
    a = this.views[c];
    for (var b = a.superview; b && !a._ignoreView; b = b.superview) {
      if ("_ignoreView" in b) {
        a._ignoreView = true
      }
    }
  }
  while (this.views.length > 0) {
    a = this.views.pop();
    if (a._ignoreView) {
      delete a._ignoreView;
      continue
    }
    delete a._ignoreView;
    a.dispatchNotificationOfLayerInsertionIntoDocument()
  }
};
ADClass(ADViewLayerInsertionNotificationHelper);
ADView.inherits = ADObject;
ADView.synthetizes = ["id", "position", "size", "transform", "anchorPoint", "doubleSided", "zIndex", "opacity", "clipsToBounds", "transitionsEnabled", "transitionsDuration", "hostingLayer"];
ADView.layerInsertionNotificationHelper = new ADViewLayerInsertionNotificationHelper();
function ADView(){
  this.callSuper();
  this.superview = null;
  this.subviews = [];
  this.tracksTouchesOnceTouchesBegan = false;
  this.userInteractionEnabled = true;
  this.autoresizesSubviews = true;
  this.autoresizingMask = ADViewAutoresizingNone;
  this.layerIsInDocument = false;
  this._position = new ADPoint();
  this._size = new ADSize();
  this._anchorPoint = new ADPoint(0.5, 0.5);
  this._doubleSided = true;
  this._zIndex = 0;
  this._transform = ADUtils.t(0, 0);
  this._clipsToBounds = false;
  this._transitionsEnabled = false;
  this._transitionsDuration = 0.5;
  this._hostingLayer = null;
  if (ADUtils.objectIsUndefined(this.layer) || this.layer === null) {
    this.createLayer()
  }
  this.layer.addEventListener(ADStartEvent, this, false);
  this.layer.addEventListener("DOMNodeInsertedIntoDocument", this, true);
  this.layer.addEventListener("DOMNodeRemovedFromDocument", this, true);
  this.layer._view = this
}

ADView.prototype.toString = function(){
  return [this.constructor.name, "[", this._size.width, "x", this._size.height, "@", this._position.x, ",", this._position.y, "]"].join("")
};
ADView.prototype.getId = function(){
  return this.layer.id
};
ADView.prototype.setId = function(a){
  this.layer.id = a
};
ADView.prototype.setPosition = function(a){
  if (this._position.equals(a)) {
    return
  }
  this._position = a;
  this.updateLayerTransform()
};
ADView.prototype.setSize = function(a){
  if (this._size.equals(a)) {
    return
  }
  var b = this._size.copy();
  this._size = a;
  this.layer.style.width = a.width + "px";
  this.layer.style.height = a.height + "px";
  if (this.autoresizesSubviews) {
    this.resizeSubviewsWithOldSize(b)
  }
};
ADView.prototype.setTransform = function(a){
  this._transform = a;
  this.updateLayerTransform()
};
ADView.prototype.setAnchorPoint = function(a){
  this._anchorPoint = a;
  this.layer.style.webkitTransformOrigin = Math.round(a.x * 100) + "% " + Math.round(a.y * 100) + "% 0"
};
ADView.prototype.setDoubleSided = function(a){
  this._doubleSided = a;
  this.layer.style.webkitBackfaceVisibility = a ? "visible" : "hidden"
};
ADView.prototype.setZIndex = function(a){
  this._zIndex = a;
  this.layer.style.zIndex = a
};
ADView.prototype.updateLayerTransform = function(){
  this.layer.style.webkitTransform = ADUtils.t(this._position.x, this._position.y) + this._transform
};
ADView.prototype.getOpacity = function(){
  return Number(window.getComputedStyle(this.layer).opacity)
};
ADView.prototype.setOpacity = function(a){
  this.layer.style.opacity = a
};
ADView.prototype.setTransitionsEnabled = function(a){
  if (a) {
    this.layer.style.webkitTransitionProperty = "-webkit-transform, opacity";
    this.layer.style.webkitTransitionDuration = this._transitionsDuration + "s"
  }
  else {
    this.layer.style.webkitTransitionDuration = "0s"
  }
  this._transitionsEnabled = a
};
ADView.prototype.setTransitionsDuration = function(a){
  this.layer.style.webkitTransitionDuration = a + "s";
  this._transitionsDuration = a
};
ADView.prototype.setClipsToBounds = function(a){
  this._clipsToBounds = a;
  this.layer.style.overflow = a ? "hidden" : "visible"
};
ADView.prototype.getHostingLayer = function(){
  return (this._hostingLayer != null) ? this._hostingLayer : this.layer
};
ADView.prototype.addSubview = function(a){
  return this.insertSubviewAtIndex(a, this.subviews.length)
};
ADView.prototype.removeFromSuperview = function(){
  if (this.superview == null) {
    return
  }
  this.willMoveToSuperview(null);
  this.superview.willRemoveSubview(this);
  var a = this._indexInSuperviewSubviews;
  this.superview.subviews.splice(a, 1);
  for (var b = a; b < this.superview.subviews.length; b++) {
    this.superview.subviews[b]._indexInSuperviewSubviews = b
  }
  this.layer.parentNode.removeChild(this.layer);
  this.superview = null;
  this.didMoveToSuperview()
};
ADView.prototype.insertSubviewAtIndex = function(d, a){
  if (a > this.subviews.length) {
    return
  }
  if (d.superview === this) {
    a--
  }
  d.removeFromSuperview();
  d.willMoveToSuperview(this);
  this.subviews.splice(a, 0, d);
  d._indexInSuperviewSubviews = a;
  for (var b = a + 1; b < this.subviews.length; b++) {
    this.subviews[b]._indexInSuperviewSubviews = b
  }
  var c = this.hostingLayer;
  if (a == this.subviews.length - 1) {
    c.appendChild(d.layer)
  }
  else {
    c.insertBefore(d.layer, this.subviews[a + 1].layer)
  }
  d.superview = this;
  d.didMoveToSuperview();
  this.didAddSubview(d);
  return d
};
ADView.prototype.insertSubviewAfterSubview = function(b, a){
  if (a.superview !== this) {
    return
  }
  var c = a._indexInSuperviewSubviews + 1;
  if (c < this.subviews.length) {
    this.insertSubviewAtIndex(b, c)
  }
  else {
    this.addSubview(b)
  }
  return b
};
ADView.prototype.insertSubviewBeforeSubview = function(b, a){
  if (a.superview !== this) {
    return
  }
  return this.insertSubviewAtIndex(b, a._indexInSuperviewSubviews)
};
ADView.prototype.exchangeSubviewsAtIndices = function(b, a){
  if (b >= this.subviews.length || a >= this.subviews.length) {
    return
  }
  var d = this.subviews[b];
  var g = this.subviews[a];
  this.subviews[b] = g;
  this.subviews[a] = d;
  d._indexInSuperviewSubviews = a;
  g._indexInSuperviewSubviews = b;
  var h = d.layer;
  var f = g.layer;
  var i = this.hostingLayer;
  var e = h.nextSibling;
  var c = f.nextSibling;
  if (e != null) {
    i.insertBefore(f, e)
  }
  else {
    i.appendChild(f)
  }
  if (c != null) {
    i.insertBefore(h, c)
  }
  else {
    i.appendChild(h)
  }
};
ADView.prototype.isDescendantOfView = function(b){
  var c = false;
  var a = this;
  while (a.superview != null) {
    if (a.superview === b) {
      c = true;
      break
    }
    a = a.superview
  }
  return c
};
ADView.prototype.createLayer = function(){
  this.layer = document.createElement("div");
  this.layer.className = "ad-view"
};
ADView.prototype.willMoveToSuperview = function(a){
};
ADView.prototype.didMoveToSuperview = function(){
};
ADView.prototype.didAddSubview = function(a){
};
ADView.prototype.willRemoveSubview = function(a){
};
ADView.prototype.layerWasInsertedIntoDocument = function(){
  this.layerIsInDocument = true
};
ADView.prototype.layerWasRemovedFromDocument = function(){
};
ADView.prototype.handleLayerInsertionIntoDocument = function(a){
  if (a.target !== this.layer || this.layer.ownerDocument !== document || this.layerIsInDocument) {
    return
  }
  a.stopPropagation();
  ADView.layerInsertionNotificationHelper.considerView(this)
};
ADView.prototype.dispatchNotificationOfLayerInsertionIntoDocument = function(){
  var c = [];
  var a = [].concat(this.subviews);
  var d = 0;
  while (a.length > 0) {
    var e = a.shift();
    if (typeof(e) === "number") {
      d = e
    }
    else {
      if (c[d] === undefined) {
        c[d] = []
      }
      c[d].push(e);
      a = a.concat(d + 1, e.subviews)
    }
  }
  var b;
  while (c.length > 0) {
    b = c.pop();
    while (b.length > 0) {
      b.pop().layerWasInsertedIntoDocument()
    }
  }
  this.layerWasInsertedIntoDocument()
};
ADView.prototype.handleLayerRemovalFromDocument = function(a){
  if (a.target === this.layer && this.layer.ownerDocument === document) {
    a.stopPropagation();
    this.layerIsInDocument = false;
    this.layerWasRemovedFromDocument()
  }
};
ADView.prototype.handleEvent = function(a){
  switch (a.type) {
    case ADStartEvent:
      this.touchesBegan(a);
      break;
    case ADMoveEvent:
      this.touchesMoved(a);
      break;
    case ADEndEvent:
      this.touchesEnded(a);
      break;
    case "touchcancel":
      this.touchesCancelled(a);
      break;
    case "DOMNodeInsertedIntoDocument":
      this.handleLayerInsertionIntoDocument(a);
      break;
    case "DOMNodeRemovedFromDocument":
      this.handleLayerRemovalFromDocument(a);
      break
  }
};
ADView.prototype.touchesBegan = function(a){
  if (!this.userInteractionEnabled) {
    return
  }
  if (this.tracksTouchesOnceTouchesBegan) {
    window.addEventListener(ADMoveEvent, this, true);
    window.addEventListener(ADEndEvent, this, true);
    window.addEventListener("touchcancel", this, true)
  }
};
ADView.prototype.touchesMoved = function(a){
  if (!this.userInteractionEnabled) {
    return
  }
  a.preventDefault()
};
ADView.prototype.touchesEnded = function(a){
  if (!this.userInteractionEnabled) {
    return
  }
  window.removeEventListener(ADMoveEvent, this, true);
  window.removeEventListener(ADEndEvent, this, true);
  window.removeEventListener("touchcancel", this, true)
};
ADView.prototype.touchesCancelled = function(a){
  if (!this.userInteractionEnabled) {
    return
  }
  window.removeEventListener(ADMoveEvent, this, true);
  window.removeEventListener(ADEndEvent, this, true);
  window.removeEventListener("touchcancel", this, true)
};
ADView.prototype.pointInside = function(a){
  return (a.x >= 0 && a.x <= this.size.width && a.y >= 0 && a.y <= this.size.height)
};
const ADViewAutoresizingNone = 0;
const ADViewAutoresizingFlexibleLeftMargin = 1 << 0;
const ADViewAutoresizingFlexibleWidth = 1 << 1;
const ADViewAutoresizingFlexibleRightMargin = 1 << 2;
const ADViewAutoresizingFlexibleTopMargin = 1 << 3;
const ADViewAutoresizingFlexibleHeight = 1 << 4;
const ADViewAutoresizingFlexibleBottomMargin = 1 << 5;
ADView.prototype.resizeSubviewsWithOldSize = function(b){
  for (var a = 0; a < this.subviews.length; a++) {
    this.subviews[a].resizeWithOldSuperviewSize(b)
  }
};
ADView.prototype.resizeWithOldSuperviewSize = function(f){
  var a = this._position.copy();
  var e = this._size.copy();
  var c = this.autoresizingMask;
  var d = (c & ADViewAutoresizingFlexibleLeftMargin) + (c & ADViewAutoresizingFlexibleWidth) + (c & ADViewAutoresizingFlexibleRightMargin);
  switch (d) {
    case ADViewAutoresizingNone:
      break;
    case ADViewAutoresizingFlexibleLeftMargin:
      a.x += this.superview._size.width - f.width;
      break;
    case ADViewAutoresizingFlexibleWidth:
      e.width = this.superview._size.width - (f.width - this._size.width);
      break;
    case ADViewAutoresizingFlexibleLeftMargin | ADViewAutoresizingFlexibleWidth:
      var h = (f.width - this._size.width - this._position.x);
      a.x = (this._position.x / (f.width - h)) * (this.superview._size.width - h);
      e.width = this.superview._size.width - a.x - h;
      break;
    case ADViewAutoresizingFlexibleRightMargin:
      break;
    case ADViewAutoresizingFlexibleLeftMargin | ADViewAutoresizingFlexibleRightMargin:
      var h = (f.width - this._size.width - this._position.x);
      a.x += (this.superview._size.width - f.width) * (this.position.x / (this.position.x + h));
      break;
    case ADViewAutoresizingFlexibleRightMargin | ADViewAutoresizingFlexibleWidth:
      var h = (f.width - this._size.width - this._position.x);
      scaled_right_margin = (h / (f.width - this._position.x)) * (this.superview._size.width - this._position.x);
      e.width = this.superview._size.width - a.x - scaled_right_margin;
      break;
    case ADViewAutoresizingFlexibleLeftMargin | ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleRightMargin:
      a.x = (this._position.x / f.width) * this.superview._size.width;
      e.width = (this._size.width / f.width) * this.superview._size.width;
      break
  }
  var b = (c & ADViewAutoresizingFlexibleTopMargin) + (c & ADViewAutoresizingFlexibleHeight) + (c & ADViewAutoresizingFlexibleBottomMargin);
  switch (b) {
    case ADViewAutoresizingNone:
      break;
    case ADViewAutoresizingFlexibleTopMargin:
      a.y += this.superview._size.height - f.height;
      break;
    case ADViewAutoresizingFlexibleHeight:
      e.height = this.superview._size.height - (f.height - this._size.height);
      break;
    case ADViewAutoresizingFlexibleTopMargin | ADViewAutoresizingFlexibleHeight:
      var g = (f.height - this._size.height - this._position.y);
      a.y = (this._position.y / (f.height - g)) * (this.superview._size.height - g);
      e.height = this.superview._size.height - a.y - g;
      break;
    case ADViewAutoresizingFlexibleBottomMargin:
      break;
    case ADViewAutoresizingFlexibleTopMargin | ADViewAutoresizingFlexibleBottomMargin:
      var g = (f.height - this._size.height - this._position.y);
      a.y += (this.superview._size.height - f.height) * (this.position.y / (this.position.y + g));
      break;
    case ADViewAutoresizingFlexibleBottomMargin | ADViewAutoresizingFlexibleHeight:
      var g = (f.height - this._size.height - this._position.y);
      scaled_bottom_margin = (g / (f.height - this._position.y)) * (this.superview._size.height - this._position.y);
      e.height = this.superview._size.height - a.y - scaled_bottom_margin;
      break;
    case ADViewAutoresizingFlexibleTopMargin | ADViewAutoresizingFlexibleHeight | ADViewAutoresizingFlexibleBottomMargin:
      a.y = (this._position.y / f.height) * this.superview._size.height;
      e.height = (this._size.height / f.height) * this.superview._size.height;
      break
  }
  this.position = a;
  this.size = e
};
const ADViewPropertyMapping = {
  opacity: "opacity",
  transform: "-webkit-transform",
  position: "-webkit-transform",
  anchorPoint: "-webkit-transform-origin",
  doubleSided: "-webkit-backface-visibility",
  zIndex: "z-index"
};
ADView.prototype.cssPropertyNameForJSProperty = function(a){
  return ADViewPropertyMapping[a]
};
ADView.prototype.applyTransition = function(b, d){
  if (b === null) {
    return
  }
  var c = new ADTransition(b);
  c.target = this;
  if (d) {
    var e = c.from;
    c.from = c.to;
    c.to = e
  }
  if (b.base) {
    for (var a = 0; a < b.base.length; a += 2) {
      this[b.base[a]] = b.base[a + 1]
    }
  }
  c.start()
};
ADView.getViewById = function(b){
  var a = document.getElementById(b);
  return (a && !ADUtils.objectIsUndefined(a._view)) ? a._view : null
};
ADClass(ADView);
ADContentView.inherits = ADView;
function ADContentView(b){
  var a = b;
  if (ADUtils.objectIsString(b)) {
    a = document.querySelector(b)
  }
  this.layer = a;
  this.callSuper();
  this.layer.addClassName("ad-view");
  if (a === document.body) {
    this.size = new ADSize(window.innerWidth, window.innerHeight)
  }
}

ADContentView.prototype.layerWasInsertedIntoDocument = function(){
  this.callSuper();
  this.refreshSize()
};
ADContentView.prototype.refreshSize = function(){
  var a = window.getComputedStyle(this.layer);
  this._size = new ADSize(parseInt(a.width), parseInt(a.height))
};
ADClass(ADContentView);
ADRootView.inherits = ADContentView;
ADRootView.synthetizes = ["disablesDefaultScrolling"];
function ADRootView(a){
  this.callSuper(a);
  this._disablesDefaultScrolling = true;
  this.disablesDefaultScrolling = true;
  if (this.layer === document.body) {
    window.addEventListener("orientationchange", this, false);
    this.layer.removeClassName("ad-view")
  }
}

ADRootView.prototype.setDisablesDefaultScrolling = function(a){
  this.layer[a ? "addEventListener" : "removeEventListener"](ADMoveEvent, ADUtils.preventEventDefault, false);
  this._disablesDefaultScrolling = a
};
ADRootView.prototype.handleEvent = function(a){
  this.callSuper(a);
  if (a.type == "orientationchange") {
    var b = this;
    setTimeout(function(){
      b.size = new ADSize(window.innerWidth, window.innerHeight);
      window.scrollTo(0, 0)
    }, 0)
  }
};
ADRootView._sharedRoot = null;
ADRootView.__defineGetter__("sharedRoot", function(){
  if (ADRootView._sharedRoot === null) {
    ADRootView._sharedRoot = new ADRootView(document.body)
  }
  return ADRootView._sharedRoot
});
ADRootView.__defineSetter__("sharedRoot", function(a){
  ADRootView._sharedRoot = a
});
ADClass(ADRootView);
const ADHTMLFragmentLoaderDidFail = "htmlFragmentLoaderDidFail";
const ADHTMLFragmentLoaderDidLoad = "htmlFragmentLoaderDidLoad";
ADViewController.inherits = ADObject;
ADHTMLFragmentLoader.includes = [ADEventTriage];
function ADHTMLFragmentLoader(a, b){
  this.callSuper();
  this.url = a;
  this.delegate = b;
  this.fragment = null;
  this.request = new XMLHttpRequest();
  this.request.addEventListener("load", this, false);
  this.request.addEventListener("error", this, false);
  if (this.url !== undefined) {
    this.load()
  }
}

ADHTMLFragmentLoader.prototype.load = function(){
  this.fragment = null;
  this.request.abort();
  var b = (this.url.indexOf("http") == 0);
  this.request.open("GET", this.url, b);
  try {
    this.request.send()
  } 
  catch (a) {
    this.requestDidFail()
  }
  return b
};
ADHTMLFragmentLoader.prototype.handleLoad = function(a){
  this.requestDidLoad()
};
ADHTMLFragmentLoader.prototype.handleError = function(a){
  this.requestDidFail()
};
ADHTMLFragmentLoader.prototype.requestDidLoad = function(){
  this.fragment = ADUtils.createNodeFromString(this.request.responseText);
  if (ADUtils.objectHasMethod(this.delegate, ADHTMLFragmentLoaderDidLoad)) {
    this.delegate[ADHTMLFragmentLoaderDidLoad](this)
  }
};
ADHTMLFragmentLoader.prototype.requestDidFail = function(){
  if (ADUtils.objectHasMethod(this.delegate, ADHTMLFragmentLoaderDidFail)) {
    this.delegate[ADHTMLFragmentLoaderDidFail](this)
  }
};
ADClass(ADHTMLFragmentLoader);
const ADScrollIndicatorThickness = 7;
const ADScrollIndicatorEndSize = 3;
const ADScrollIndicatorTypeHorizontal = "horizontal";
const ADScrollIndicatorTypeVertical = "vertical";
ADScrollIndicator.inherits = ADView;
ADScrollIndicator.synthetizes = ["visible", "width", "height", "style"];
function ADScrollIndicator(a){
  this.callSuper();
  this.type = a;
  this.layer.addClassName(a);
  this._visible = false;
  this._width = ADScrollIndicatorThickness;
  this._height = ADScrollIndicatorThickness;
  this.position = new ADPoint(-ADScrollIndicatorThickness, -ADScrollIndicatorThickness);
  this.positionBeforeHide = this.position;
  this.lastPositionUpdateInHide = false;
  this._style = ADScrollViewIndicatorStyleDefault;
  this.visible = false
}

ADScrollIndicator.prototype.createLayer = function(){
  this.layer = document.createElement("div");
  this.layer.addClassName("ad-scroll-indicator");
  this.layer.addEventListener("webkitTransitionEnd", this, false);
  this.start = this.layer.appendChild(document.createElement("div"));
  this.middle = this.layer.appendChild(document.createElement("img"));
  this.end = this.layer.appendChild(document.createElement("div"))
};
ADScrollIndicator.prototype.setPosition = function(a){
  a.x = Math.round(a.x);
  a.y = Math.round(a.y);
  this.callSuper(a);
  this.lastPositionUpdateInHide = false
};
ADScrollIndicator.prototype.setSize = function(a){
  this.width = a.width;
  this.height = a.height;
  this._size = a
};
ADScrollIndicator.prototype.setStyle = function(b){
  this._style = b;
  this.layer.removeClassName(this._style);
  this.layer.addClassName(this._style);
  var a = (this.type === ADScrollIndicatorTypeHorizontal) ? "Horizontal" : "Vertical";
  var c = "Default";
  switch (b) {
    case ADScrollViewIndicatorStyleWhite:
      c = "White";
      break;
    case ADScrollViewIndicatorStyleBlack:
      c = "Black";
      break
  }
  this.middle.src = ADUtils.assetsPath + "scrollindicator/UIScrollerIndicator" + c + a + "Middle.png"
};
ADScrollIndicator.prototype.setWidth = function(a){
  this.middle.style.webkitTransform = "translate3d(0,0,0) scale(" + (a - ADScrollIndicatorEndSize * 2) + ",1)";
  this.end.style.webkitTransform = "translate3d(" + (a - ADScrollIndicatorEndSize) + "px,0,0)";
  this._width = a
};
ADScrollIndicator.prototype.setHeight = function(a){
  this.middle.style.webkitTransform = "translate3d(0,0,0) scale(1," + (a - ADScrollIndicatorEndSize * 2) + ")";
  this.end.style.webkitTransform = "translate3d(0," + (a - ADScrollIndicatorEndSize) + "px,0)";
  this._height = a
};
ADScrollIndicator.prototype.setVisible = function(a){
  if (a) {
    this.fading = false;
    this.opacity = 1;
    this.position = this.lastPositionUpdateInHide ? this.positionBeforeHide : this.position
  }
  else {
    if (!this.fading) {
      this.fading = true;
      this.opacity = 0;
      this.lastPositionUpdateInHide = true;
      this.positionBeforeHide = this.position
    }
  }
  this._visible = a
};
ADScrollIndicator.prototype.flash = function(){
  this.flashing = true
};
ADScrollIndicator.prototype.handleEvent = function(a){
  if (a.type != "webkitTransitionEnd") {
    return
  }
  this.callSuper(a);
  if (this.flashing) {
    this.flashing = false
  }
  else {
    if (this.fading) {
      this.position = new ADPoint(-ADScrollIndicatorThickness, -ADScrollIndicatorThickness);
      this.fading = false
    }
  }
};
ADClass(ADScrollIndicator);
const ADScrollViewWillBeginDragging = "scrollViewWillBeginDragging";
const ADScrollViewDidEndScrollingAnimation = "scrollViewDidEndScrollingAnimation";
const ADScrollViewDidScroll = "scrollViewDidScroll";
const ADScrollViewDidEndDragging = "scrollViewDidEndDragging";
const ADScrollViewWillBeginDecelerating = "scrollViewWillBeginDecelerating";
const ADScrollViewDidEndDecelerating = "scrollViewDidEndDecelerating";
const ADScrollViewMinimumTrackingForDrag = 5;
const ADScrollViewPagingTransitionDuration = "0.25s";
const ADScrollViewMinIndicatorLength = 34;
const ADScrollViewAcceleration = 15;
const ADScrollViewMaxTimeForTrackingDataPoints = 100;
const ADScrollViewDecelerationFrictionFactor = 0.95;
const ADScrollViewDesiredAnimationFrameRate = 1000 / 60;
const ADScrollViewMinimumVelocity = 0.05;
const ADScrollViewPenetrationDeceleration = 0.08;
const ADScrollViewPenetrationAcceleration = 0.15;
const ADScrollViewMinVelocityForDeceleration = 1;
const ADScrollViewMinVelocityForDecelerationWithPaging = 4;
const ADScrollViewMaxVelocityForBouncingWithPaging = 20;
const ADScrollViewClickableElementNames = ["a", "button", "input", "select"];
const ADScrollViewContentTouchesDelay = 150;
const ADScrollViewAutomatedContentSize = -1;
const ADScrollViewIndicatorStyleDefault = "indicator-default";
const ADScrollViewIndicatorStyleBlack = "indicator-black";
const ADScrollViewIndicatorStyleWhite = "indicator-white";
ADScrollView.inherits = ADView;
ADScrollView.synthetizes = ["contentOffset", "contentSize", "indicatorStyle", "scrollEnabled", "scrollIndicatorInsets"];
function ADScrollView(){
  this.callSuper();
  this._contentOffset = new ADPoint();
  this._contentSize = ADScrollViewAutomatedContentSize;
  this.adjustedContentSize = new ADSize();
  this.tracking = false;
  this.dragging = false;
  this.horizontalScrollEnabled = true;
  this.verticalScrollEnabled = true;
  this.decelerating = false;
  this.decelerationTimer = null;
  this._indicatorStyle = "";
  this.showsHorizontalScrollIndicator = true;
  this.showsVerticalScrollIndicator = true;
  this.scrollIndicatorsNeedFlashing = false;
  this._scrollIndicatorInsets = new ADEdgeInsets(0, 0, 0, 0);
  this.pagingEnabled = false;
  this.bounces = true;
  this.clipsToBounds = true;
  this.delegate = null;
  this.layer.addEventListener("webkitTransitionEnd", this, false);
  this.hostingLayer.addEventListener("webkitTransitionEnd", this, false);
  this.indicatorStyle = ADScrollViewIndicatorStyleDefault;
  this.tracksTouchesOnceTouchesBegan = true;
  this.layer.addEventListener(ADStartEvent, this, true);
  this.delaysContentTouches = true;
  this.canCancelContentTouches = true;
  this._scrollEnabled = true;
  this._setContentOffsetWithAnimationCalledFromSetter = false
}

ADScrollView.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-scroll-view");
  this.horizontalScrollIndicator = new ADScrollIndicator(ADScrollIndicatorTypeHorizontal);
  this.verticalScrollIndicator = new ADScrollIndicator(ADScrollIndicatorTypeVertical);
  this.layer.appendChild(this.horizontalScrollIndicator.layer);
  this.layer.appendChild(this.verticalScrollIndicator.layer);
  this.hostingLayer = this.layer.insertBefore(document.createElement("div"), this.horizontalScrollIndicator.layer);
  this.hostingLayer.className = "hosting-layer"
};
ADScrollView.prototype.setSize = function(a){
  this.callSuper(a);
  this.adjustContentSize(true)
};
ADScrollView.prototype.setScrollEnabled = function(a){
  this._scrollEnabled = a;
  if (!a) {
    this.stopTrackingTouches()
  }
};
ADScrollView.prototype.setContentOffset = function(a){
  this._setContentOffsetWithAnimationCalledFromSetter = true;
  this.setContentOffsetWithAnimation(a, false)
};
ADScrollView.prototype.setContentOffsetWithAnimation = function(b, a){
  if (b.equals(this._contentOffset)) {
    return
  }
  this._contentOffset = b;
  if (!this.dragging && !this.decelerating) {
    this.adjustContentSize(false);
    this._contentOffset.x = Math.max(Math.min(this.maxPoint.x, this._contentOffset.x), 0);
    this._contentOffset.y = Math.max(Math.min(this.maxPoint.y, this._contentOffset.y), 0)
  }
  this.hostingLayer.style.webkitTransform = ADUtils.t(-this._contentOffset.x, -this._contentOffset.y);
  if (a) {
    this.scrollTransitionsNeedRemoval = true;
    this.hostingLayer.style.webkitTransitionDuration = ADScrollViewPagingTransitionDuration
  }
  else {
    this.didScroll(false)
  }
  if (!a) {
    if (this.horizontalScrollEnabled && this.showsHorizontalScrollIndicator) {
      this.updateHorizontalScrollIndicator()
    }
    if (this.verticalScrollEnabled && this.showsVerticalScrollIndicator) {
      this.updateVerticalScrollIndicator()
    }
  }
  if (!this._setContentOffsetWithAnimationCalledFromSetter) {
    this.notifyPropertyChange("contentOffset")
  }
  this._setContentOffsetWithAnimationCalledFromSetter = false
};
ADScrollView.prototype.snapContentOffsetToBounds = function(a){
  var c = false;
  var b = new ADPoint();
  if (this.pagingEnabled) {
    b.x = Math.round(this._contentOffset.x / this._size.width) * this._size.width;
    b.y = Math.round(this._contentOffset.y / this._size.height) * this._size.height;
    c = true
  }
  else {
    if (this.bounces) {
      b.x = Math.max(Math.min(this.maxPoint.x, this._contentOffset.x), 0);
      b.y = Math.max(Math.min(this.maxPoint.y, this._contentOffset.y), 0);
      c = (b.x != this._contentOffset.x || b.y != this._contentOffset.y)
    }
  }
  if (c) {
    this.setContentOffsetWithAnimation(b, a)
  }
};
ADScrollView.prototype.getContentSize = function(){
  var b = this._contentSize;
  if (b === ADScrollViewAutomatedContentSize) {
    b = new ADSize(this._hostingLayer.offsetWidth, this._hostingLayer.offsetHeight);
    if (this.subviews.length) {
      for (var a = 0; a < this.subviews.length; a++) {
        var c = this.subviews[a];
        b.width = Math.max(b.width, c.position.x + c.size.width);
        b.height = Math.max(b.height, c.position.y + c.size.height)
      }
    }
  }
  return b
};
ADScrollView.prototype.setContentSize = function(a){
  this._contentSize = a;
  this.adjustContentSize(false)
};
ADScrollView.prototype.adjustContentSize = function(a){
  if (a) {
    var b = new ADPoint();
    if (this.adjustedContentSize.width != 0) {
      b.x = this._contentOffset.x / this.adjustedContentSize.width
    }
    if (this.adjustedContentSize.height != 0) {
      b.y = this._contentOffset.y / this.adjustedContentSize.height
    }
  }
  this.adjustedContentSize.width = Math.max(this._size.width, this.contentSize.width);
  this.adjustedContentSize.height = Math.max(this._size.height, this.contentSize.height);
  this.maxPoint = new ADPoint(this.adjustedContentSize.width - this._size.width, this.adjustedContentSize.height - this._size.height);
  if (a) {
    this.contentOffset = new ADPoint(Math.min(b.x * this.adjustedContentSize.width, this.maxPoint.x), Math.min(b.y * this.adjustedContentSize.height, this.maxPoint.y))
  }
};
ADScrollView.prototype.setIndicatorStyle = function(a){
  this._indicatorStyle = a;
  this.horizontalScrollIndicator.style = a;
  this.verticalScrollIndicator.style = a
};
ADScrollView.prototype.setScrollIndicatorInsets = function(a){
  this._scrollIndicatorInsets = a;
  if (this.horizontalScrollIndicator.visible) {
    this.updateHorizontalScrollIndicator()
  }
  if (this.verticalScrollIndicator.visible) {
    this.updateVerticalScrollIndicator()
  }
};
ADScrollView.prototype.updateHorizontalScrollIndicator = function(){
  var c = (this.verticalScrollEnabled && this.showsVerticalScrollIndicator) ? ADScrollIndicatorEndSize * 2 : 1;
  var e = this._size.width - this._scrollIndicatorInsets.left - this._scrollIndicatorInsets.right - c;
  var b = Math.max(ADScrollViewMinIndicatorLength, Math.round((this._size.width / this.adjustedContentSize.width) * e));
  var a = (this._contentOffset.x / (this.adjustedContentSize.width - this._size.width)) * (e - c - b) + this._scrollIndicatorInsets.left;
  var d = this._size.height - ADScrollIndicatorThickness - 1 - this._scrollIndicatorInsets.bottom;
  if (this._contentOffset.x < 0) {
    b = Math.round(Math.max(b + this._contentOffset.x, ADScrollIndicatorThickness));
    a = 1 + this._scrollIndicatorInsets.left
  }
  else {
    if (this._contentOffset.x > this.maxPoint.x) {
      b = Math.round(Math.max(b + this.adjustedContentSize.width - this._size.width - this._contentOffset.x, ADScrollIndicatorThickness));
      a = this._size.width - b - c - this._scrollIndicatorInsets.right
    }
  }
  this.horizontalScrollIndicator.position = new ADPoint(a, d);
  this.horizontalScrollIndicator.width = b
};
ADScrollView.prototype.updateVerticalScrollIndicator = function(){
  var d = (this.horizontalScrollEnabled && this.showsHorizontalScrollIndicator) ? ADScrollIndicatorEndSize * 2 : 1;
  var c = this._size.height - this._scrollIndicatorInsets.top - this._scrollIndicatorInsets.bottom - d;
  var b = Math.max(ADScrollViewMinIndicatorLength, Math.round((this._size.height / this.adjustedContentSize.height) * c));
  var a = this._size.width - ADScrollIndicatorThickness - 1 - this._scrollIndicatorInsets.right;
  var e = (this._contentOffset.y / (this.adjustedContentSize.height - this._size.height)) * (c - d - b) + this._scrollIndicatorInsets.top;
  if (this._contentOffset.y < 0) {
    b = Math.round(Math.max(b + this._contentOffset.y, ADScrollIndicatorThickness));
    e = 1 + this._scrollIndicatorInsets.top
  }
  else {
    if (this._contentOffset.y > this.maxPoint.y) {
      b = Math.round(Math.max(b + this.adjustedContentSize.height - this._size.height - this._contentOffset.y, ADScrollIndicatorThickness));
      e = this._size.height - b - d - this._scrollIndicatorInsets.bottom
    }
  }
  this.verticalScrollIndicator.position = new ADPoint(a, e);
  this.verticalScrollIndicator.height = b
};
ADScrollView.prototype.flashScrollIndicators = function(a){
  if (a) {
    this.scrollIndicatorsNeedFlashing = true;
    return
  }
  if (this.horizontalScrollEnabled && this.showsHorizontalScrollIndicator && (this.adjustedContentSize.width > this._size.width)) {
    this.updateHorizontalScrollIndicator();
    this.horizontalScrollIndicator.flash()
  }
  if (this.verticalScrollEnabled && this.showsVerticalScrollIndicator && (this.adjustedContentSize.height > this._size.height)) {
    this.updateVerticalScrollIndicator();
    this.verticalScrollIndicator.flash()
  }
};
ADScrollView.prototype.hideScrollIndicators = function(){
  this.horizontalScrollIndicator.visible = false;
  this.verticalScrollIndicator.visible = false
};
ADScrollView.prototype.handleEvent = function(a){
  this.callSuper(a);
  if (a.type == "webkitTransitionEnd") {
    this.transitionEnded(a)
  }
};
ADScrollView.prototype.touchesBegan = function(a){
  if (!this._scrollEnabled) {
    return
  }
  if (a.eventPhase == Event.CAPTURING_PHASE) {
    if (a._manufactured) {
      return
    }
    this.originalTarget = (ADSupportsTouches ? a.touches[0] : a).target;
    if (this.delaysContentTouches) {
      a.stopPropagation();
      this.callMethodNameAfterDelay("beginTouchesInContent", ADScrollViewContentTouchesDelay, a);
      if (!this.tracking) {
        this.beginTracking(a)
      }
    }
  }
  else {
    if (!this.tracking) {
      this.beginTracking(a)
    }
  }
};
ADScrollView.prototype.beginTouchesInContent = function(a){
  if (this.tracking && !this.dragging) {
    var b = ADUtils.createUIEvent(ADStartEvent, a);
    b._manufactured = true;
    this.originalTarget.dispatchEvent(b);
    if (!this.canCancelContentTouches) {
      this.touchesEnded(ADUtils.createUIEvent(ADEndEvent, a))
    }
  }
};
ADScrollView.prototype.beginTracking = function(a){
  a.preventDefault();
  this.stopDecelerationAnimation();
  this.hostingLayer.style.webkitTransitionDuration = 0;
  this.adjustContentSize();
  this.snapContentOffsetToBounds(false);
  var b = this._contentOffset.copy();
  this.trackingDataPoints = [];
  this.addTrackingDataPoint(a.timeStamp, b);
  this.startContentOffset = b;
  this.startTouchPosition = ADPoint.fromEventInElement(a, this.layer);
  this.tracking = true;
  this.dragging = false;
  this.touchesHaveMoved = false;
  window.addEventListener(ADMoveEvent, this, true);
  window.addEventListener(ADEndEvent, this, true);
  window.addEventListener("touchcancel", this, true);
  window.addEventListener(ADEndEvent, this, false)
};
ADScrollView.prototype.touchesMoved = function(d){
  this.touchesHaveMoved = true;
  this.callSuper(d);
  var c = ADPoint.fromEventInElement(d, this.layer);
  var f = c.x - this.startTouchPosition.x;
  var e = c.y - this.startTouchPosition.y;
  if (!this.dragging) {
    if ((Math.abs(f) >= ADScrollViewMinimumTrackingForDrag && this.horizontalScrollEnabled) || (Math.abs(e) >= ADScrollViewMinimumTrackingForDrag && this.verticalScrollEnabled)) {
      if (ADUtils.objectHasMethod(this.delegate, ADScrollViewWillBeginDragging)) {
        this.delegate[ADScrollViewWillBeginDragging](this)
      }
      this.dragging = true;
      this.firstDrag = true;
      if (this.horizontalScrollEnabled && this.showsHorizontalScrollIndicator && (this.adjustedContentSize.width > this._size.width)) {
        this.horizontalScrollIndicator.visible = true
      }
      if (this.verticalScrollEnabled && this.showsVerticalScrollIndicator && (this.adjustedContentSize.height > this._size.height)) {
        this.verticalScrollIndicator.visible = true
      }
    }
  }
  if (this.dragging) {
    d.stopPropagation();
    var b = this.horizontalScrollEnabled ? (this.startContentOffset.x - f) : this._contentOffset.x;
    var a = this.verticalScrollEnabled ? (this.startContentOffset.y - e) : this._contentOffset.y;
    if (this.bounces) {
      b -= ((b > this.maxPoint.x) ? (b - this.maxPoint.x) : ((b < 0) ? b : 0)) / 2;
      a -= ((a > this.maxPoint.y) ? (a - this.maxPoint.y) : ((a < 0) ? a : 0)) / 2
    }
    else {
      b = Math.max(Math.min(this.maxPoint.x, b), 0);
      a = Math.max(Math.min(this.maxPoint.y, a), 0)
    }
    if (this.firstDrag) {
      this.firstDrag = false;
      this.startTouchPosition = c;
      return
    }
    this.contentOffset = new ADPoint(b, a)
  }
  this.addTrackingDataPoint(d.timeStamp, this._contentOffset.copy())
};
ADScrollView.prototype.touchesEnded = function(a){
  this.callSuper(a);
  this.tracking = false;
  if (this.dragging) {
    this.dragging = false;
    a.stopPropagation();
    this.purgeTrackingDataPointsWithTime(a.timeStamp);
    if (this.trackingDataPoints.length > 1) {
      this._contentOffsetBeforeDeceleration = this._contentOffset.copy();
      this.startDecelerationAnimation()
    }
    window.removeEventListener(ADEndEvent, this, false);
    if (ADUtils.objectHasMethod(this.delegate, ADScrollViewDidEndDragging)) {
      this.delegate[ADScrollViewDidEndDragging](this)
    }
  }
  if (!this.decelerating) {
    this.snapContentOffsetToBounds(true);
    this.hideScrollIndicators()
  }
  if (a.eventPhase == Event.BUBBLING_PHASE) {
    window.removeEventListener(ADEndEvent, this, false);
    if (!this.touchesHaveMoved && this.originalTarget !== null && a.type == ADEndEvent) {
      this.activateOriginalTarget()
    }
  }
};
ADScrollView.prototype.touchesCancelled = function(a){
  this.callSuper(a);
  this.touchesEnded(a)
};
ADScrollView.prototype.stopTrackingTouches = function(){
  if (!this.tracking) {
    return
  }
  this.tracking = false;
  if (this.dragging) {
    this.dragging = false;
    this.snapContentOffsetToBounds(true);
    if (ADUtils.objectHasMethod(this.delegate, ADScrollViewDidEndDragging)) {
      this.delegate[ADScrollViewDidEndDragging](this)
    }
    this.hideScrollIndicators()
  }
  window.removeEventListener(ADMoveEvent, this, true);
  window.removeEventListener(ADEndEvent, this, true);
  window.removeEventListener(ADEndEvent, this, false);
  window.removeEventListener("touchcancel", this, true)
};
ADScrollView.prototype.purgeTrackingDataPointsWithTime = function(a){
  while (this.trackingDataPoints.length > 0) {
    if (a - this.trackingDataPoints[0].time <= ADScrollViewMaxTimeForTrackingDataPoints) {
      break
    }
    this.trackingDataPoints.shift()
  }
};
ADScrollView.prototype.addTrackingDataPoint = function(b, a){
  this.purgeTrackingDataPointsWithTime(b);
  this.trackingDataPoints.push({
    time: b,
    contentOffset: a
  })
};
ADScrollView.prototype.transitionEnded = function(a){
  if (this.scrollIndicatorsNeedFlashing && a.currentTarget === this.layer) {
    this.scrollIndicatorsNeedFlashing = false;
    this.flashScrollIndicators()
  }
  if (this.scrollTransitionsNeedRemoval && a.currentTarget === this.hostingLayer) {
    this.scrollTransitionsNeedRemoval = false;
    this.hostingLayer.style.webkitTransitionDuration = 0;
    this.didScroll(true)
  }
};
ADScrollView.prototype.didScroll = function(a){
  if (a && ADUtils.objectHasMethod(this.delegate, ADScrollViewDidEndScrollingAnimation)) {
    this.delegate[ADScrollViewDidEndScrollingAnimation](this)
  }
  if (ADUtils.objectHasMethod(this.delegate, ADScrollViewDidScroll)) {
    this.delegate[ADScrollViewDidScroll](this)
  }
};
ADScrollView.prototype.startDecelerationAnimation = function(){
  if (this.bounces && (this._contentOffset.x > this.maxPoint.x || this._contentOffset.y > this.maxPoint.y || this._contentOffset.x < 0 || this._contentOffset.y < 0)) {
    return
  }
  var c = this.trackingDataPoints[0];
  var e = this.trackingDataPoints[this.trackingDataPoints.length - 1];
  var a = new ADPoint(e.contentOffset.x - c.contentOffset.x, e.contentOffset.y - c.contentOffset.y);
  var d = (e.time - c.time) / ADScrollViewAcceleration;
  this.decelerationVelocity = new ADPoint(a.x / d, a.y / d);
  this.minDecelerationPoint = new ADPoint(0, 0);
  this.maxDecelerationPoint = this.maxPoint.copy();
  if (this.pagingEnabled) {
    this.minDecelerationPoint.x = Math.max(0, Math.floor(this._contentOffsetBeforeDeceleration.x / this._size.width) * this._size.width);
    this.minDecelerationPoint.y = Math.max(0, Math.floor(this._contentOffsetBeforeDeceleration.y / this._size.height) * this._size.height);
    this.maxDecelerationPoint.x = Math.min(this.maxPoint.x, Math.ceil(this._contentOffsetBeforeDeceleration.x / this._size.width) * this._size.width);
    this.maxDecelerationPoint.y = Math.min(this.maxPoint.y, Math.ceil(this._contentOffsetBeforeDeceleration.y / this._size.height) * this._size.height)
  }
  this.penetrationDeceleration = ADScrollViewPenetrationDeceleration;
  this.penetrationAcceleration = ADScrollViewPenetrationAcceleration;
  if (this.pagingEnabled) {
    this.penetrationDeceleration *= 5
  }
  var b = this.pagingEnabled ? ADScrollViewMinVelocityForDecelerationWithPaging : ADScrollViewMinVelocityForDeceleration;
  if (Math.abs(this.decelerationVelocity.x) > b || Math.abs(this.decelerationVelocity.y) > b) {
    this.decelerating = true;
    this.decelerationTimer = this.callMethodNameAfterDelay("stepThroughDecelerationAnimation", ADScrollViewDesiredAnimationFrameRate);
    this.lastFrame = new Date();
    if (ADUtils.objectHasMethod(this.delegate, ADScrollViewWillBeginDecelerating)) {
      this.delegate[ADScrollViewWillBeginDecelerating](this)
    }
  }
};
ADScrollView.prototype.stopDecelerationAnimation = function(){
  this.decelerating = false;
  clearTimeout(this.decelerationTimer)
};
ADScrollView.prototype.stepThroughDecelerationAnimation = function(l){
  if (!this.decelerating) {
    return
  }
  var a = new Date();
  var f = a - this.lastFrame;
  var e = l ? 0 : (Math.round(f / ADScrollViewDesiredAnimationFrameRate) - 1);
  for (var g = 0; g < e; g++) {
    this.stepThroughDecelerationAnimation(true)
  }
  var k = this._contentOffset.x + this.decelerationVelocity.x;
  var j = this._contentOffset.y + this.decelerationVelocity.y;
  if (!this.bounces) {
    var d = Math.max(Math.min(this.maxPoint.x, k), 0);
    if (d != k) {
      k = d;
      this.decelerationVelocity.x = 0
    }
    var b = Math.max(Math.min(this.maxPoint.y, j), 0);
    if (b != j) {
      j = b;
      this.decelerationVelocity.y = 0
    }
  }
  if (l) {
    this._contentOffset.x = k;
    this._contentOffset.y = j
  }
  else {
    this.contentOffset = new ADPoint(k, j)
  }
  if (!this.pagingEnabled) {
    this.decelerationVelocity.x *= ADScrollViewDecelerationFrictionFactor;
    this.decelerationVelocity.y *= ADScrollViewDecelerationFrictionFactor
  }
  var c = Math.abs(this.decelerationVelocity.x);
  var h = Math.abs(this.decelerationVelocity.y);
  if (!l && c <= ADScrollViewMinimumVelocity && h <= ADScrollViewMinimumVelocity) {
    this.hideScrollIndicators();
    this.decelerationAnimationCompleted();
    return
  }
  if (!l) {
    this.decelerationTimer = this.callMethodNameAfterDelay("stepThroughDecelerationAnimation", ADScrollViewDesiredAnimationFrameRate)
  }
  if (this.bounces) {
    var m = new ADPoint(0, 0);
    if (k < this.minDecelerationPoint.x) {
      m.x = this.minDecelerationPoint.x - k
    }
    else {
      if (k > this.maxDecelerationPoint.x) {
        m.x = this.maxDecelerationPoint.x - k
      }
    }
    if (j < this.minDecelerationPoint.y) {
      m.y = this.minDecelerationPoint.y - j
    }
    else {
      if (j > this.maxDecelerationPoint.y) {
        m.y = this.maxDecelerationPoint.y - j
      }
    }
    if (m.x != 0) {
      if (this.pagingEnabled && Math.abs(this.decelerationVelocity.x) >= ADScrollViewMaxVelocityForBouncingWithPaging) {
        this.decelerationAnimationCompleted();
        return
      }
      if (m.x * this.decelerationVelocity.x <= 0) {
        this.decelerationVelocity.x += m.x * this.penetrationDeceleration
      }
      else {
        this.decelerationVelocity.x = m.x * this.penetrationAcceleration
      }
    }
    if (m.y != 0) {
      if (this.pagingEnabled && Math.abs(this.decelerationVelocity.y) >= ADScrollViewMaxVelocityForBouncingWithPaging) {
        this.decelerationAnimationCompleted();
        return
      }
      if (m.y * this.decelerationVelocity.y <= 0) {
        this.decelerationVelocity.y += m.y * this.penetrationDeceleration
      }
      else {
        this.decelerationVelocity.y = m.y * this.penetrationAcceleration
      }
    }
  }
  if (!l) {
    this.lastFrame = a
  }
};
ADScrollView.prototype.decelerationAnimationCompleted = function(){
  this.stopDecelerationAnimation();
  if (this.pagingEnabled) {
    this.setContentOffsetWithAnimation(new ADPoint(Math.round(this._contentOffset.x / this._size.width) * this._size.width, Math.round(this._contentOffset.y / this._size.height) * this._size.height), false)
  }
  if (ADUtils.objectHasMethod(this.delegate, ADScrollViewDidEndDecelerating)) {
    this.delegate[ADScrollViewDidEndDecelerating](this)
  }
};
ADScrollView.prototype.activateOriginalTarget = function(){
  var b = this.originalTarget;
  while (b.parentNode && b !== this.hostingLayer) {
    if (b.nodeType == Node.ELEMENT_NODE) {
      if (ADScrollViewClickableElementNames.indexOf(b.localName) != -1) {
        break
      }
    }
    b = b.parentNode
  }
  if (!ADSupportsTouches) {
    return
  }
  var a = document.createEvent("MouseEvent");
  a.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
  a._manufactured = true;
  b.dispatchEvent(a)
};
ADClass(ADScrollView);
const ADTableViewCellForRowAtPath = "tableViewCellForRowAtPath";
const ADTableViewNumberOfSectionsInTableView = "numberOfSectionsInTableView";
const ADTableViewNumberOfRowsInSection = "tableViewNumberOfRowsInSection";
const ADTableViewTitleForHeaderInSection = "tableViewTitleForHeaderInSection";
const ADTableViewTitleForFooterInSection = "tableViewTitleForFooterInSection";
const ADTableViewCustomCellForRowAtPath = "tableViewCustomCellForRowAtPath";
const ADTableViewDidSelectRowAtPath = "tableViewDidSelectRowAtPath";
const ADTableViewDidSelectAccessoryForRowAtPath = "tableViewDidSelectAccessoryForRowAtPath";
const ADTableViewCustomCellCSS = "ad-custom-table-view-cell";
const ADTableViewStylePlain = "plain";
const ADTableViewStyleCustom = "custom";
const ADTableViewStyleGrouped = "grouped";
const ADTableViewMinTouchDurationForCellSelection = 150;
ADTableView.inherits = ADScrollView;
ADTableView.synthetizes = ["style", "separatorStyle"];
ADTableView.includes = [ADPropertyTriage];
function ADTableView(){
  this.callSuper();
  this._style = ADTableViewStyleCustom;
  this._separatorStyle = ADTableViewCellSeparatorStyleSingleLine;
  this.horizontalScrollEnabled = false;
  this.delegate = null;
  this.dataSource = null;
  this.touchedCell = null;
  this.touchedAccessory = null;
  this.shouldPreventScrolling = false;
  this.numberOfSections = 1;
  this.numberOfRows = [];
  this.sections = [];
  this.headers = [];
  this.sectionMetrics = [];
  this.selectedCell = null;
  this.populated = false
}

ADTableView.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-table-view")
};
ADTableView.prototype.layerWasInsertedIntoDocument = function(){
  this.callSuper();
  this.notifyCellsOfInsertionIntoDocument();
  this.updateSectionMetrics()
};
ADTableView.prototype.setContentOffsetWithAnimation = function(b, a){
  this.callSuper(b, a);
  this.updateSectionHeaders()
};
ADTableView.prototype.setStyle = function(a){
  this.layer.removeClassName(this._style);
  this.layer.addClassName(a);
  this._style = a
};
ADTableView.prototype.setSeparatorStyle = function(a){
  this.layer.removeClassName(this._separatorStyle);
  this.layer.addClassName(a);
  this._separatorStyle = a
};
ADTableView.prototype.numberOfRowsInSection = function(a){
  if (a > this.numberOfSections - 1) {
    return
  }
  return this.numberOfRows[a]
};
ADTableView.prototype.cellForRowAtPath = function(a){
  if (this._style === ADTableViewStyleCustom || a.section > this.numberOfSections - 1 || a.row > this.numberOfRows[a.section]) {
    return null
  }
  return this.hostingLayer.querySelector(".section:nth-of-type(" + (a.section + 1) + ") .cells > div:nth-of-type(" + (a.row + 1) + ")")._view
};
ADTableView.prototype.customCellForRowAtPath = function(a){
  if (this._style !== ADTableViewStyleCustom || a.section > this.numberOfSections - 1 || a.row > this.numberOfRows[a.section]) {
    return null
  }
  return this.hostingLayer.querySelector(".section:nth-of-type(" + (a.section + 1) + ") .cells > ." + ADTableViewCustomCellCSS + ":nth-of-type(" + (a.row + 1) + ")")
};
ADTableView.prototype.pathForCell = function(a){
  if (this._style === ADTableViewStyleCustom) {
    return null
  }
  return a._tableViewDataSourcePath
};
ADTableView.prototype.pathForCustomCell = function(a){
  if (this._style !== ADTableViewStyleCustom) {
    return null
  }
  return a._tableViewDataSourcePath
};
ADTableView.prototype.notifyCellsOfInsertionIntoDocument = function(){
  if (!this.layerIsInDocument || !this.populated) {
    return
  }
  var a = this.hostingLayer.querySelectorAll(".ad-table-view-cell");
  for (var b = 0; b < a.length; b++) {
    a[b]._view.layerWasInsertedIntoDocument()
  }
};
ADTableView.prototype.reloadData = function(){
  var b = (this._style === ADTableViewStyleCustom);
  if (b) {
    if (!ADUtils.objectHasMethod(this.dataSource, ADTableViewCustomCellForRowAtPath) || !ADUtils.objectHasMethod(this.dataSource, ADTableViewNumberOfRowsInSection)) {
      console.error("An ADTableView's dataSource must implement all required methods");
      return
    }
  }
  else {
    if (!ADUtils.objectHasMethod(this.dataSource, ADTableViewCellForRowAtPath) || !ADUtils.objectHasMethod(this.dataSource, ADTableViewNumberOfRowsInSection)) {
      console.error("An ADTableView's dataSource must implement all required methods");
      return
    }
  }
  this._hostingLayer.innerText = "";
  this.sections = [];
  this.headers = [];
  if (ADUtils.objectHasMethod(this.dataSource, ADTableViewNumberOfSectionsInTableView)) {
    this.numberOfSections = this.dataSource[ADTableViewNumberOfSectionsInTableView](this);
    if (this.numberOfSections < 1) {
      console.error("An ADTableView must have at least one section");
      return
    }
  }
  for (var g = 0; g < this.numberOfSections; g++) {
    var a = document.createElement("div");
    a.className = "section";
    this.sections[g] = a;
    if (ADUtils.objectHasMethod(this.dataSource, ADTableViewTitleForHeaderInSection)) {
      var c = this.dataSource[ADTableViewTitleForHeaderInSection](this, g);
      if (c !== null) {
        var d = a.appendChild(document.createElement("h1"));
        d.innerText = c;
        this.headers[g] = d
      }
    }
    var i = this.dataSource[ADTableViewNumberOfRowsInSection](this, g);
    if (i > 0) {
      var e = a.appendChild(document.createElement("div"));
      e.className = "cells";
      for (var k = 0; k < i; k++) {
        var j = new ADCellPath(g, k);
        if (b) {
          var h = this.dataSource[ADTableViewCustomCellForRowAtPath](this, j);
          h.addClassName(ADTableViewCustomCellCSS);
          h._tableViewDataSourcePath = j;
          e.appendChild(h)
        }
        else {
          var h = this.dataSource[ADTableViewCellForRowAtPath](this, j);
          h._tableViewDataSourcePath = j;
          h._table = this;
          e.appendChild(h.layer)
        }
      }
    }
    if (ADUtils.objectHasMethod(this.dataSource, ADTableViewTitleForFooterInSection)) {
      var f = this.dataSource[ADTableViewTitleForFooterInSection](this, g);
      if (f !== null) {
        a.appendChild(document.createElement("span")).innerText = f
      }
    }
    this.numberOfRows[g] = i;
    this._hostingLayer.appendChild(a)
  }
  this.populated = true;
  this.updateSectionMetrics();
  this.notifyCellsOfInsertionIntoDocument()
};
ADTableView.prototype.updateSectionMetrics = function(){
  if (!this.layerIsInDocument || this._style !== ADTableViewStylePlain || !this.populated) {
    return
  }
  this.sectionMetrics = [];
  for (var a = 0; a < this.sections.length; a++) {
    this.sectionMetrics[a] = {
      y: this.sections[a].offsetTop,
      height: this.sections[a].offsetHeight
    }
  }
};
ADTableView.prototype.touchesBegan = function(b){
  if (b._manufactured) {
    return
  }
  this.wasDeceleratingWhenTouchesBegan = this.decelerating;
  this.callSuper(b);
  this.touchedCell = null;
  this.touchedAccessory = null;
  this.shouldPreventScrolling = false;
  if (this.wasDeceleratingWhenTouchesBegan || !this.tracking) {
    return
  }
  var d = ADPoint.fromEvent(b);
  var c = document.elementFromPoint(d.x, d.y);
  if (this._style === ADTableViewStyleCustom) {
    var a = c;
    while (a.parentNode) {
      if (a.hasClassName(ADTableViewCustomCellCSS)) {
        this.touchedCell = a;
        this.touchedCellWasSelected = this.touchedCell.hasClassName(ADControlStateSelectedCSS);
        break
      }
      a = a.parentNode
    }
  }
  else {
    var e = (c._view !== undefined) ? c._view : c.getNearestView();
    if (e instanceof ADTableViewCell) {
      this.touchedCell = e;
      this.touchedCellWasSelected = this.touchedCell.selected
    }
    else {
      if (e instanceof ADButton) {
        this.touchedAccessory = e
      }
    }
  }
  if (this.touchedCell !== null || this.touchedAccessory !== null) {
    this.callMethodNameAfterDelay("detectedStationaryTouch", ADTableViewMinTouchDurationForCellSelection)
  }
};
ADTableView.prototype.touchesMoved = function(b){
  if (this.shouldPreventScrolling) {
    return
  }
  var a = this.dragging;
  this.callSuper(b);
  if (this.wasDeceleratingWhenTouchesBegan) {
    return
  }
  if (a != this.dragging && this.touchedCell !== null && !this.touchedCellWasSelected) {
    if (this.touchedCell instanceof ADTableViewCell) {
      this.touchedCell.selected = false
    }
    else {
      this.touchedCell.removeClassName(ADControlStateSelectedCSS)
    }
  }
};
ADTableView.prototype.touchesEnded = function(b){
  var a = this.dragging;
  this.callSuper(b);
  if (this.wasDeceleratingWhenTouchesBegan) {
    return
  }
  if (b.type != ADEndEvent) {
    return
  }
  if (b.eventPhase == Event.BUBBLING_PHASE && !a) {
    if (this.touchedAccessory !== null && !this.shouldPreventScrolling) {
      this.disclosureButtonWasSelectedAtPath(this.touchedAccessory.superview._tableViewDataSourcePath)
    }
    else {
      if (this.touchedCell !== null) {
        this.selectRowAtPath(this.touchedCell._tableViewDataSourcePath)
      }
    }
  }
};
ADTableView.prototype.pathForSelectedRow = function(){
  if (this.selectedCell === null) {
    return null
  }
  return (this._style === ADTableViewStyleCustom) ? this.pathForCustomCell(this.selectedCell) : this.pathForCell(this.selectedCell)
};
ADTableView.prototype.deselectRowAtPathAnimated = function(c, b){
  if (c === null) {
    return
  }
  var a = (this._style === ADTableViewStyleCustom) ? this.customCellForRowAtPath(c) : this.cellForRowAtPath(c);
  if (a !== null) {
    this.markCellAsSelectedAnimated(a, false, b)
  }
};
ADTableView.prototype.selectRowAtPath = function(b){
  var a = (this._style === ADTableViewStyleCustom) ? this.customCellForRowAtPath(b) : this.cellForRowAtPath(b);
  if (a === null) {
    throw (new Error("No cell at " + b.toString()));
    return
  }
  this.deselectRowAtPathAnimated(this.pathForSelectedRow(), false);
  this.selectedCell = a;
  this.markCellAsSelectedAnimated(this.selectedCell, true, false);
  if (ADUtils.objectHasMethod(this.delegate, ADTableViewDidSelectRowAtPath)) {
    this.delegate[ADTableViewDidSelectRowAtPath](this, b)
  }
};
ADTableView.prototype.detectedStationaryTouch = function(){
  if (!this.dragging && this.tracking) {
    if (this.touchedCell !== null) {
      this.markCellAsSelectedAnimated(this.touchedCell, true, false)
    }
    else {
      if (this.touchedAccessory !== null) {
        this.shouldPreventScrolling = true
      }
    }
  }
};
ADTableView.prototype.markCellAsSelectedAnimated = function(a, b, c){
  if (a instanceof ADTableViewCell) {
    a.setSelectedAnimated(b, c)
  }
  else {
    a[b ? "addClassName" : "removeClassName"](ADControlStateSelectedCSS)
  }
};
ADTableView.prototype.disclosureButtonWasSelectedAtPath = function(b){
  var a = this.cellForRowAtPath(b);
  if (a.accessoryType === ADTableViewCellAccessoryDetailDisclosureButton && ADUtils.objectHasMethod(this.delegate, ADTableViewDidSelectAccessoryForRowAtPath)) {
    this.delegate[ADTableViewDidSelectAccessoryForRowAtPath](this, b)
  }
};
const ADTableViewPlainHeaderHeight = 23;
ADTableView.prototype.updateSectionHeaders = function(){
  if (this.sectionMetrics.length != this.numberOfSections || this.style !== ADTableViewStylePlain) {
    return
  }
  var b = this.contentOffset.y;
  for (var g = 0; g < this.numberOfSections; g++) {
    var h = this.headers[g];
    if (h === undefined) {
      continue
    }
    var f = this.sectionMetrics[g];
    var e = f.y;
    var d = e + f.height;
    var c = d - b;
    var a = 0;
    if (c > 0 && c < (ADTableViewPlainHeaderHeight - 1)) {
      a = f.height - ADTableViewPlainHeaderHeight
    }
    else {
      if (e <= b && d > b) {
        a = Math.abs(e - b) - 1
      }
    }
    h.style.webkitTransform = ADUtils.t(0, a)
  }
};
ADClass(ADTableView);
ADTableView.init = function(){
  ADUtils.preloadImageAsset("tableview/UITableSelection.png")
};
window.addEventListener("load", ADTableView.init, false);
function ADCellPath(a, b){
  this.section = a || 0;
  this.row = b || 0
}

ADCellPath.prototype.toString = function(){
  return "ADCellPath with section " + this.section + " and row " + this.row
};
const ADTableViewCellAccessoryNone = "no-accessory";
const ADTableViewCellAccessoryDisclosureIndicator = "disclosure-accessory";
const ADTableViewCellAccessoryDetailDisclosureButton = "detail-accessory";
const ADTableViewCellSelectionStyleNone = "no-selection";
const ADTableViewCellSelectionStyleBlue = "blue-selection";
const ADTableViewCellSelectionStyleGray = "gray-selection";
const ADTableViewCellStyleDefault = "style-default";
const ADTableViewCellStyleValue1 = "style-value-1";
const ADTableViewCellStyleValue2 = "style-value-2";
const ADTableViewCellStyleSubtitle = "style-subtitle";
const ADTableViewCellSeparatorStyleNone = "separator-none";
const ADTableViewCellSeparatorStyleSingleLine = "separator-single-line";
const ADTableViewCellSeparatorStyleSingleLineEtched = "separator-single-line-etched";
ADTableViewCell.inherits = ADView;
ADTableViewCell.synthetizes = ["text", "detailedText", "selectionStyle", "accessoryType", "selected"];
function ADTableViewCell(a){
  this.style = a || ADTableViewCellStyleDefault;
  this.callSuper();
  this._selectionStyle = ADTableViewCellSelectionStyleBlue;
  this._accessoryType = ADTableViewCellAccessoryNone;
  this._selected = false;
  this.layer.removeEventListener(ADStartEvent, this, false)
}

ADTableViewCell.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-table-view-cell " + this.style);
  this.layer.setAttribute("role", "button");
  this.accessory = new ADButton(ADButtonTypeDetailDisclosure);
  this.accessory.addEventListener(ADControlTouchUpInsideEvent, this, false);
  this.addSubview(this.accessory);
  this.textLabel = this.layer.appendChild(document.createElement("span"));
  this.textLabel.addClassName("text-label");
  this.detailedTextLabel = this.layer.appendChild(document.createElement("span"));
  this.detailedTextLabel.addClassName("detailed-text-label")
};
ADTableViewCell.prototype.handleEvent = function(b){
  if (b.currentTarget === this.accessory.layer) {
    var a = this._table;
    var c = this._tableViewDataSourcePath;
    if (a !== undefined && c !== undefined) {
      a.disclosureButtonWasSelectedAtPath(c)
    }
  }
  else {
    this.callSuper(b)
  }
};
ADTableViewCell.prototype.getText = function(){
  return this.textLabel.innerText
};
ADTableViewCell.prototype.setText = function(a){
  this.textLabel.innerText = a;
  this.updateTextLayout()
};
ADTableViewCell.prototype.getDetailedText = function(){
  return this.detailedTextLabel.innerText
};
ADTableViewCell.prototype.setDetailedText = function(a){
  this.detailedTextLabel.innerText = a;
  this.updateTextLayout()
};
ADTableViewCell.prototype.setSelectionStyle = function(a){
  this.layer.removeClassName(this._selectionStyle);
  this.layer.addClassName(a);
  this._selectionStyle = a
};
const ADTableViewCellAccessoryDisclosureIndicatorWidth = 10;
const ADTableViewCellAccessoryDetailDisclosureButtonWidth = 44;
ADTableViewCell.prototype.setAccessoryType = function(a){
  this.layer.removeClassName(this._accessoryType);
  this.layer.addClassName(a);
  this._accessoryType = a
};
ADTableViewCell.prototype.setSelected = function(a){
  this.setSelectedAnimated(a, false)
};
ADTableViewCell.prototype.setSelectedAnimated = function(a, b){
  if (this._selected == a) {
    return
  }
  this._selected = a;
  this.layer[a ? "addClassName" : "removeClassName"](ADControlStateSelectedCSS)
};
ADTableViewCell.prototype.layerWasInsertedIntoDocument = function(){
  this.callSuper();
  this.updateTextLayout()
};
const ADTableViewCellStyleValue1Margin = 10;
ADTableViewCell.prototype.updateTextLayout = function(){
  if (this.style != ADTableViewCellStyleValue1 || !this.layerIsInDocument) {
    return
  }
  var c = this.textLabel.offsetWidth - 2 * ADTableViewCellStyleValue1Margin;
  this.textLabel.style.right = "auto !important";
  this.detailedTextLabel.style.right = "auto !important";
  var b = Math.min(this.textLabel.offsetWidth, c);
  var a = Math.min(this.detailedTextLabel.offsetWidth, c);
  this.textLabel.setAttribute("style", "");
  this.detailedTextLabel.setAttribute("style", "");
  if (b + a > c) {
    var d = Math.floor((b / (b + a)) * c);
    if (b > a) {
      this.textLabel.style.width = ADUtils.px(d);
      this.detailedTextLabel.style.left = ADUtils.px(d + ADTableViewCellStyleValue1Margin * 2)
    }
    else {
      this.textLabel.style.width = ADUtils.px(d + ADTableViewCellStyleValue1Margin);
      this.detailedTextLabel.style.left = ADUtils.px(d + ADTableViewCellStyleValue1Margin * 3)
    }
  }
};
ADClass(ADTableViewCell);
const ADCarouselViewVerticalOrientation = 0;
const ADCarouselViewHorizontalOrientation = 1;
const ADCarouselViewSelectionRotationDuration = 0.5;
const ADCarouselViewNumberOfCells = "carouselViewNumberOfCells";
const ADCarouselViewCellForIndex = "carouselViewCellForIndex";
const ADCarouselViewWillSelectCellAtIndex = "carouselViewWillSelectCellAtIndex";
const ADCarouselViewDidSelectCellAtIndex = "carouselViewDidSelectCellAtIndex";
const ADCarouselViewCellActiveCSS = "active";
ADCarouselView.inherits = ADView;
ADCarouselView.synthetizes = ["rotation"];
function ADCarouselView(){
  this.callSuper();
  this.dataSource = null;
  this.delegate = null;
  this.centersSelection = true;
  this.centerSelectionDuration = -1;
  this.orientation = ADCarouselViewVerticalOrientation;
  this.cellSize = new ADSize();
  this.cellPadding = 0;
  this.numberOfCells = 0;
  this.touchedCell = null;
  this.busySelecting = false;
  this.showingHighlight = false;
  this.currentHighlightCell = null;
  this.trackingMoved = false;
  this._rotation = 0;
  this.trackingPoints = [];
  this.animator = new ADAnimator(2000, this, [0.211196, 0.811224, 0.641221, 0.979592]);
  this.listContainer.addEventListener("webkitTransitionEnd", this, false);
  this.tracksTouchesOnceTouchesBegan = true
}

ADCarouselView.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-carousel-view");
  this.aligner = this.layer.appendChild(document.createElement("div"));
  this.aligner.className = "aligner";
  this.listContainer = this.aligner.appendChild(document.createElement("div"));
  this.listContainer.className = "ad-carousel-view-list-container"
};
ADCarouselView.prototype.setSize = function(a){
};
ADCarouselView.prototype.isVertical = function(){
  return (this.orientation == ADCarouselViewVerticalOrientation)
};
ADCarouselView.prototype.reloadData = function(){
  if (!ADUtils.objectHasMethod(this.dataSource, ADCarouselViewNumberOfCells) || !ADUtils.objectHasMethod(this.dataSource, ADCarouselViewCellForIndex)) {
    return
  }
  this.listContainer.textContent = "";
  this.numberOfCells = this.dataSource[ADCarouselViewNumberOfCells](this);
  var k = this.isVertical();
  this.radius = Math.ceil(this.numberOfCells * ((k ? this.cellSize.height : this.cellSize.width) + this.cellPadding)) / (2 * Math.PI);
  this.aligner.style.webkitTransform = "translateZ(" + (-this.radius) + "px)";
  var b = k ? 1 : 0;
  var a = k ? 0 : 1;
  var e = 360 / this.numberOfCells;
  var f = k ? (-this.cellSize.height / 2) : 0;
  var c = k ? 0 : (-this.cellSize.width / 2);
  for (var d = 0; d < this.numberOfCells; d++) {
    var j = this.dataSource[ADCarouselViewCellForIndex](this, d);
    j._list3DViewDataSourceIndex = d;
    j.style.top = f + "px";
    j.style.left = c + "px";
    j.style.webkitTransform = "rotate3d(" + b + ", " + a + ", 0, " + (-e * d) + "deg) translateZ(" + this.radius + "px)";
    j.addEventListener(ADStartEvent, this, false);
    this.listContainer.appendChild(j)
  }
  this.listContainer.style.top = (k ? this.radius : 0) + "px";
  this.listContainer.style.left = (k ? 0 : this.radius) + "px";
  var h = (k ? this.cellSize.width / 2 : this.radius) + this.position.x;
  var g = (k ? this.radius : this.cellSize.height / 2) + this.position.y;
  this.layer.style.webkitPerspectiveOrigin = h + "px " + g + "px";
  this.rotation = 0
};
ADCarouselView.prototype.setRotation = function(b){
  if (isNaN(b)) {
    return
  }
  this._rotation = b % 360;
  var a = this.isVertical();
  var d = a ? 1 : 0;
  var c = a ? 0 : 1;
  this.listContainer.style.webkitTransform = "rotate3d(" + d + ", " + c + ", 0, " + this._rotation + "deg)"
};
ADCarouselView.prototype.handleEvent = function(a){
  if (this.busySelecting && a.type != "webkitTransitionEnd") {
    return
  }
  this.callSuper(a);
  if (a.type == "webkitTransitionEnd") {
    this.transitionEnded(a)
  }
};
ADCarouselView.prototype.touchesBegan = function(a){
  if (a.currentTarget === this.layer) {
    return
  }
  this.callSuper(a);
  this.touchedCell = a.currentTarget;
  this.listContainer.style.webkitTransitionDuration = 0;
  this.wasStopppedDuringAnimation = this.animator.animating;
  if (this.wasStopppedDuringAnimation) {
    this.stopAnimation()
  }
  else {
    this.highlightCurrentCell()
  }
  this.startRotation = this.rotation;
  this.startTouchPosition = ADPoint.fromEvent(a);
  this.startXAngle = Math.acos((this.startTouchPosition.x - this.position.x - this.radius) / this.radius);
  this.startYAngle = Math.acos((this.startTouchPosition.y - this.position.y - this.radius) / this.radius);
  this.trackingMoved = false;
  this.trackingPoints = [];
  this.storeEventLocation(this.startTouchPosition)
};
ADCarouselView.prototype.touchesMoved = function(b){
  this.callSuper(b);
  this.removeCellHighlight();
  var a = ADPoint.fromEvent(b);
  this.storeEventLocation(a);
  this.trackingMoved = true;
  var c;
  if (this.isVertical()) {
    c = -(this.startYAngle - Math.acos((a.y - this.position.y - this.radius) / this.radius))
  }
  else {
    c = this.startXAngle - Math.acos((a.x - this.position.x - this.radius) / this.radius)
  }
  this.rotation = this.startRotation + ADUtils.radiansToDegrees(c)
};
ADCarouselView.prototype.touchesEnded = function(c){
  this.callSuper(c);
  if (this.touchedCell != null && !this.trackingMoved && !this.wasStopppedDuringAnimation) {
    this.busySelecting = true;
    var b = this.touchedCell._list3DViewDataSourceIndex * (360 / this.numberOfCells);
    var a = (b == this.rotation);
    this.cellIsBeingSelected(a);
    if (a || !this.centersSelection) {
      this.cellWasSelected(a);
      this.busySelecting = false;
      this.removeCellHighlight()
    }
    else {
      var e = Math.abs(b - this.rotation);
      if (e > 90) {
        if (b < this.rotation) {
          e = b + 360 - this.rotation
        }
        else {
          e = this.rotation + 360 - b
        }
      }
      var d = this.centerSelectionDuration;
      if (d < 0) {
        d = (Math.min(60, e) / 60 * ADCarouselViewSelectionRotationDuration)
      }
      this.listContainer.style.webkitTransitionDuration = Math.max(0.1, d) + "s";
      this.rotation = b
    }
  }
  else {
    this.startAnimating()
  }
};
ADCarouselView.prototype.transitionEnded = function(a){
  this.busySelecting = false;
  this.cellWasSelected(this.touchedCell, false);
  this.removeCellHighlight()
};
ADCarouselView.prototype.storeEventLocation = function(b){
  var a = {
    pos: (this.isVertical() ? b.y : b.x),
    date: new Date()
  };
  this.trackingPoints.push(a);
  if (this.trackingPoints.length > 10) {
    this.trackingPoints.shift()
  }
};
ADCarouselView.prototype.startAnimating = function(){
  var e = -1;
  for (var c = this.trackingPoints.length - 1; c > 0; --c) {
    if (this.trackingPoints[c].pos != 0) {
      e = c - 1;
      break
    }
  }
  if (e < 0) {
    return false
  }
  var a = e + 1;
  var f = this.trackingPoints[a].date - this.trackingPoints[e].date;
  var h = (this.trackingPoints[a].pos - this.trackingPoints[e].pos);
  if (Math.abs(h) < 3 || f > 35) {
    return false
  }
  var d = -Math.atan(h / this.radius);
  var b = Math.abs(d);
  var j;
  if (b < 0.075) {
    j = 360 / 4
  }
  else {
    if (b < 0.15) {
      j = 360 / 2
    }
    else {
      if (b < 0.225) {
        j = 360 * 0.75
      }
      else {
        j = 360
      }
    }
  }
  var g = (d < 0) ? (this.isVertical() ? "top-" : "right-") : (this.isVertical() ? "bottom-" : "left-");
  if (g == "left-" || g == "top-") {
    j = -j
  }
  this.rotationBeforeAnimation = this.rotation;
  this.animationAngle = j;
  this.animator.start();
  return true
};
ADCarouselView.prototype.animationDidIterate = function(a){
  this.rotation = this.rotationBeforeAnimation + a * this.animationAngle
};
ADCarouselView.prototype.stopAnimation = function(){
  this.animator.stop()
};
ADCarouselView.prototype.highlightCurrentCell = function(){
  if (this.touchedCell == null) {
    return
  }
  if (this.currentHighlightCell != null) {
    this.removeCellHighlight()
  }
  this.touchedCell.addClassName(ADCarouselViewCellActiveCSS);
  this.currentHighlightCell = this.touchedCell;
  this.showingHighlight = true
};
ADCarouselView.prototype.removeCellHighlight = function(){
  if (!this.showingHighlight || this.touchedCell == null) {
    return
  }
  this.currentHighlightCell.removeClassName(ADCarouselViewCellActiveCSS);
  this.currentHighlightCell = null;
  this.showingHighlight = false
};
ADCarouselView.prototype.cellIsBeingSelected = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADCarouselViewWillSelectCellAtIndex)) {
    this.delegate[ADCarouselViewWillSelectCellAtIndex](this, this.touchedCell._list3DViewDataSourceIndex, a)
  }
};
ADCarouselView.prototype.cellWasSelected = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADCarouselViewDidSelectCellAtIndex)) {
    this.delegate[ADCarouselViewDidSelectCellAtIndex](this, this.touchedCell._list3DViewDataSourceIndex, a)
  }
};
ADClass(ADCarouselView);
const ADNavigationBarStyleDefault = "default";
const ADNavigationBarStyleBlack = "black";
const ADNavigationBarStyleBlackTranslucent = "black-translucent";
const ADNavigationBarButtonMarginLeft = 5;
const ADNavigationBarButtonMarginRight = 8;
const ADNavigationBarHeight = 44;
const ADNavigationBarAnimationDuration = 0.35;
const ADNavigationBarShouldPushItem = "navigationBarShouldPushItem";
const ADNavigationBarDidPushItem = "navigationBarDidPushItem";
const ADNavigationBarShouldPopItem = "navigationBarShouldPopItem";
const ADNavigationBarDidPopItem = "navigationBarDidPopItem";
ADNavigationBar.inherits = ADView;
ADNavigationBar.synthetizes = ["barStyle", "items", "topItem", "backItem"];
function ADNavigationBar(){
  this.callSuper();
  this.delegate = null;
  this._barStyle = "";
  this._items = [];
  this.busy = false;
  this.itemsToSetupAfterAnimatedChange = null;
  this.barStyle = ADNavigationBarStyleDefault
}

ADNavigationBar.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-navigation-bar")
};
ADNavigationBar.prototype.setSize = function(a){
  this.callSuper(new ADSize(a.width, ADNavigationBarHeight));
  this.updateTopItemLayout()
};
ADNavigationBar.prototype.willMoveToSuperview = function(a){
  if (a !== null && this._size.width == 0) {
    this.size = new ADSize(a._size.width, ADNavigationBarHeight)
  }
};
ADNavigationBar.prototype.layerWasInsertedIntoDocument = function(a){
  this.callSuper();
  this.updateTopItemLayout()
};
ADNavigationBar.prototype.setBarStyle = function(a){
  this.layer.removeClassName(this._barStyle);
  this.layer.addClassName(a);
  this._barStyle = a
};
ADNavigationBar.prototype.getTopItem = function(){
  return (this._items.length > 0) ? this._items[this._items.length - 1] : null
};
ADNavigationBar.prototype.getBackItem = function(){
  return (this._items.length > 1) ? this._items[this._items.length - 2] : null
};
ADNavigationBar.prototype.handleEvent = function(a){
  this.callSuper(a);
  if (this.busy && a.type == "webkitTransitionEnd") {
    this.transitionsEnded()
  }
};
ADNavigationBar.prototype.setItems = function(a){
  this.setItemsAnimated(a, false)
};
ADNavigationBar.prototype.setItemsAnimated = function(b, f){
  if (this.busy || b.length == 0) {
    return
  }
  ADTransaction.begin();
  var c = this.topItem;
  var g = (b.length > 1) ? b[b.length - 2] : null;
  var e = b[b.length - 1];
  for (var d = 0; d < this._items.length; d++) {
    this._items[d].navigationBar = null
  }
  for (var d = 0; d < b.length; d++) {
    b[d].navigationBar = this
  }
  if (c === null) {
    if (!this.shouldPushItem(e)) {
      ADTransaction.commit();
      return
    }
    this.addItemViews(e, null);
    e.sizeItemsAndComputePositionsWithBackItem(null);
    e.updateLayout();
    this._items = b;
    if (ADUtils.objectHasMethod(this.delegate, ADNavigationBarDidPushItem)) {
      this.delegate[ADNavigationBarDidPushItem](this, e)
    }
    ADTransaction.commit()
  }
  else {
    if (c === e) {
      this.removeViewsForItem(c);
      while (this.subviews.length) {
        this.subviews[0].removeFromSuperview()
      }
      this.addItemViews(e, g);
      e.sizeItemsAndComputePositionsWithBackItem(g);
      e.updateLayout();
      this._items = b;
      ADTransaction.commit()
    }
    else {
      var a = (this._items.indexOf(e) == -1);
      if ((a && !this.shouldPushItem(e)) || (!a && !this.shouldPopItem(c))) {
        ADTransaction.commit();
        return
      }
      this.addItemViews(e, g);
      e.sizeItemsAndComputePositionsWithBackItem(g);
      this.itemsAfterTransition = b;
      this.transitionToItem(e, c, a, f)
    }
  }
};
ADNavigationBar.prototype.pushNavigationItemAnimated = function(b, a){
  if (this.busy) {
    return
  }
  ADTransaction.begin();
  if (!this.shouldPushItem(b)) {
    ADTransaction.commit();
    return
  }
  this.setItemsAnimated(this._items.concat([b]), a);
  ADTransaction.commit()
};
ADNavigationBar.prototype.popNavigationItemAnimated = function(a){
  if (this.busy || this._items.length < 2) {
    return
  }
  ADTransaction.begin();
  if (!this.shouldPopItem(this.topItem)) {
    ADTransaction.commit();
    return
  }
  this.setItemsAnimated(this._items.slice(0, this._items.length - 1), a);
  ADTransaction.commit()
};
ADNavigationBar.prototype.addItemViews = function(f, d){
  var c = f._leftBarButtonItem || ((d !== null) ? d.backBarButtonItem : null) || null;
  var b = [c, f.rightBarButtonItem, f.titleView];
  for (var e = 0; e < b.length; e++) {
    var f = b[e];
    if (ADUtils.objectIsUndefined(f) || f === null) {
      continue
    }
    var a = f.view;
    if (a.superview === null || a.superview !== this) {
      this.addSubview(a)
    }
  }
};
ADNavigationBar.prototype.transitionToItem = function(f, d, b, e){
  this.busy = e;
  this.previousItem = d;
  this.transitionWentForward = b;
  ADTransaction.defaults.duration = e ? ADNavigationBarAnimationDuration : 0;
  ADTransaction.defaults.properties = ["opacity", "position"];
  if (d._leftBarButtonItem !== null) {
    if (d._leftBarButtonItem !== f._leftBarButtonItem) {
      new ADTransition({
        target: d._leftBarButtonItem.view,
        properties: ["opacity"],
        to: [0]
      }).start()
    }
  }
  else {
    if (d.leftButton !== null) {
      var a = (b) ? (-d.leftButton.view.size.width - ADNavigationItemLeftButtonLeftMargin) : f.positions.title;
      new ADTransition({
        target: d.leftButton.view,
        to: [0, new ADPoint(a, 0)]
      }).start()
    }
  }
  var a = (b) ? ADNavigationItemLeftButtonLeftMargin : this.size.width;
  new ADTransition({
    target: d.titleView.view,
    to: [0, new ADPoint(a, 0)]
  }).start();
  if (d._rightBarButtonItem !== null && d._rightBarButtonItem !== f._rightBarButtonItem) {
    new ADTransition({
      target: d._rightBarButtonItem.view,
      properties: ["opacity"],
      to: [0]
    }).start()
  }
  if (f._leftBarButtonItem !== null) {
    if (f._leftBarButtonItem !== d._leftBarButtonItem) {
      f._leftBarButtonItem.view.position = new ADPoint(f.positions.leftButton, 0);
      new ADTransition({
        target: f._leftBarButtonItem.view,
        properties: ["opacity"],
        from: [0],
        to: [1]
      }).start()
    }
  }
  else {
    if (f.leftButton !== null) {
      var c = (b) ? d.positions.title : (-d.leftButton.view.size.width - ADNavigationItemLeftButtonLeftMargin);
      new ADTransition({
        target: f.leftButton.view,
        from: [0, new ADPoint(c, 0)],
        to: [f.hidesBackButton ? 0 : 1, new ADPoint(f.positions.leftButton, 0)]
      }).start()
    }
  }
  var c = (b) ? this.size.width : ADNavigationItemLeftButtonLeftMargin;
  new ADTransition({
    target: f.titleView.view,
    from: [0, new ADPoint(c, 0)],
    to: [1, new ADPoint(f.positions.title, 0)]
  }).start();
  if (f._rightBarButtonItem !== null && f._rightBarButtonItem !== d._rightBarButtonItem) {
    f._rightBarButtonItem.view.position = new ADPoint(f.positions.rightButton, 0);
    new ADTransition({
      target: f._rightBarButtonItem.view,
      properties: ["opacity"],
      from: [0],
      to: [1]
    }).start()
  }
  if (e) {
    d.titleView.view.layer.addEventListener("webkitTransitionEnd", this, false)
  }
  ADTransaction.commit();
  if (!e) {
    this.transitionsEnded()
  }
};
ADNavigationBar.prototype.transitionsEnded = function(){
  this._items = this.itemsAfterTransition;
  this.busy = false;
  if (this.transitionWentForward) {
    if (ADUtils.objectHasMethod(this.delegate, ADNavigationBarDidPushItem)) {
      this.delegate[ADNavigationBarDidPushItem](this, this.topItem)
    }
  }
  else {
    if (ADUtils.objectHasMethod(this.delegate, ADNavigationBarDidPopItem)) {
      this.delegate[ADNavigationBarDidPopItem](this, this.previousItem)
    }
  }
  this.removeViewsForItem(this.previousItem);
  if (this.superview instanceof ADNavigationView) {
    this.superview.viewController.transitionsEnded()
  }
};
ADNavigationBar.prototype.removeViewsForItem = function(a){
  if (a.leftButton !== null && a.leftButton !== this.topItem.leftButton) {
    a.leftButton.view.removeFromSuperview()
  }
  a.titleView.view.removeFromSuperview();
  if (a._rightBarButtonItem !== null && a._rightBarButtonItem !== a._rightBarButtonItem) {
    a._rightBarButtonItem.view.removeFromSuperview()
  }
  if (a.leftButton !== null) {
    a.leftButton.removeEventListener(ADControlTouchUpInsideEvent, this, false)
  }
};
ADNavigationBar.prototype.updateTopItemLayout = function(){
  if (this._items.length > 0) {
    this.topItem.updateLayoutIfTopItem()
  }
};
ADNavigationBar.prototype.shouldPushItem = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADNavigationBarShouldPushItem)) {
    return this.delegate[ADNavigationBarShouldPushItem](this, a)
  }
  return true
};
ADNavigationBar.prototype.shouldPopItem = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADNavigationBarShouldPopItem)) {
    return this.delegate[ADNavigationBarShouldPopItem](this, a)
  }
  return true
};
ADClass(ADNavigationBar);
const ADNavigationItemLeftButtonLeftMargin = 5;
const ADNavigationItemLeftButtonRightMargin = 8;
const ADNavigationItemRightButtonLeftMargin = 11;
const ADNavigationItemRightButtonRightMargin = 5;
ADNavigationItem.inherits = ADObject;
ADNavigationItem.synthetizes = ["title", "backBarButtonItem", "leftBarButtonItem", "rightBarButtonItem", "hidesBackButton"];
ADNavigationItem.includes = [ADEventTriage];
function ADNavigationItem(a){
  this.callSuper();
  this._title = "";
  this._backBarButtonItem = new ADBarButtonItem(ADBarButtonItemTypeBack);
  this._hidesBackButton = false;
  this._leftBarButtonItem = null;
  this._rightBarButtonItem = null;
  this.titleView = new ADBarButtonItem(ADBarButtonItemTypePlain);
  this.titleView.view.layer.setAttribute("role", "header");
  this.buttons = null;
  this.positions = null;
  this.navigationBar = null;
  this.viewController = null;
  this.title = a || "";
  this._backBarButtonItem.addEventListener(ADControlTouchUpInsideEvent, this, false)
}

ADNavigationItem.prototype.handleControlTouchUpInside = function(a){
  if (this._hidesBackButton) {
    return
  }
  if (this.viewController !== null && this.viewController.parentViewController !== null) {
    this.viewController.parentViewController.popViewControllerAnimated(true)
  }
  else {
    if (this.navigationBar !== null) {
      this.navigationBar.popNavigationItemAnimated(true)
    }
  }
};
ADNavigationItem.prototype.setTitle = function(a){
  this._title = a;
  this.updateLayoutIfTopItem()
};
ADNavigationItem.prototype.setBackBarButtonItem = function(a){
  if (this.navigationBar !== null && this.navigationBar.backItem === this) {
    if (this._backBarButtonItem !== null) {
      this._backBarButtonItem.view.removeFromSuperview()
    }
    this._backBarButtonItem = a;
    this.navigationBar.addSubview(this._backBarButtonItem.view);
    this.navigationBar.topItem.updateLayoutIfTopItem()
  }
  else {
    this._backBarButtonItem = a
  }
  if (this._backBarButtonItem !== null) {
    this._backBarButtonItem.addEventListener(ADControlTouchUpInsideEvent, this, false)
  }
};
ADNavigationItem.prototype.setHidesBackButton = function(a){
  this.setHidesBackButtonWithAnimation(a, false)
};
ADNavigationItem.prototype.setLeftBarButtonItem = function(a){
  if (this.navigationBar !== null && this.navigationBar.topItem === this) {
    var c = this.getDefaultBackButton();
    if (this.leftButton !== null) {
      this.leftButton.view.removeFromSuperview()
    }
    this._leftBarButtonItem = a;
    var b = this._leftBarButtonItem || this.getDefaultBackButton();
    if (b !== null) {
      this.navigationBar.addSubview(b.view);
      if (this._leftBarButtonItem === null && !this.hidesBackButton) {
        b.view.opacity = 1
      }
    }
    this.updateLayoutIfTopItem()
  }
  else {
    this._leftBarButtonItem = a
  }
};
ADNavigationItem.prototype.setRightBarButtonItem = function(a){
  if (this.navigationBar !== null && this.navigationBar.topItem === this) {
    if (this._rightBarButtonItem !== null) {
      this._rightBarButtonItem.view.removeFromSuperview()
    }
    this._rightBarButtonItem = a;
    this.navigationBar.addSubview(this._rightBarButtonItem.view);
    this.updateLayoutIfTopItem()
  }
  else {
    this._rightBarButtonItem = a
  }
};
ADNavigationItem.prototype.setHidesBackButtonWithAnimation = function(a, b){
  var c = this.getDefaultBackButton();
  if (this._hidesBackButton == a) {
    return
  }
  this._hidesBackButton = a;
  if (c === null) {
    return
  }
  c.view.transitionsEnabled = b;
  c.view.opacity = a ? 0 : 1
};
ADNavigationItem.prototype.setLeftBarButtonItemWithAnimation = function(b, a){
  if (!a || this.navigationBar === null || this.navigationBar.topItem !== this) {
    this.leftBarButtonItem = b;
    return
  }
  ADTransaction.begin();
  ADTransaction.defaults.duration = 0.5;
  ADTransaction.defaults.properties = ["opacity"];
  var d = this.leftButton;
  if (d !== null) {
    new ADTransition({
      target: d.view,
      to: [0],
      removesTargetUponCompletion: true
    }).start()
  }
  this._leftBarButtonItem = b;
  var c = this._leftBarButtonItem || this.getDefaultBackButton();
  if (c !== null) {
    this.navigationBar.addSubview(c.view);
    if (this._leftBarButtonItem !== null || !this._hidesBackButton) {
      new ADTransition({
        target: c.view,
        from: [0],
        to: [1]
      }).start()
    }
  }
  this.updateLayoutIfTopItem();
  ADTransaction.commit()
};
ADNavigationItem.prototype.setRightBarButtonItemWithAnimation = function(b, a){
  if (!a || this.navigationBar === null || this.navigationBar.topItem !== this) {
    this.rightBarButtonItem = b;
    return
  }
  ADTransaction.begin();
  ADTransaction.defaults.duration = 0.5;
  ADTransaction.defaults.properties = ["opacity"];
  var c = this._rightBarButtonItem;
  if (c !== null) {
    new ADTransition({
      target: c.view,
      to: [0],
      removesTargetUponCompletion: true
    }).start()
  }
  this._rightBarButtonItem = b;
  if (this._rightBarButtonItem !== null) {
    this.navigationBar.addSubview(this._rightBarButtonItem.view);
    new ADTransition({
      target: this._rightBarButtonItem.view,
      from: [0],
      to: [1]
    }).start()
  }
  this.updateLayoutIfTopItem();
  ADTransaction.commit()
};
ADNavigationItem.prototype.getDefaultBackButton = function(){
  return (this.navigationBar !== null && this.navigationBar.backItem !== null) ? this.navigationBar.backItem.backBarButtonItem : null
};
ADNavigationItem.prototype.sizeItemsAndComputePositionsWithBackItem = function(a){
  if (this.navigationBar === null) {
    return
  }
  var j = this._leftBarButtonItem || ((a !== null) ? a.backBarButtonItem : null);
  var n = (this._rightBarButtonItem !== null) ? this._rightBarButtonItem.view.size.width : 0;
  var e = this.navigationBar.size.width - ADNavigationItemLeftButtonLeftMargin - ADNavigationItemRightButtonRightMargin;
  if (j !== null) {
    e -= ADNavigationItemLeftButtonRightMargin
  }
  if (this._rightBarButtonItem !== null) {
    e -= ADNavigationItemRightButtonLeftMargin + n
  }
  var m = 0;
  if (j !== null) {
    j.maxWidth = this.navigationBar.size.width / 2;
    if (j !== this._leftBarButtonItem && j.title == "" && j.image === null) {
      j.title = a.title
    }
    m = j.view.size.width
  }
  this.titleView.maxWidth = 0;
  this.titleView.title = this._title;
  var l = this.titleView.view.size.width;
  if (l + m > e) {
    if (j !== null) {
      j.maxWidth = Math.min(Math.max(e / 3, e - l), j.maxWidth);
      m = j.view.size.width
    }
    this.titleView.maxWidth = e - m;
    l = this.titleView.view.size.width
  }
  var c = ADNavigationItemLeftButtonLeftMargin;
  var h = this.navigationBar.size.width - ADNavigationItemRightButtonRightMargin - n;
  var i = c + ((j != null) ? m + ADNavigationItemLeftButtonRightMargin : 0);
  var d = h - l - ((n > 0) ? ADNavigationItemRightButtonLeftMargin : 0);
  var g = (this.navigationBar.size.width - l) / 2;
  var k = g;
  if (g > d || g < i) {
    var b = Math.abs(g - i);
    var f = Math.abs(g - d);
    k = (b < f) ? i : d
  }
  this.leftButton = j;
  this.positions = {
    leftButton: c,
    title: k,
    rightButton: h
  }
};
ADNavigationItem.prototype.updateLayout = function(){
  if (this.positions === null || this.button === null) {
    return
  }
  if (this.leftButton != null) {
    this.leftButton.view.position = new ADPoint(this.positions.leftButton, 0)
  }
  if (this._rightBarButtonItem != null) {
    this._rightBarButtonItem.view.position = new ADPoint(this.positions.rightButton, 0)
  }
  this.titleView.view.position = new ADPoint(this.positions.title, 0)
};
ADNavigationItem.prototype.updateLayoutIfTopItem = function(a){
  if (this.navigationBar === null || this.navigationBar.topItem !== this) {
    return
  }
  this.sizeItemsAndComputePositionsWithBackItem(this.navigationBar.backItem);
  this.updateLayout()
};
ADClass(ADNavigationItem);
const ADTabBarHeight = 49;
const ADTabBarCustomizeGridCellSize = 80;
const ADTabBarDidSelectItem = "tabBarDidSelectItem";
const ADTabBarWillBeginCustomizingItems = "tabBarWillBeginCustomizingItems";
const ADTabBarDidBeginCustomizingItems = "tabBarDidBeginCustomizingItems";
const ADTabBarWillEndCustomizingItemsChanged = "tabBarWillEndCustomizingItemsChanged";
const ADTabBarDidEndCustomizingItemsChanged = "tabBarDidEndCustomizingItemsChanged";
ADTabBar.inherits = ADView;
ADTabBar.synthetizes = ["items", "selectedItem"];
function ADTabBar(){
  this.delegate = null;
  this.isCustomizing = false;
  this._items = [];
  this._selectedItem = null;
  this.callSuper();
  this.layer.addEventListener("webkitTransitionEnd", this, false)
}

ADTabBar.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-tab-bar")
};
ADTabBar.prototype.setSize = function(a){
  a.height = ADTabBarHeight;
  this.callSuper(a);
  this.updateLayout()
};
ADTabBar.prototype.willMoveToSuperview = function(a){
  if (a === null) {
    return
  }
  if (this._size.width == 0) {
    this.size = new ADSize(a.size.width, ADTabBarHeight)
  }
  if (this._position.y == 0) {
    this.position = new ADPoint(0, a.size.height - ADTabBarHeight)
  }
};
ADTabBar.prototype.setSelectedItem = function(a){
  if (this._selectedItem === a) {
    return
  }
  if (this._selectedItem != null) {
    this._selectedItem.selected = false
  }
  a.selected = true;
  this._selectedItem = a;
  if (ADUtils.objectHasMethod(this.delegate, ADTabBarDidSelectItem)) {
    this.delegate[ADTabBarDidSelectItem](this, a)
  }
};
ADTabBar.prototype.setItems = function(a){
  this.setItemsAnimated(a, false)
};
ADTabBar.prototype.setItemsAnimated = function(b, e){
  for (var c = 0; c < this._items.length; c++) {
    var d = this._items[c];
    if (b.indexOf(d) == -1) {
      d.transitionsEnabled = e;
      if (!e) {
        d.removeFromSuperview()
      }
      else {
        d.needsRemoval = true;
        d.transform = "scale(0.001)";
        d.opacity = 0
      }
    }
  }
  var a = (this.size.width - 4) / b.length;
  for (var c = 0; c < b.length; c++) {
    var d = b[c];
    d.position = new ADPoint(2 + Math.round(c * a), 0);
    d.size = new ADSize(Math.round(a), ADTabBarItemHeight);
    d.transitionsEnabled = e;
    if (d.superview !== this) {
      this.addSubview(d);
      d.addEventListener(ADControlTouchDownEvent, this, false)
    }
  }
  this._items = b;
  if ((this.selectedItem == null || this.selectedItem.superview !== this || this.selectedItem.needsRemoval) && b.length > 0) {
    this.selectedItem = b[0]
  }
};
ADTabBar.prototype.updateLayout = function(){
  if (this._items.length > 0) {
    this.setItemsAnimated(this._items, false)
  }
};
ADTabBar.prototype.handleEvent = function(a){
  this.callSuper(a);
  switch (a.type) {
    case ADControlTouchDownEvent:
      this.selectedItem = a.control;
      break;
    case "webkitTransitionEnd":
      this.removeItemIfNeeded(a.target._control);
      break
  }
};
ADTabBar.prototype.removeItemIfNeeded = function(a){
  if (a.needsRemoval) {
    a.removeFromSuperview();
    a.needsRemoval = false;
    a.transitionsEnabled = false;
    a.transform = "scale(1)";
    a.opacity = 1
  }
};
ADTabBar.prototype.beginCustomizingItems = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADTabBarWillBeginCustomizingItems)) {
    this.delegate[ADTabBarWillBeginCustomizingItems](this, a)
  }
  this.isCustomizing = true;
  this.itemsPriorToCustomization = this._items;
  this.customizingItems = a;
  if (ADUtils.objectHasMethod(this.delegate, ADTabBarDidBeginCustomizingItems)) {
    this.delegate[ADTabBarDidBeginCustomizingItems](this, a)
  }
};
ADTabBar.prototype.endCustomizingAnimated = function(a){
  var b = true;
  if (ADUtils.objectHasMethod(this.delegate, ADTabBarWillEndCustomizingItemsChanged)) {
    this.delegate[ADTabBarWillEndCustomizingItemsChanged](this, this.customizingItems, b)
  }
  this.isCustomizing = false;
  if (ADUtils.objectHasMethod(this.delegate, ADTabBarDidEndCustomizingItemsChanged)) {
    this.delegate[ADTabBarDidEndCustomizingItemsChanged](this, this.customizingItems, b)
  }
};
ADClass(ADTabBar);
const ADToolbarHeight = 44;
const ADToolbarEdgeMargin = 6;
const ADToolbarItemMargin = 10;
const ADToolbarStyleDefault = "default";
const ADToolbarStyleBlack = "black";
const ADToolbarStyleBlackTranslucent = "black-translucent";
const ADToolbarAnimationDuration = 0.2;
const ADToolbarFadeOutTransition = {
  properties: ["transform", "opacity"],
  to: ["scale(0.01)", 0]
};
ADToolbar.inherits = ADView;
ADToolbar.synthetizes = ["items", "style"];
function ADToolbar(){
  this._items = [];
  this._style = "";
  this.callSuper();
  this.layer.addEventListener("webkitTransitionEnd", this, false);
  this.style = ADToolbarStyleDefault;
  this.clipsToBounds = true
}

ADToolbar.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-toolbar");
  this.glow = this.layer.appendChild(document.createElement("div"));
  this.glow.className = "glow"
};
ADToolbar.prototype.setPosition = function(a){
  this.callSuper(a);
  if (this.layerIsInDocument) {
    this.callMethodNameAfterDelay("updateBackgroundWithPosition", 0)
  }
};
ADToolbar.prototype.setSize = function(a){
  a.height = ADToolbarHeight;
  this.callSuper(a);
  this.updateLayout()
};
ADToolbar.prototype.willMoveToSuperview = function(a){
  if (a !== null && this._size.width == 0) {
    this.size = new ADSize(a.size.width, ADToolbarHeight)
  }
};
ADToolbar.prototype.layerWasInsertedIntoDocument = function(){
  this.updateBackgroundWithPosition()
};
ADToolbar.prototype.setStyle = function(a){
  this.layer.removeClassName(this._style);
  this.layer.addClassName(a);
  this._style = a
};
ADToolbar.prototype.setItems = function(a){
  this.setItemsAnimated(a, false)
};
ADToolbar.prototype.setItemsAnimated = function(j, d){
  ADTransaction.begin();
  ADTransaction.defaults.duration = d ? ADToolbarAnimationDuration : 0;
  for (var f = 0; f < this._items.length; f++) {
    var m = this._items[f];
    var k = m.view;
    if (j.indexOf(m) == -1) {
      if (!d) {
        k.removeFromSuperview()
      }
      else {
        k.needsRemoval = true;
        k.applyTransition(ADToolbarFadeOutTransition)
      }
    }
  }
  for (var f = 0; f < j.length; f++) {
    m = j[f];
    k = m.view;
    if (k.superview !== this) {
      m._newItem = true;
      this.addSubview(k);
      k.addPropertyObserver("size", this);
      if (m.type == ADBarButtonItemTypePlain) {
        k.addEventListener(ADControlTouchStateChangeEvent, this, false)
      }
    }
  }
  var e = 0;
  var a = 0;
  for (var f = 0; f < j.length; f++) {
    m = j[f];
    if (m.type == ADBarButtonItemTypeFlexibleSpace) {
      e++
    }
    else {
      a += m.view.size.width
    }
  }
  var b = this.size.width - a - ADToolbarItemMargin * (j.length - 1) - ADToolbarEdgeMargin * 2;
  var l = (e > 0) ? (b / e) : 0;
  var h = ADToolbarEdgeMargin;
  var c;
  for (var f = 0; f < j.length; f++) {
    c = ADToolbarItemMargin;
    m = j[f];
    k = m.view;
    if (m.type == ADBarButtonItemTypeFlexibleSpace) {
      h += l
    }
    else {
      if (m.type == ADBarButtonItemTypeFixedSpace) {
        h += k.size.width;
        c = 0
      }
      else {
        var g = new ADPoint(h, (this.size.height - k.size.height) / 2);
        if (m._newItem) {
          k.position = g;
          m._newItem = false;
          if (d) {
            k.applyTransition(ADViewTransitionDissolveIn)
          }
        }
        else {
          k.applyTransition({
            properties: ["position"],
            to: [g]
          })
        }
        h += k.size.width
      }
    }
    h += c
  }
  ADTransaction.commit();
  this._items = j
};
ADToolbar.prototype.updateLayout = function(){
  if (this._items.length > 0) {
    this.setItemsAnimated(this._items, false)
  }
};
ADToolbar.prototype.updateBackgroundWithPosition = function(){
  var a = window.webkitConvertPointFromNodeToPage(this.layer, new WebKitPoint(0, 0));
  this.layer[a.y == 0 ? "addClassName" : "removeClassName"]("top")
};
ADToolbar.prototype.handleEvent = function(a){
  this.callSuper(a);
  if (a.type == "webkitTransitionEnd") {
    if (a.target === this.layer) {
      return
    }
    else {
      if (a.target !== this.glow) {
        this.removeItemViewIfNeeded(a.target._control)
      }
      else {
        if (this.glow.style.opacity == 0) {
          this.glow.style.display = "none"
        }
      }
    }
  }
  else {
    if (a.type == ADControlTouchStateChangeEvent) {
      var b = a.control;
      this.glow.style.webkitTransform = ADUtils.t(b.position.x + b.size.width / 2 - 50, 0);
      this.glow.style.opacity = b.touchInside ? 1 : 0;
      this.glow.style.display = "block"
    }
  }
};
ADToolbar.prototype.removeItemViewIfNeeded = function(a){
  if (a.needsRemoval) {
    a.removeFromSuperview();
    a.needsRemoval = false;
    a.transitionsEnabled = false;
    a.transform = "scale(1)";
    a.opacity = 1
  }
};
ADToolbar.prototype.handlePropertyChange = function(b, a){
  this.setItemsAnimated(this._items, false)
};
ADClass(ADToolbar);
ADToolbar.init = function(){
  ADUtils.preloadImageAsset("bar/UINavigationBarDefaultBackground.png");
  ADUtils.preloadImageAsset("bar/UINavigationBarBlackOpaqueBackground.png");
  ADUtils.preloadImageAsset("bar/UINavigationBarBlackTranslucentBackground.png");
  ADUtils.preloadImageAsset("bar/toolbar_glow.png")
};
window.addEventListener("load", ADToolbar.init, false);
const ADProgressViewStyleDefault = "default";
const ADProgressViewStyleBar = "bar";
const ADProgressViewDefaultHeight = 9;
const ADProgressViewBarHeight = 11;
ADProgressView.inherits = ADView;
ADProgressView.synthetizes = ["progress", "style", "width"];
function ADProgressView(a){
  this.callSuper();
  this._progress = 0;
  this._style = "";
  this.style = (a != null) ? a : ADProgressViewStyleDefault
}

ADProgressView.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-progress-view");
  this.bar = this.layer.appendChild(document.createElement("div"))
};
ADProgressView.prototype.setSize = function(a){
  a.height = (this._style == ADProgressViewStyleDefault) ? ADProgressViewDefaultHeight : ADProgressViewBarHeight;
  this.callSuper(a);
  this.updateBar()
};
ADProgressView.prototype.willMoveToSuperview = function(a){
  if (a instanceof ADToolbar) {
    this.style = ADProgressViewStyleBar
  }
};
ADProgressView.prototype.getWidth = function(){
  return this.size.width
};
ADProgressView.prototype.setWidth = function(a){
  this.size = new ADSize(a, 0)
};
ADProgressView.prototype.setProgress = function(a){
  a = Math.max(Math.min(a, 1), 0);
  if (a == this._progress) {
    return
  }
  this._progress = a;
  this.updateBar()
};
ADProgressView.prototype.setStyle = function(a){
  if (a == this._style) {
    return
  }
  this.layer.removeClassName(this._style);
  this.layer.addClassName(a);
  this._style = a;
  this.size = new ADSize(this.size.width, 0)
};
ADProgressView.prototype.updateBar = function(){
  this.bar.style.width = ADUtils.px(this.size.width * this._progress)
};
ADClass(ADProgressView);
ADProgressView.init = function(){
  ADUtils.preloadImageAsset("progress/default_outer.png");
  ADUtils.preloadImageAsset("progress/default_inner.png");
  ADUtils.preloadImageAsset("progress/bar_outer.png");
  ADUtils.preloadImageAsset("progress/bar_inner.png")
};
window.addEventListener("load", ADProgressView.init, false);
const ADControlTouchDownEvent = "controlTouchDown";
const ADControlTouchDragInsideEvent = "controlTouchDragInside";
const ADControlTouchDragOutsideEvent = "controlTouchDragOutside";
const ADControlTouchDragEnterEvent = "controlTouchDragEnter";
const ADControlTouchDragExitEvent = "controlTouchDragExit";
const ADControlTouchUpInsideEvent = "controlTouchUpInside";
const ADControlTouchUpOutsideEvent = "controlTouchUpOutside";
const ADControlTouchCancelEvent = "controlTouchCancel";
const ADControlValueChangeEvent = "controlValueChange";
const ADControlTouchStateChangeEvent = "controlTouchStateChange";
const ADControlStateNormal = 0;
const ADControlStateNormalCSS = "normal";
const ADControlStateHighlighted = 1 << 0;
const ADControlStateHighlightedCSS = "highlighted";
const ADControlStateDisabled = 1 << 1;
const ADControlStateDisabledCSS = "disabled";
const ADControlStateSelected = 1 << 2;
const ADControlStateSelectedCSS = "selected";
ADControl.inherits = ADView;
ADControl.includes = [ADEventTarget];
ADControl.synthetizes = ["state", "enabled", "selected", "highlighted", "touchLayer"];
function ADControl(){
  this.tag = 0;
  this._enabled = true;
  this._selected = false;
  this._highlighted = false;
  this._touchLayer = null;
  this.callSuper();
  this.tracking = false;
  this.touchInside = false;
  this.layer._control = this;
  this.eventTarget = this.layer;
  this.tracksTouchesOnceTouchesBegan = true;
  this.layer.removeEventListener(ADStartEvent, this, false);
  this.touchLayer.addEventListener(ADStartEvent, this, false)
}

ADControl.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-control")
};
ADControl.prototype.getState = function(){
  return (ADControlStateNormal | (this._highlighted ? ADControlStateHighlighted : 0) | (this._enabled ? 0 : ADControlStateDisabled) | (this._selected ? ADControlStateSelected : 0))
};
ADControl.prototype.setEnabled = function(a){
  if (a == this._enabled) {
    return
  }
  this.layer[a ? "removeClassName" : "addClassName"](ADControlStateDisabledCSS);
  this._enabled = a;
  this.tracksTouchesOnceTouchesBegan = a;
  this.notifyPropertyChange("state")
};
ADControl.prototype.setSelected = function(a){
  if (a == this._selected) {
    return
  }
  this.layer[a ? "addClassName" : "removeClassName"](ADControlStateSelectedCSS);
  this._selected = a;
  this.notifyPropertyChange("state")
};
ADControl.prototype.setHighlighted = function(a){
  if (a == this._highlighted) {
    return
  }
  this.layer[a ? "addClassName" : "removeClassName"](ADControlStateHighlightedCSS);
  this._highlighted = a;
  this.notifyPropertyChange("state")
};
ADControl.prototype.getTouchLayer = function(){
  return (this._touchLayer != null) ? this._touchLayer : this.layer
};
ADControl.prototype.touchesBegan = function(a){
  this.callSuper(a);
  if (!this._enabled) {
    return
  }
  a.stopPropagation();
  a.preventDefault();
  this.touchInside = true;
  this.highlighted = true;
  this.dispatchEvent(this.createUIEvent(ADControlTouchDownEvent, a));
  this.dispatchEvent(this.createEvent(ADControlTouchStateChangeEvent));
  this.lastProcessedEvent = a
};
ADControl.prototype.touchesMoved = function(b){
  this.callSuper(b);
  this.tracking = true;
  var a = this.pointInside(ADPoint.fromEventInElement(b, this.layer));
  var c = a ? ADControlTouchDragInsideEvent : ADControlTouchDragOutsideEvent;
  if (a != this.touchInside) {
    this.touchInside = a;
    this.highlighted = a;
    c = a ? ADControlTouchDragEnterEvent : ADControlTouchDragExitEvent;
    this.dispatchEvent(this.createEvent(ADControlTouchStateChangeEvent))
  }
  this.dispatchEvent(this.createUIEvent(c, b));
  this.lastProcessedEvent = b
};
ADControl.prototype.touchesEnded = function(b){
  this.callSuper(b);
  this.tracking = false;
  this.highlighted = false;
  var a = this.touchInside ? ADControlTouchUpInsideEvent : ADControlTouchUpOutsideEvent;
  this.dispatchEvent(this.createUIEvent(a, this.lastProcessedEvent));
  this.touchInside = false;
  this.dispatchEvent(this.createEvent(ADControlTouchStateChangeEvent))
};
ADControl.prototype.touchesCancelled = function(a){
  this.callSuper(a);
  this.dispatchEvent(this.createUIEvent(ADControlTouchCancelEvent, a))
};
ADControl.prototype.createEvent = function(a){
  var b = document.createEvent("Event");
  b.initEvent(a, true, false);
  b.control = this;
  return b
};
ADControl.prototype.createUIEvent = function(b, c){
  var a = ADUtils.createUIEvent(b, c);
  a.control = this;
  return a
};
ADClass(ADControl);
const ADBarItemDisabledCSS = "disabled";
ADBarItem.inherits = ADObject;
ADBarItem.synthetizes = ["enabled", "image", "imageOffset", "title"];
function ADBarItem(){
  this.callSuper();
  this._enabled = true;
  this._image = null;
  this._imageOffset = null;
  this._title = "";
  this.tag = 0;
  this.view = null
}

ADClass(ADBarItem);
const ADBarButtonHeight = 30;
const ADBarButtonPointyXOffset = 3;
ADBarButton.inherits = ADControl;
ADBarButton.synthetizes = ["maxWidth", "width", "type", "style", "image", "imageOffset", "title"];
function ADBarButton(a){
  this.callSuper();
  this._maxWidth = 0;
  this._width = 0;
  this._type = "";
  this._style = "";
  this._image = null;
  this._imageOffset = null;
  this._title = "";
  this.type = (a != null) ? a : ADBarButtonItemTypeSquare;
  this.style = ADBarButtonItemStyleDefault;
  this.usesAutomaticImageOffset = true
}

ADBarButton.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-bar-button");
  this.layer.setAttribute("role", "button");
  this.background = this.layer.appendChild(document.createElement("div"));
  this.icon = this.layer.appendChild(document.createElement("img"))
};
ADBarButton.prototype.layerWasInsertedIntoDocument = function(){
  this.callSuper();
  if (this._title != "" && this._width == 0) {
    this.autoSizeTitle()
  }
};
ADBarButton.prototype.getSize = function(){
  var a = (this._maxWidth == 0) ? this._size.width : Math.min(this._maxWidth, this._size.width);
  return new ADSize(a, this._size.height)
};
ADBarButton.prototype.setSize = function(a){
  a.height = ADBarButtonHeight;
  this.callSuper(a)
};
ADBarButton.prototype.touchesBegan = function(a){
  if (this.type == ADBarButtonItemTypeFlexibleSpace || this.type == ADBarButtonItemTypeFixedSpace) {
    a.preventDefault();
    return
  }
  this.callSuper(a)
};
ADBarButton.prototype.setMaxWidth = function(a){
  this.background.style.maxWidth = (a == 0) ? "inherit" : ADUtils.px(a);
  this._maxWidth = a;
  if (this._width == 0) {
    this.autoSizeTitle()
  }
};
ADBarButton.prototype.setWidth = function(a){
  if (a == 0) {
    this.autoSizeTitle();
    this.autoSizeImage();
    this.positionImage()
  }
  else {
    this._width = a;
    this.size = new ADSize(a, ADBarButtonHeight);
    this.positionImage()
  }
};
ADBarButton.prototype.autoSizeTitle = function(){
  if (this._title != "" && this.layerIsInDocument) {
    this.layer.style.width = "auto";
    var a = parseInt(window.getComputedStyle(this.layer).width);
    this.size = new ADSize(a, this._size.height)
  }
};
ADBarButton.prototype.autoSizeImage = function(){
  if (this._image !== null) {
    var b = this.getBorderXOffsets();
    var a = this._image.width + b.left + b.right;
    this.size = new ADSize(a, this._size.height)
  }
};
ADBarButton.prototype.setTitle = function(a){
  this.background.innerText = a;
  this._title = a;
  if (this._width == 0) {
    this.autoSizeTitle()
  }
};
ADBarButton.prototype.setImage = function(a){
  this.icon.src = a.url;
  this._image = a;
  if (a.loaded) {
    this.positionImage()
  }
  else {
    a.addPropertyObserver("loaded", this)
  }
};
ADBarButton.prototype.getImageOffset = function(){
  return new ADPoint(parseInt(this.icon.style.left), parseInt(this.icon.style.top))
};
ADBarButton.prototype.setImageOffset = function(a){
  this.icon.style.left = ADUtils.px(a.x);
  this.icon.style.top = ADUtils.px(a.y);
  this.usesAutomaticImageOffset = false
};
ADBarButton.prototype.positionImage = function(){
  if (this._image === null || !this.usesAutomaticImageOffset) {
    return
  }
  var a = Math.min(this._image.height, this.size.height);
  this.icon.height = a;
  var b = new ADPoint((this._size.width - this.icon.width) / 2, (ADBarButtonHeight - this.icon.height) / 2);
  if (this._type == ADBarButtonItemTypeBack) {
    b.x += ADBarButtonPointyXOffset
  }
  if (this._type == ADBarButtonItemTypeForward) {
    b.x -= ADBarButtonPointyXOffset
  }
  this.imageOffset = b;
  this.usesAutomaticImageOffset = true
};
ADBarButton.prototype.setType = function(a){
  this.layer.removeClassName(this._type);
  this.layer.addClassName(a);
  this._type = a
};
ADBarButton.prototype.setStyle = function(a){
  this.layer.removeClassName(this._style);
  this.layer.addClassName(a);
  this._style = a
};
ADBarButton.prototype.getBorderXOffsets = function(){
  var b = window.getComputedStyle(this.background);
  var c = b.getPropertyCSSValue("border-left-width");
  var a = b.getPropertyCSSValue("border-right-width");
  return {
    left: (c !== null) ? c.getFloatValue(CSSPrimitiveValue.CSS_PX) : 0,
    right: (a !== null) ? a.getFloatValue(CSSPrimitiveValue.CSS_PX) : 0
  }
};
ADBarButton.prototype.handlePropertyChange = function(b, a){
  if (this._width == 0) {
    this.autoSizeImage()
  }
  this.positionImage()
};
ADBarButton.prototype.dispatchEvent = function(a){
  a.barButtonItem = this.barButtonItem;
  this.callSuper(a)
};
ADClass(ADBarButton);
ADBarButton.init = function(){
  var a = ["UINavigationBarDoneButtonPressed", "UINavigationBarDoneButton", "UINavigationBarDefaultForwardPressed", "UINavigationBarDefaultForward", "UINavigationBarDefaultButtonPressed", "UINavigationBarDefaultButton", "UINavigationBarDefaultBackPressed", "UINavigationBarDefaultBack", "UINavigationBarBlackTranslucentForward", "UINavigationBarBlackTranslucentButton", "UINavigationBarBlackTranslucentBack", "UINavigationBarBlackOpaqueForward", "UINavigationBarBlackOpaqueButton", "UINavigationBarBlackOpaqueBack", "UINavigationBarBlackForwardPressed", "UINavigationBarBlackButtonPressed", "UINavigationBarBlackBackPressed"];
  for (var b = 0; b < a.length; b++) {
    ADUtils.preloadImageAsset("button/" + a[b] + ".png")
  }
};
window.addEventListener("load", ADBarButton.init, false);
const ADBarButtonItemTypePlain = "plain";
const ADBarButtonItemTypeSquare = "square";
const ADBarButtonItemTypeBack = "back";
const ADBarButtonItemTypeForward = "forward";
const ADBarButtonItemTypeFlexibleSpace = "flexible-space";
const ADBarButtonItemTypeFixedSpace = "fixed-space";
const ADBarButtonItemStyleBlack = "black";
const ADBarButtonItemStyleDefault = "default";
const ADBarButtonItemStyleLightBlue = "lightblue";
ADBarButtonItem.inherits = ADBarItem;
ADBarButtonItem.includes = [ADEventTarget];
ADBarButtonItem.synthetizes = ["maxWidth", "customView", "width", "type", "style"];
function ADBarButtonItem(a){
  this.callSuper();
  this.view = new ADBarButton(a);
  this.view.isCustomView = false;
  this.view.barButtonItem = this;
  this.eventTarget = this.view
}

ADBarButtonItem.prototype.getEnabled = function(){
  return (!this.view.isCustomView) ? this.view.enabled : this.view.userInteractionEnabled
};
ADBarButtonItem.prototype.setEnabled = function(a){
  if (this.view.isCustomView) {
    this.view.userInteractionEnabled = a
  }
  else {
    this.view.enabled = a
  }
};
ADBarButtonItem.prototype.getMaxWidth = function(){
  return (!this.view.isCustomView) ? this.view.maxWidth : 0
};
ADBarButtonItem.prototype.setMaxWidth = function(a){
  if (!this.view.isCustomView) {
    this.view.maxWidth = a
  }
};
ADBarButtonItem.prototype.getWidth = function(){
  return (!this.view.isCustomView) ? this.view.width : this.view.size.width
};
ADBarButtonItem.prototype.setWidth = function(a){
  if (this.view.isCustomView) {
    this.view.size = new ADSize(a, this.view.size.height)
  }
  else {
    this.view.width = a
  }
};
ADBarButtonItem.prototype.getTitle = function(){
  return (!this.view.isCustomView) ? this.view.title : ""
};
ADBarButtonItem.prototype.setTitle = function(a){
  if (!this.view.isCustomView) {
    this.view.title = a
  }
};
ADBarButtonItem.prototype.getImage = function(){
  return (!this.view.isCustomView) ? this.view.image : null
};
ADBarButtonItem.prototype.setImage = function(a){
  if (!this.view.isCustomView) {
    this.view.image = a
  }
};
ADBarButtonItem.prototype.getImageOffset = function(){
  return (!this.view.isCustomView) ? this.view.imageOffset : null
};
ADBarButtonItem.prototype.setImageOffset = function(a){
  if (!this.view.isCustomView) {
    this.view.imageOffset = a
  }
};
ADBarButtonItem.prototype.getType = function(){
  return (!this.view.isCustomView) ? this.view.type : ""
};
ADBarButtonItem.prototype.setType = function(a){
  if (!this.view.isCustomView) {
    this.view.type = a
  }
};
ADBarButtonItem.prototype.getStyle = function(a){
  return (!this.view.isCustomView) ? this.view.style : ""
};
ADBarButtonItem.prototype.setStyle = function(a){
  if (!this.view.isCustomView) {
    this.view.style = a
  }
};
ADBarButtonItem.prototype.getCustomView = function(){
  return (this.view.isCustomView) ? this.view : null
};
ADBarButtonItem.prototype.setCustomView = function(a){
  if (a === this.view) {
    return
  }
  if (!this.view.isCustomView) {
    this.view = undefined
  }
  a.isCustomView = true;
  a.barButtonItem = this;
  this.view = a
};
ADClass(ADBarButtonItem);
const ADSliderThumbWidth = 23;
const ADSliderHeight = 23;
const ADSliderTouchedCSS = "touched";
ADSlider.inherits = ADControl;
ADSlider.synthetizes = ["minimumValue", "maximumValue", "value"];
function ADSlider(){
  this.continuous = true;
  this._minimumValue = 0;
  this._maximumValue = 1;
  this._value = 0;
  this.callSuper()
}

ADSlider.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-slider");
  this.fill = this.layer.appendChild(document.createElement("div"));
  this.fill.className = "ad-slider-fill";
  this.leftFill = this.fill.appendChild(document.createElement("div"));
  this.middleFill = this.fill.appendChild(document.createElement("div"));
  this.rightFill = this.fill.appendChild(document.createElement("div"));
  this.thumb = this.layer.appendChild(document.createElement("div"));
  this.thumb.className = "ad-slider-thumb";
  this.touchLayer = this.thumb
};
ADSlider.prototype.setSize = function(a){
  a.height = ADSliderHeight;
  this.callSuper(a)
};
ADSlider.prototype.setMinimumValue = function(a){
  if (a >= this.maximumValue) {
    return
  }
  this._minimumValue = a;
  if (this.value < a) {
    this.value = a
  }
  else {
    this.updateThumb()
  }
};
ADSlider.prototype.setMaximumValue = function(a){
  if (a <= this.minimumValue) {
    return
  }
  this._maximumValue = a;
  if (this.value > a) {
    this.value = a
  }
  else {
    this.updateThumb()
  }
};
ADSlider.prototype.setValue = function(a){
  this.setValueWithAnimation(a, false)
};
ADSlider.prototype.setValueWithAnimation = function(b, a){
  b = Math.max(Math.min(b, this.maximumValue), this.minimumValue);
  if (b == this._value) {
    return
  }
  var c = a ? "0.25s" : "0s";
  this.thumb.style.webkitTransitionDuration = c;
  this.middleFill.style.webkitTransitionDuration = c;
  this.rightFill.style.webkitTransitionDuration = c;
  this._value = b;
  this.updateThumb();
  if (this.continuous) {
    this.notifyValueChanged()
  }
};
ADSlider.prototype.updateThumb = function(a){
  var b = (this.value - this.minimumValue) / (this.maximumValue - this.minimumValue);
  var a = b * (this.size.width + 2 - ADSliderThumbWidth);
  this.updateGutterWithOffset(b);
  this.thumb.style.webkitTransform = ADUtils.t(a, 0)
};
ADSlider.prototype.updateGutterWithOffset = function(b){
  var a = b * (this.size.width - 16);
  this.middleFill.style.webkitTransform = "scale(" + (a + 1) + ", 1)";
  this.rightFill.style.webkitTransform = ADUtils.t(a, 0)
};
ADSlider.prototype.notifyValueChanged = function(){
  this.dispatchEvent(this.createEvent(ADControlValueChangeEvent))
};
ADSlider.prototype.touchesBegan = function(a){
  this.callSuper(a);
  this.maxX = this.size.width - ADSliderThumbWidth;
  this.internalX = ADPoint.fromEventInElement(a, this.touchLayer).x;
  this.startValue = this.value;
  this.valueRange = this.maximumValue - this.minimumValue;
  this.thumb.addClassName(ADSliderTouchedCSS)
};
ADSlider.prototype.touchesMoved = function(b){
  this.callSuper(b);
  var a = ADPoint.fromEventInElement(b, this.layer).x - this.internalX;
  this.value = this.minimumValue + (a / this.maxX) * this.valueRange
};
ADSlider.prototype.touchesEnded = function(a){
  this.callSuper(a);
  if (!this.continuous && this.startValue != this.value) {
    this.notifyValueChanged()
  }
  this.thumb.removeClassName(ADSliderTouchedCSS)
};
ADSlider.prototype.touchesCancelled = function(a){
  this.callSuper(a);
  this.setValue(this.startValue, true);
  this.thumb.removeClassName(ADSliderTouchedCSS)
};
ADClass(ADSlider);
ADSlider.init = function(){
  ADUtils.preloadImageAsset("slider/thumb_touched.png")
};
window.addEventListener("load", ADSlider.init, false);
const ADTabBarItemHeight = 44;
const ADTabBarItemCanvasHeight = 34;
ADTabBarItem.inherits = ADControl;
ADTabBarItem.synthetizes = ["title", "image", "badgeValue"];
function ADTabBarItem(c, b, a){
  this._title = "";
  this._image = "";
  this._badgeValue = 0;
  this.callSuper()
}

ADTabBarItem.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-tab-bar-item");
  this.canvas = this.layer.appendChild(document.createElement("canvas"));
  this.label = this.layer.appendChild(document.createElement("div"));
  this.badge = this.layer.appendChild(document.createElement("div"));
  this.badgeContent = this.badge.appendChild(document.createElement("span"));
  this.canvas.height = ADTabBarItemCanvasHeight
};
ADTabBarItem.prototype.setSize = function(a){
  this.callSuper(a);
  this.badgeContent.style.maxWidth = ADUtils.px(this.size.width - 12);
  this.updateBadgePosition();
  this.canvas.width = this.size.width;
  this.drawImage()
};
ADTabBarItem.prototype.didMoveToSuperview = function(){
  this.callSuper();
  var a = this;
  setTimeout(function(){
    a.updateBadgePosition()
  }, 0)
};
ADTabBarItem.prototype.setSelected = function(a){
  this.callSuper(a);
  this.drawImage()
};
ADTabBarItem.prototype.setTitle = function(a){
  this.label.textContent = a;
  this._title = a
};
ADTabBarItem.prototype.setImage = function(a){
  this._image = a;
  if (a.loaded) {
    this.drawImage()
  }
  else {
    a.addPropertyObserver("loaded", this)
  }
};
ADTabBarItem.prototype.setBadgeValue = function(a){
  this._badgeValue = a;
  if (a > 0) {
    this.badge.style.display = "block";
    this.badgeContent.textContent = a;
    this.updateBadgePosition()
  }
  else {
    this.badge.style.display = "none"
  }
};
ADTabBarItem.prototype.updateBadgePosition = function(){
  if (this.superview == null) {
    return
  }
  if (this.badge.offsetWidth < this.size.width / 2) {
    this.badge.style.left = ADUtils.px(Math.round(this.size.width / 2))
  }
  else {
    this.badge.style.right = ADUtils.px(-4)
  }
};
ADTabBarItem.prototype.drawImage = function(){
  if (this._image === null || !this._image.loaded) {
    return
  }
  var a = this.canvas.getContext("2d");
  a.clearRect(0, 0, this.size.width, this.size.height);
  var b = (ADTabBarItemCanvasHeight - this._image.height) / 2;
  a.globalCompositeOperation = "source-over";
  a.drawImage(this._image.element, (this.size.width - this._image.width) / 2, b);
  if (this.selected) {
    a.globalCompositeOperation = "source-in";
    a.drawImage(ADTabBarItem.prototype.maskImage.element, (this.size.width - ADTabBarItem.prototype.maskImage.width) / 2, b)
  }
};
ADTabBarItem.prototype.handlePropertyChange = function(b, a){
  this.drawImage()
};
ADClass(ADTabBarItem);
ADTabBarItem.init = function(){
  ADTabBarItem.prototype.maskImage = new ADImage(ADUtils.assetsPath + "bar/tab_bar_blue_gradient.png")
};
ADTabBarItem.initWithTitleImageAndTag = function(d, c, a){
  var b = new ADTabBarItem();
  b.title = d;
  b.image = c;
  b.tag = a;
  return b
};
window.addEventListener("load", ADTabBarItem.init, false);
const ADRatingControlStarWidth = 21;
const ADRatingControlStarHeight = 21;
const ADRatingControlMinValue = 0;
const ADRatingControlMaxValue = 5;
const ADRatingControlMinMargin = 10;
const ADRatingControlFilledCSS = "filled";
ADRatingControl.inherits = ADControl;
ADRatingControl.synthetizes = ["width", "value"];
function ADRatingControl(){
  this.margin = ADRatingControlMinMargin;
  this.numStars = ADRatingControlMaxValue - ADRatingControlMinValue;
  this.minWidth = this.numStars * ADRatingControlStarWidth + (this.numStars - 1) * ADRatingControlMinMargin;
  this.stars = [];
  this._value = 0;
  this.callSuper();
  this.size = new ADSize()
}

ADRatingControl.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-rating-control");
  for (var a = 0; a < this.numStars; a++) {
    this.stars.push(this.layer.appendChild(document.createElement("div")))
  }
};
ADRatingControl.prototype.setSize = function(a){
  a.width = Math.max(this.minWidth, a.width);
  a.height = ADRatingControlStarHeight;
  this.callSuper(a);
  this.margin = (this.size.width - (this.numStars * ADRatingControlStarWidth)) / (this.numStars - 1);
  for (var b = 0; b < this.numStars - 1; b++) {
    this.stars[b].style.marginRight = ADUtils.px(this.margin)
  }
};
ADRatingControl.prototype.getWidth = function(){
  return this.size.width
};
ADRatingControl.prototype.setWidth = function(a){
  this.size = new ADSize(a, 0)
};
ADRatingControl.prototype.setValue = function(b){
  b = Math.max(Math.min(b, ADRatingControlMaxValue), ADRatingControlMinValue);
  if (b == this._value) {
    return
  }
  this._value = b;
  for (var a = 0; a < this.numStars; a++) {
    this.stars[a].className = (a >= b - ADRatingControlMinValue) ? "" : ADRatingControlFilledCSS
  }
  this.dispatchEvent(this.createEvent(ADControlValueChangeEvent))
};
ADRatingControl.prototype.touchesBegan = function(a){
  this.callSuper(a);
  this.startX = ADPoint.fromEventInElement(a, this.layer).x;
  this.startValue = this.value
};
ADRatingControl.prototype.touchesMoved = function(a){
  this.callSuper(a);
  this.setValueFromX(ADPoint.fromEventInElement(a, this.layer).x)
};
ADRatingControl.prototype.touchesEnded = function(a){
  if (!this.tracking) {
    this.setValueFromX(this.startX)
  }
  this.callSuper(a)
};
ADRatingControl.prototype.touchesCancelled = function(a){
  this.callSuper(a);
  this.value = this.startValue
};
ADRatingControl.prototype.setValueFromX = function(a){
  this.value = Math.floor((a + ADRatingControlStarWidth + this.margin + this.margin / 2) / (ADRatingControlStarWidth + this.margin))
};
ADClass(ADRatingControl);
ADRatingControl.init = function(){
  ADUtils.preloadImageAsset("rating/star_empty.png");
  ADUtils.preloadImageAsset("rating/star_filled.png")
};
window.addEventListener("load", ADRatingControl.init, false);
const ADPageControlSize = 6;
const ADPageControlMargin = 10;
const ADPageControlSelectedCSS = "selected";
ADPageControl.inherits = ADControl;
ADPageControl.synthetizes = ["currentPage", "numberOfPages", "hidesForSinglePage"];
function ADPageControl(){
  this.dots = [];
  this.defersCurrentPageDisplay = false;
  this._currentPage = 0;
  this._numberOfPages = 0;
  this._hidesForSinglePage = false;
  this.callSuper();
  this.layer.addEventListener(ADControlTouchUpInsideEvent, this, false)
}

ADPageControl.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-page-control")
};
ADPageControl.prototype.setSize = function(a){
  a.width = Math.max(a.width, ADPageControlSize);
  a.height = Math.max(a.height, ADPageControlSize);
  this.callSuper(a);
  this.updateLayout()
};
ADPageControl.prototype.setCurrentPage = function(a){
  if (this._currentPage == a || a < 0 || a >= this.numberOfPages) {
    return
  }
  this._currentPage = a;
  if (!this.defersCurrentPageDisplay) {
    this.updateCurrentPageDisplay()
  }
  this.dispatchEvent(this.createEvent(ADControlValueChangeEvent))
};
ADPageControl.prototype.setNumberOfPages = function(a){
  if (this._numberOfPages == a || a < 0) {
    return
  }
  if (this.dots.length > a) {
    while (this.dots.length > a) {
      this.layer.removeChild(this.dots.pop())
    }
  }
  else {
    while (this.dots.length < a) {
      this.dots.push(this.layer.appendChild(document.createElement("div")))
    }
  }
  this._numberOfPages = a;
  this.updateCurrentPageDisplay();
  this.updateLayout();
  this.updateVisibility()
};
ADPageControl.prototype.setHidesForSinglePage = function(a){
  this._hidesForSinglePage = a;
  this.updateVisibility()
};
ADPageControl.prototype.updateCurrentPageDisplay = function(){
  var a = this.layer.querySelector("." + ADPageControlSelectedCSS);
  if (a) {
    a.removeClassName(ADPageControlSelectedCSS)
  }
  if (this.currentPage >= 0 && this.currentPage < this.dots.length) {
    this.dots[this.currentPage].addClassName(ADPageControlSelectedCSS)
  }
};
ADPageControl.prototype.sizeForNumberOfPages = function(a){
  return a * (ADPageControlSize + ADPageControlMargin) - ADPageControlMargin
};
ADPageControl.prototype.updateLayout = function(a){
  this.layer.style.paddingLeft = ADUtils.px((this.size.width - this.sizeForNumberOfPages(this._numberOfPages)) / 2);
  this.layer.style.paddingTop = ADUtils.px((this.size.height - ADPageControlSize) / 2)
};
ADPageControl.prototype.updateVisibility = function(){
  this.opacity = (this.numberOfPages == 1 && this.hidesForSinglePage) ? 0 : 1
};
ADPageControl.prototype.handleEvent = function(c){
  this.callSuper(c);
  if (c.type == ADControlTouchUpInsideEvent) {
    if (this.numberOfPages <= 1) {
      return
    }
    var b = ADPoint.fromEventInElement(c, this.layer).x;
    var a = this.dots[this.currentPage].offsetLeft;
    if (b <= a - ADPageControlMargin / 2) {
      this.currentPage--
    }
    else {
      if (b >= a + ADPageControlSize + ADPageControlMargin / 2) {
        this.currentPage++
      }
    }
  }
};
ADClass(ADPageControl);
const ADSegmentedControlNoSegment = -1;
const ADSegmentedControlStylePlain = "plain";
const ADSegmentedControlStyleBordered = "bordered";
const ADSegmentedControlStyleBar = "bar";
const ADSegmentedControlStyleBarBlack = "bar black";
const ADSegmentedControlSegmentSelectedCSS = "selected";
const ADSegmentedControlSegmentMomentarySelectionTimer = 200;
ADSegmentedControl.inherits = ADControl;
ADSegmentedControl.synthetizes = ["width", "style", "numberOfSegments", "selectedSegmentIndex", "momentary"];
function ADSegmentedControl(a){
  this.callSuper();
  this._width = 0;
  this._style = "";
  this._numberOfSegments = 0;
  this._selectedSegmentIndex = ADSegmentedControlNoSegment;
  this._momentary = false;
  this.style = ADSegmentedControlStylePlain;
  if (!ADUtils.objectIsUndefined(a) && ADUtils.objectIsArray(a)) {
    this.populateWithItems(a)
  }
}

ADSegmentedControl.prototype.populateWithItems = function(a){
  for (var b = 0; b < a.length; b++) {
    var c = a[b];
    if (c instanceof ADImage) {
      this.insertSegmentWithImageAtIndexWithAnimation(c, this.numberOfSegments, false)
    }
    else {
      if (ADUtils.objectIsString(c)) {
        this.insertSegmentWithTitleAtIndexWithAnimation(c, this.numberOfSegments, false)
      }
    }
  }
  this.updateLayout()
};
ADSegmentedControl.prototype.updateLayout = function(){
  if (this.size.width <= 0) {
    return
  }
  var g = 0;
  var b = 0;
  for (var c = 0; c < this.subviews.length; c++) {
    var f = this.subviews[c];
    if (f.width > 0) {
      g += f.width
    }
    else {
      b++
    }
  }
  var e = Math.round((b > 0) ? (this.size.width - g) / b : 0);
  var a = (this._style == ADSegmentedControlStyleBar || this._style == ADSegmentedControlStyleBarBlack) ? 6 : 10;
  var h = -a;
  for (var c = 0; c < this.subviews.length; c++) {
    var f = this.subviews[c];
    var d = (f.width == 0) ? e : f.width;
    f.layer.style.left = ADUtils.px(h);
    if (c == this.subviews.length - 1) {
      d = this.size.width - h - a
    }
    this.setActualWidthForSegmentAtIndex(d, c);
    h += d
  }
};
ADSegmentedControl.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-segmented-control")
};
ADSegmentedControl.prototype.setSize = function(a){
  a.height = (this._style == ADSegmentedControlStyleBar || this._style == ADSegmentedControlStyleBarBlack) ? 30 : 44;
  this.callSuper(a);
  this.updateLayout()
};
ADSegmentedControl.prototype.didAddSubview = function(a){
  this.updateLayout();
  if (this._selectedSegmentIndex != ADSegmentedControlNoSegment) {
    if (a._indexInSuperviewSubviews <= this._selectedSegmentIndex) {
      this.selectedSegmentIndex++
    }
  }
};
ADSegmentedControl.prototype.willMoveToSuperview = function(a){
  if (a instanceof ADToolbar) {
    this.style = (a.style === ADToolbarStyleDefault) ? ADSegmentedControlStyleBar : ADSegmentedControlStyleBarBlack
  }
};
ADSegmentedControl.prototype.getWidth = function(){
  return this.size.width
};
ADSegmentedControl.prototype.setWidth = function(a){
  this.size = new ADSize(a, 0)
};
ADSegmentedControl.prototype.setStyle = function(a){
  this.layer.removeClassName(this._style);
  this.layer.addClassName(a);
  this._style = a;
  this.width = this.width
};
ADSegmentedControl.prototype.getNumberOfSegments = function(){
  return this.subviews.length
};
ADSegmentedControl.prototype.setSelectedSegmentIndex = function(a){
  if (a < -1 || a >= this.subviews.length || a == this._selectedSegmentIndex) {
    return
  }
  if (this._selectedSegmentIndex != ADSegmentedControlNoSegment && this._selectedSegmentIndex >= 0 && this._selectedSegmentIndex < this.subviews.length) {
    this.subviews[this._selectedSegmentIndex].layer.removeClassName(ADSegmentedControlSegmentSelectedCSS)
  }
  if (a != ADSegmentedControlNoSegment) {
    this.subviews[a].layer.addClassName(ADSegmentedControlSegmentSelectedCSS)
  }
  this._selectedSegmentIndex = a;
  if (!this._momentary || a != ADSegmentedControlNoSegment) {
    this.dispatchEvent(this.createEvent(ADControlValueChangeEvent))
  }
};
ADSegmentedControl.prototype.setMomentary = function(a){
  if (this._momentary == a) {
    return
  }
  this._momentary = a;
  this.selectedSegmentIndex = ADSegmentedControlNoSegment
};
ADSegmentedControl.prototype.setImageForSegmentAtIndex = function(b, a){
  a = Math.max(Math.min(a, this.subviews.length - 1), 0);
  this.subviews[a].image = b
};
ADSegmentedControl.prototype.imageForSegmentAtIndex = function(a){
  a = Math.min(a, this.subviews.length - 1);
  return (a >= 0) ? this.subviews[a].image : null
};
ADSegmentedControl.prototype.setTitleForSegmentAtIndex = function(b, a){
  a = Math.max(Math.min(a, this.subviews.length - 1), 0);
  this.subviews[a].title = b
};
ADSegmentedControl.prototype.titleForSegmentAtIndex = function(a){
  a = Math.min(a, this.subviews.length - 1);
  return (a >= 0) ? this.subviews[a].title : null
};
ADSegmentedControl.prototype.insertSegmentWithImageAtIndexWithAnimation = function(d, a, c){
  a = Math.max(Math.min(a, this.subviews.length), 0);
  var b = new ADSegment();
  this.insertSubviewAtIndex(b, a);
  this.setImageForSegmentAtIndex(d, a)
};
ADSegmentedControl.prototype.insertSegmentWithTitleAtIndexWithAnimation = function(d, a, c){
  a = Math.max(Math.min(a, this.subviews.length), 0);
  var b = new ADSegment();
  this.insertSubviewAtIndex(b, a);
  this.setTitleForSegmentAtIndex(d, a)
};
ADSegmentedControl.prototype.removeSegmentAtIndexWithAnimation = function(a, b){
  a = Math.max(Math.min(a, this.subviews.length - 1), 0);
  this.subviews[a].removeFromSuperview();
  this.updateLayout();
  if (this._selectedSegmentIndex != ADSegmentedControlNoSegment) {
    if (a < this._selectedSegmentIndex) {
      this.selectedSegmentIndex--
    }
    else {
      if (a == this._selectedSegmentIndex) {
        this.selectedSegmentIndex = ADSegmentedControlNoSegment
      }
    }
  }
};
ADSegmentedControl.prototype.removeAllSegments = function(){
  while (this.subviews.length) {
    this.subviews[0].removeFromSuperview()
  }
};
ADSegmentedControl.prototype.setWidthForSegmentAtIndex = function(b, a){
  a = Math.max(Math.min(a, this.subviews.length - 1), 0);
  this.subviews[a].width = b;
  this.setActualWidthForSegmentAtIndex(b, a);
  this.updateLayout()
};
ADSegmentedControl.prototype.widthForSegmentAtIndex = function(a){
  a = Math.max(Math.min(a, this.subviews.length - 1), 0);
  return this.subviews[a].width
};
ADSegmentedControl.prototype.setActualWidthForSegmentAtIndex = function(b, a){
  a = Math.max(Math.min(a, this.subviews.length - 1), 0);
  this.subviews[a].size = new ADSize(b, this.size.height)
};
ADSegmentedControl.prototype.touchesBegan = function(a){
  this.callSuper(a);
  this.selectedSegmentIndex = a.target.getNearestView()._indexInSuperviewSubviews;
  if (this._momentary) {
    var b = this;
    setTimeout(function(){
      b.selectedSegmentIndex = ADSegmentedControlNoSegment
    }, ADSegmentedControlSegmentMomentarySelectionTimer)
  }
};
ADClass(ADSegmentedControl);
ADSegmentedControl.init = function(){
  ADUtils.preloadImageAsset("segments/bar/button_highlighted_fill.png");
  ADUtils.preloadImageAsset("segments/bar/button_highlighted_left_cap.png");
  ADUtils.preloadImageAsset("segments/bar/button_highlighted_right_cap.png");
  ADUtils.preloadImageAsset("segments/bar/button.png");
  ADUtils.preloadImageAsset("segments/bar/divider_highlighted.png");
  ADUtils.preloadImageAsset("segments/bar/divider.png");
  ADUtils.preloadImageAsset("segments/plain/button_highlighted_fill.png");
  ADUtils.preloadImageAsset("segments/plain/button_highlighted_left_cap.png");
  ADUtils.preloadImageAsset("segments/plain/button_highlighted_right_cap.png");
  ADUtils.preloadImageAsset("segments/plain/button.png");
  ADUtils.preloadImageAsset("segments/plain/divider_hilighted_left.png");
  ADUtils.preloadImageAsset("segments/plain/divider_hilighted_right.png");
  ADUtils.preloadImageAsset("segments/plain/divider.png");
  ADUtils.preloadImageAsset("segments/bordered/button_highlighted_fill.png");
  ADUtils.preloadImageAsset("segments/bordered/button_highlighted_left_cap.png");
  ADUtils.preloadImageAsset("segments/bordered/button_highlighted_right_cap.png");
  ADUtils.preloadImageAsset("segments/bordered/button.png");
  ADUtils.preloadImageAsset("segments/bordered/divider_hilighted_left.png");
  ADUtils.preloadImageAsset("segments/bordered/divider_hilighted_right.png");
  ADUtils.preloadImageAsset("segments/bordered/divider.png")
};
window.addEventListener("load", ADSegmentedControl.init, false);
ADSegment.inherits = ADView;
ADSegment.synthetizes = ["title", "image"];
function ADSegment(a){
  this.callSuper();
  this.width = 0;
  this._title = null;
  this._image = null
}

ADSegment.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-segment");
  this.layer.appendChild(document.createElement("div"));
  this.layer.appendChild(document.createElement("div"));
  this.label = this.layer.appendChild(document.createElement("span"));
  this.icon = this.layer.appendChild(document.createElement("img"))
};
ADSegment.prototype.setSize = function(a){
  this.callSuper(a);
  if (this._image !== null) {
    this.positionImage()
  }
};
ADSegment.prototype.setTitle = function(a){
  this.label.textContent = a;
  this._title = a
};
ADSegment.prototype.setImage = function(a){
  this.icon.src = a.url;
  this._image = a;
  if (a.loaded) {
    this.positionImage()
  }
  else {
    a.addPropertyObserver("loaded", this)
  }
};
ADSegment.prototype.handlePropertyChange = function(b, a){
  this.positionImage()
};
ADSegment.prototype.positionImage = function(){
  this.icon.style.left = ADUtils.px((this.size.width - this._image.width) / 2);
  this.icon.style.top = ADUtils.px((this.size.height - this._image.height) / 2)
};
ADClass(ADSegment);
const ADSwitchOffLabel = "OFF";
const ADSwitchOnLabel = "ON";
const ADSwitchOffCSS = "off";
const ADSwitchOnCSS = "on";
const ADSwitchDownCSS = "dragging";
const ADSwitchSnapCSS = "snap";
const ADSwitchWidth = 93;
const ADSwitchHeight = 27;
const ADSwitchDragIdle = 0;
const ADSwitchCanDrag = 1;
const ADSwitchIsDragging = 2;
const ADSwitchSlideDistance = 54;
const ADSwitchButtonWidth = 40;
const ADSwitchDragMax = 70;
const ADSwitchDragMin = 16;
const ADSwitchDragGutter = 5;
const ADSwitchCapWidth = 4;
const ADSwitchLeftCapTrackCSS = "left-cap track-cap";
const ADSwitchLeftCapButtonCSS = "left-cap button-cap";
const ADSwitchRightCapTrackCSS = "right-cap track-cap";
const ADSwitchRightCapButtonCSS = "right-cap button-cap";
ADSwitch.inherits = ADControl;
ADSwitch.synthetizes = ["on"];
function ADSwitch(){
  this.callSuper();
  this.dragOffsetX = ADSwitchDragMax;
  this.size = new ADSize();
  this.on = false
}

ADSwitch.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-switch");
  this.leftCap = this.layer.appendChild(document.createElement("div"));
  this.leftCap.className = ADSwitchLeftCapTrackCSS;
  this.rightCap = this.layer.appendChild(document.createElement("div"));
  this.rightCap.className = ADSwitchRightCapButtonCSS;
  this.slideContainer = this.layer.appendChild(document.createElement("div"));
  this.slideContainer.className = "slide-container";
  this.slider = this.slideContainer.appendChild(document.createElement("div"));
  this.slider.className = "slider";
  this.slider.addEventListener("webkitTransitionEnd", this, false);
  this.button = this.slider.appendChild(document.createElement("div"));
  this.button.className = "button";
  var a = this.slider.appendChild(document.createElement("div"));
  a.textContent = ADSwitchOffLabel;
  a.className = "label-off";
  var b = this.slider.appendChild(document.createElement("div"));
  b.textContent = ADSwitchOnLabel;
  b.className = "label-on"
};
ADSwitch.prototype.setSize = function(a){
  a.width = ADSwitchWidth;
  a.height = ADSwitchHeight;
  this.callSuper(a)
};
ADSwitch.prototype.setOnWithAnimation = function(a, b){
  if (b) {
    if (!((a && this.dragOffsetX == ADSwitchDragMax) || (!a && this.dragOffsetX == ADSwitchDragMin))) {
      this.leftCap.className = ADSwitchLeftCapTrackCSS;
      this.rightCap.className = ADSwitchRightCapTrackCSS
    }
    this.slider.addClassName(ADSwitchSnapCSS)
  }
  else {
    if (a) {
      this.leftCap.className = ADSwitchLeftCapTrackCSS;
      this.rightCap.className = ADSwitchRightCapButtonCSS
    }
    else {
      this.leftCap.className = ADSwitchLeftCapButtonCSS;
      this.rightCap.className = ADSwitchRightCapTrackCSS
    }
    this.slider.removeClassName(ADSwitchSnapCSS)
  }
  if (a) {
    this.slider.style.webkitTransform = ADUtils.t(-ADSwitchCapWidth, 0);
    this.dragOffsetX = ADSwitchDragMax
  }
  else {
    this.slider.style.webkitTransform = ADUtils.t(-ADSwitchSlideDistance - ADSwitchCapWidth, 0);
    this.dragOffsetX = ADSwitchDragMin
  }
  this._on = a;
  this.dispatchEvent(this.createEvent(ADControlValueChangeEvent))
};
ADSwitch.prototype.setOn = function(a){
  this.setOnWithAnimation(a, false)
};
ADSwitch.prototype.handleEvent = function(a){
  this.callSuper(a);
  if (a.type == "webkitTransitionEnd") {
    this.transitionEnded()
  }
};
ADSwitch.prototype.transitionEnded = function(){
  this.slider.removeClassName(ADSwitchSnapCSS);
  if (this._on) {
    this.slider.style.webkitTransform = ADUtils.t(-ADSwitchCapWidth, 0);
    this.rightCap.className = ADSwitchRightCapButtonCSS
  }
  else {
    this.slider.style.webkitTransform = ADUtils.t(-ADSwitchSlideDistance - ADSwitchCapWidth, 0);
    this.leftCap.className = ADSwitchLeftCapButtonCSS
  }
};
ADSwitch.prototype.touchesBegan = function(b){
  this.callSuper(b);
  var a = ADPoint.fromEventInElement(b, this.layer);
  if ((!this._on && a.x < ADSwitchButtonWidth) || (this.on && a.x > ADSwitchSlideDistance)) {
    this.layer.addClassName(ADSwitchDownCSS);
    this.dragState = ADSwitchCanDrag
  }
};
ADSwitch.prototype.touchesMoved = function(c){
  this.callSuper(c);
  if (this.dragState >= ADSwitchCanDrag) {
    this.slider.removeClassName(ADSwitchSnapCSS);
    this.dragState = ADSwitchIsDragging;
    this.rightCap.className = ADSwitchRightCapTrackCSS;
    this.leftCap.className = ADSwitchLeftCapTrackCSS;
    var b = ADPoint.fromEventInElement(c, this.layer);
    var a = ADSwitchButtonWidth / 2;
    var d = ADSwitchWidth - a;
    this.dragOffsetX = b.x;
    if (this.dragOffsetX > ADSwitchDragMax - ADSwitchDragGutter) {
      if (this.dragOffsetX >= ADSwitchDragMax) {
        this.dragOffsetX = ADSwitchDragMax;
        this.rightCap.className = ADSwitchRightCapButtonCSS
      }
      else {
        this.dragOffsetX = ADSwitchDragMax - ADSwitchDragGutter
      }
    }
    else {
      if (this.dragOffsetX < ADSwitchDragMin + ADSwitchDragGutter) {
        if (this.dragOffsetX < ADSwitchDragMin) {
          this.dragOffsetX = ADSwitchDragMin;
          this.leftCap.className = ADSwitchLeftCapButtonCSS
        }
        else {
          this.dragOffsetX = ADSwitchDragMin + ADSwitchDragGutter
        }
      }
    }
    this.slider.style.webkitTransform = ADUtils.t(-ADSwitchSlideDistance - (a - this.dragOffsetX), 0)
  }
};
ADSwitch.prototype.touchesEnded = function(a){
  this.callSuper(a);
  if (this.dragState === ADSwitchIsDragging) {
    if (this.dragOffsetX < (ADSwitchWidth / 2)) {
      this.setOnWithAnimation(false, true)
    }
    else {
      if (this.dragOffsetX > (ADSwitchWidth / 2)) {
        this.setOnWithAnimation(true, true)
      }
      else {
        this.setOnWithAnimation(this.on, true)
      }
    }
  }
  else {
    this.setOnWithAnimation(!this._on, true)
  }
  this.layer.removeClassName(ADSwitchDownCSS);
  this.dragState = ADSwitchDragIdle
};
ADClass(ADSwitch);
ADSwitch.init = function(){
  ADUtils.preloadImageAsset("switch/background_precomposed.png");
  ADUtils.preloadImageAsset("switch/button_precomposed.png");
  ADUtils.preloadImageAsset("switch/left_cap_button.png");
  ADUtils.preloadImageAsset("switch/left_cap_track.png");
  ADUtils.preloadImageAsset("switch/right_cap_button.png");
  ADUtils.preloadImageAsset("switch/right_cap_track.png");
  ADUtils.preloadImageAsset("switch/right_cap_button_down.png");
  ADUtils.preloadImageAsset("switch/left_cap_button_down.png")
};
window.addEventListener("load", ADSwitch.init, false);
const ADSearchBarHeight = 44;
const ADSearchBarStyleDefault = "default";
const ADSearchBarStyleBlack = "black";
const ADSearchBarStyleBlackTranslucent = "black-translucent";
const ADSearchBarTextDidChange = "searchBarTextDidChange";
const ADSearchBarTextDidBeginEditing = "searchBarTextDidBeginEditing";
const ADSearchBarTextDidEndEditing = "searchBarTextDidEndEditing";
const ADSearchBarCancelButtonClicked = "searchBarCancelButtonClicked";
const ADSearchBarShowsCancelButtonCSS = "shows-cancel-button";
const ADSearchBarDisplaysPlaceholder = "displays-placeholder";
ADSearchBar.inherits = ADView;
ADSearchBar.includes = [ADEventTriage];
ADSearchBar.synthetizes = ["style", "placeholder", "text", "showsCancelButton", "editing"];
function ADSearchBar(){
  this.delegate = null;
  this._style = ADSearchBarStyleDefault;
  this._placeholder = "";
  this._text = "";
  this._showsCancelButton = false;
  this._editing = false;
  this.hasBeenExplicitelySized = false;
  this.callSuper();
  this.field.addEventListener("focus", this, false);
  this.field.addEventListener("blur", this, false);
  this.field.addEventListener("input", this, false);
  this.field.parentNode.addEventListener("submit", this, false);
  this.button.addEventListener(ADControlTouchUpInsideEvent, this, false);
  this.emptyButton.addEventListener(ADControlTouchUpInsideEvent, this, false);
  this.button.addPropertyObserver("size", this, "updateLayout");
  this.autoresizesSubviews = false
}

ADSearchBar.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-search-bar");
  var a = this.layer.appendChild(document.createElement("form"));
  this.label = a.appendChild(document.createElement("div"));
  this.field = a.appendChild(document.createElement("input"));
  this.field.type = "text";
  this.button = new ADBarButtonItem();
  this.button.title = "Cancel";
  this.button.view.addPropertyObserver("size", this, "updateLayout");
  this.addSubview(this.button.view);
  this.emptyButton = this.addSubview(new ADButton(ADButtonTypeCustom))
};
ADSearchBar.prototype.setSize = function(a){
  a.height = ADSearchBarHeight;
  this.callSuper(a);
  this.hasBeenExplicitelySized = true;
  this.updateLayout()
};
ADSearchBar.prototype.updateLayout = function(){
  if (!this.layerIsInDocument) {
    return
  }
  var a = this.showsCancelButton ? (this.button.view.size.width + 5) : 0;
  this.field.parentNode.style.right = ADUtils.px(a + 5);
  this.emptyButton.layer.style.right = ADUtils.px(a + 10)
};
ADSearchBar.prototype.didMoveToSuperview = function(){
  this.callSuper();
  if (this.hasBeenExplicitelySized || this.superview === null) {
    return
  }
  this.size = new ADSize(this.superview.size.width, ADSearchBarHeight);
  this.hasBeenExplicitelySized = false
};
ADSearchBar.prototype.setStyle = function(a){
  this.layer.removeClassName(this._style);
  this.layer.addClassName(a);
  this._style = a
};
ADSearchBar.prototype.setPlaceholder = function(a){
  this._placeholder = a;
  this.checkForPlaceholderDisplay()
};
ADSearchBar.prototype.getText = function(a){
  return this.field.value
};
ADSearchBar.prototype.setText = function(a){
  this.label.innerText = a;
  this.field.value = a;
  if (ADUtils.objectHasMethod(this.delegate, ADSearchBarTextDidChange)) {
    this.delegate[ADSearchBarTextDidChange](this, a)
  }
  this.checkForPlaceholderDisplay()
};
ADSearchBar.prototype.setShowsCancelButton = function(a){
  if (this._showsCancelButton == a) {
    return
  }
  this.layer[a ? "addClassName" : "removeClassName"](ADSearchBarShowsCancelButtonCSS);
  this._showsCancelButton = a;
  this.updateLayout()
};
ADSearchBar.prototype.checkForPlaceholderDisplay = function(){
  this.layer[this.text == "" ? "addClassName" : "removeClassName"](ADSearchBarDisplaysPlaceholder);
  if (this.text == "") {
    this.label.innerText = this._placeholder
  }
};
ADSearchBar.prototype.setEditing = function(a){
  this._editing = a;
  this.field[a ? "focus" : "blur"]()
};
ADSearchBar.prototype.handleFocus = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADSearchBarTextDidBeginEditing)) {
    this.delegate[ADSearchBarTextDidBeginEditing](this)
  }
  this.editing = true
};
ADSearchBar.prototype.handleBlur = function(a){
  if (ADUtils.objectHasMethod(this.delegate, ADSearchBarTextDidEndEditing)) {
    this.delegate[ADSearchBarTextDidEndEditing](this)
  }
  this.label.innerText = this.field.value;
  this.checkForPlaceholderDisplay();
  this.editing = false
};
ADSearchBar.prototype.handleInput = function(a){
  this.checkForPlaceholderDisplay();
  if (ADUtils.objectHasMethod(this.delegate, ADSearchBarTextDidChange)) {
    this.delegate[ADSearchBarTextDidChange](this, this.field.value)
  }
};
ADSearchBar.prototype.handleSubmit = function(a){
  a.preventDefault();
  this.editing = false
};
ADSearchBar.prototype.handleControlTouchUpInside = function(a){
  if (a.control === this.emptyButton) {
    this.text = "";
    this.checkForPlaceholderDisplay()
  }
  else {
    if (ADUtils.objectHasMethod(this.delegate, ADSearchBarCancelButtonClicked)) {
      this.delegate[ADSearchBarCancelButtonClicked](this)
    }
  }
};
ADClass(ADSearchBar);
ADSearchBar.init = function(){
  ADUtils.preloadImageAsset("search/background_default.png");
  ADUtils.preloadImageAsset("search/cancel_touched.png")
};
window.addEventListener("load", ADSearchBar.init, false);
ADPickerComponent.inherits = ADScrollView;
function ADPickerComponent(a, b){
  this.callSuper();
  this.delegate = this;
  this.index = a;
  this.rows = b;
  this.clipsToBounds = false;
  this.horizontalScrollEnabled = false;
  this.showsVerticalScrollIndicator = false
}

ADPickerComponent.prototype.getSelectedRow = function(){
  var a = (this.contentOffset.y + ADPickerViewComponentTopMargin - (ADPickerViewDefaultRowHeight * 2.25)) / ADPickerViewDefaultRowHeight;
  this._selectedRow = Math.min(Math.max(Math.round(a), 0), this.rows - 1);
  return this._selectedRow
};
ADPickerComponent.prototype.beginTracking = function(a){
  this.callSuper(a);
  var b = Math.floor((ADPoint.fromEventInElement(a, this.hostingLayer).y - ADPickerViewComponentTopMargin) / ADPickerViewDefaultRowHeight);
  this.touchedRow = (b >= 0 && b <= this.rows - 1) ? b : -1
};
ADPickerComponent.prototype.touchesEnded = function(b){
  var a = this.dragging;
  this.callSuper(b);
  if (b.eventPhase == Event.BUBBLING_PHASE || this.decelerating) {
    return
  }
  if (a) {
    this.superview.selectRowInComponentAnimated(this.getSelectedRow(), this.index, true)
  }
  else {
    if (this.touchedRow != -1) {
      this.superview.selectRowInComponentAnimated(this.touchedRow, this.index, true)
    }
  }
};
ADPickerComponent.prototype.scrollViewDidEndDecelerating = function(a){
  this.superview.selectRowInComponentAnimated(this.getSelectedRow(), this.index, true)
};
ADClass(ADPickerComponent);
const ADPickerViewNumberOfComponents = "numberOfComponentsInPickerView";
const ADPickerViewNumberOfRowsInComponent = "pickerViewNumberOfRowsInComponent";
const ADPickerViewRowHeightForComponent = "pickerViewRowHeightForComponent";
const ADPickerViewWidthForComponent = "pickerViewWidthForComponent";
const ADPickerViewTitleForRowForComponent = "pickerViewTitleForRowForComponent";
const ADPickerViewViewForRowForComponent = "pickerViewViewForRowForComponent";
const ADPickerViewDidSelectRowInComponent = "pickerViewDidSelectRowInComponent";
ADPickerViewWidth = 320;
ADPickerViewHeight = 216;
ADPickerViewDefaultRowHeight = 39;
ADPickerViewComponentTopMargin = 89;
ADPickerViewComponentBottomMargin = 99;
ADPickerView.inherits = ADView;
ADPickerView.synthetizes = ["showsSelectionIndicator"];
function ADPickerView(){
  this.callSuper();
  this.numberOfComponents = 0;
  this.delegate = null;
  this.dataSource = null;
  this._showsSelectionIndicator = false;
  this.components = [];
  this._size = new ADSize(ADPickerViewWidth, ADPickerViewHeight);
  this.clipsToBounds = true
}

ADPickerView.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-picker-view");
  var a = this.layer.appendChild(document.createElement("div"));
  a.className = "frame";
  this.componentsBackground = a.appendChild(document.createElement("div"));
  this.indicatorsBackground = a.appendChild(document.createElement("div"));
  this.hostingLayer = a.appendChild(document.createElement("div"));
  this.shadowOverlay = a.appendChild(document.createElement("div"));
  this.frameOverlay = a.appendChild(document.createElement("div"));
  this.indicatorsOverlay = a.appendChild(document.createElement("div"))
};
ADPickerView.prototype.setSize = function(a){
  a.width = ADPickerViewWidth;
  a.height = ADPickerViewHeight;
  this.callSuper(a)
};
ADPickerView.prototype.setShowsSelectionIndicator = function(a){
  this.layer.toggleClassName("shows-selection-indicator");
  this._showsSelectionIndicator = a
};
ADPickerView.prototype.numberOfRowsInComponent = function(a){
  if (a < 0 || a >= this.numberOfComponents) {
    throw (new Error("ADPickerView.numberOfRowsInComponent - no component " + a))
  }
  return this.components[a].rows
};
ADPickerView.prototype.updateNumberOfComponents = function(){
  if (ADUtils.objectHasMethod(this.dataSource, ADPickerViewNumberOfComponents)) {
    this.numberOfComponents = this.dataSource[ADPickerViewNumberOfComponents](this);
    if (this.numberOfComponents < 1) {
      throw (new Error("ADPickerView must have at least one component"))
    }
  }
  else {
    throw (new Error("the ADPickerView dataSource must implement " + ADPickerViewNumberOfComponents))
  }
};
ADPickerView.prototype.reloadAllComponents = function(){
  this.updateNumberOfComponents();
  for (var b = this.numberOfComponents; b < this.components.length; b++) {
    if (this.components[b] !== undefined) {
      this.components[b].removeFromSuperview();
      this.components[b] = undefined
    }
  }
  for (var a = 0; a < this.numberOfComponents; a++) {
    this.reloadComponent(a)
  }
  this.updateComponentsLayout()
};
ADPickerView.prototype.reloadComponent = function(b){
  if (b > this.numberOfComponents) {
    this.updateNumberOfComponents()
  }
  if (b < 0 || b >= this.numberOfComponents) {
    throw (new Error("ADPickerView.reloadComponent was called with an invalid component : " + b))
  }
  if (ADUtils.objectHasMethod(this.dataSource, ADPickerViewNumberOfRowsInComponent)) {
    var e = this.dataSource[ADPickerViewNumberOfRowsInComponent](this, b)
  }
  else {
    throw (new Error("the ADPickerView dataSource must implement " + ADPickerViewNumberOfRowsInComponent))
  }
  var f = null;
  if (ADUtils.objectHasMethod(this.delegate, ADPickerViewTitleForRowForComponent)) {
    f = this.delegate[ADPickerViewTitleForRowForComponent]
  }
  else {
    if (ADUtils.objectHasMethod(this.delegate, ADPickerViewViewForRowForComponent)) {
      f = this.delegate[ADPickerViewViewForRowForComponent]
    }
    else {
      throw (new Error("the ADPickerView delegate must implement either " + ADPickerViewTitleForRowForComponent + " or " + ADPickerViewViewForRowForComponent))
    }
  }
  if (this.components[b] === undefined) {
    this.components[b] = this.addSubview(new ADPickerComponent(b, e))
  }
  var a = this.components[b];
  a.hostingLayer.innerText = "";
  a.subviews = 0;
  for (var d = 0; d < e; d++) {
    var g = f.call(this.delegate, this, d, b);
    if (g instanceof ADView) {
      a.addSubview(g)
    }
    else {
      var c = document.createElement("div");
      c.className = "title-row";
      c.innerText = g;
      a.hostingLayer.appendChild(c)
    }
  }
};
ADPickerView.prototype.updateComponentsLayout = function(){
  this.componentsBackground.innerText = "";
  this.indicatorsBackground.innerText = "";
  var c = 300 / this.numberOfComponents;
  var b = ADUtils.objectHasMethod(this.delegate, ADPickerViewWidthForComponent);
  var d = 0;
  for (var e = 0; e < this.numberOfComponents; e++) {
    var a = this.components[e];
    var f = b ? this.delegate[ADPickerViewWidthForComponent](this, e) : c;
    a.position = new ADPoint(d, 0);
    a.size = new ADSize(f, ADPickerViewHeight);
    a.contentSize = new ADSize(f, this.components[e].rows * ADPickerViewDefaultRowHeight + ADPickerViewComponentTopMargin + ADPickerViewComponentBottomMargin);
    d += f;
    this.componentsBackground.appendChild(document.createElement("div")).style.width = ADUtils.px(f);
    this.indicatorsBackground.appendChild(document.createElement("div")).style.width = ADUtils.px(f)
  }
  this.frameOverlay.parentNode.style.width = ADUtils.px(d + 20);
  this.frameOverlay.parentNode.style.left = ADUtils.px((320 - d - 20) / 2)
};
ADPickerView.prototype.selectRowInComponentAnimated = function(c, a, b){
  if (a < 0 || a >= this.numberOfComponents) {
    throw (new Error("ADPickerView.selectRowInComponentAnimated - no component " + a))
  }
  if (c < 0 || c >= this.numberOfRowsInComponent(a)) {
    throw (new Error("ADPickerView.selectRowInComponentAnimated - no row " + c + " in component " + a))
  }
  this.components[a].setContentOffsetWithAnimation(new ADPoint(0, c * ADPickerViewDefaultRowHeight), b);
  if (ADUtils.objectHasMethod(this.delegate, ADPickerViewDidSelectRowInComponent)) {
    this.delegate[ADPickerViewDidSelectRowInComponent](this, c, a)
  }
};
ADPickerView.prototype.selectedRowInComponent = function(a){
  if (a < 0 || a >= this.numberOfComponents) {
    throw (new Error("ADPickerView.selectedRowInComponent - no component " + a))
  }
  return this.components[a].getSelectedRow()
};
ADPickerView.prototype.viewForRowForComponent = function(){
};
ADClass(ADPickerView);
const ADButtonTypeCustom = "custom-type";
const ADButtonTypeRoundedRect = "rounded-rect-type";
const ADButtonTypeDetailDisclosure = "detail-disclosure-type";
const ADButtonTypeInfoLight = "info-light-type";
const ADButtonTypeInfoDark = "info-dark-type";
const ADButtonTypeContactAdd = "contact-add-type";
const ADButtonDefaultHeight = 37;
ADButton.inherits = ADControl;
ADButton.synthetizes = ["currentTitle", "autosized"];
function ADButton(a){
  this.type = a;
  this.callSuper();
  this._autosized = true;
  this.titles = [""];
  this.syncTitleToState();
  this.addPropertyObserver("state", this, "syncTitleToState")
}

ADButton.prototype.createLayer = function(){
  this.callSuper();
  this.layer.addClassName("ad-button " + this.type)
};
ADButton.prototype.getSize = function(){
  var a = window.getComputedStyle(this.layer);
  return new ADSize(parseInt(a.width), parseInt(a.height))
};
ADButton.prototype.setSize = function(a){
  this._autoSized = false;
  this.callSuper(a)
};
ADButton.prototype.getCurrentTitle = function(){
  return this.layer.innerText
};
ADButton.prototype.setAutosized = function(a){
  if (a) {
    this.layer.style.width = "auto";
    this.layer.style.height = ADUtils.px(ADButtonDefaultHeight)
  }
  this._autosized = a
};
ADButton.prototype.titleForState = function(a){
  return this.titles[a] || null
};
ADButton.prototype.setTitleForState = function(b, a){
  this.titles[a] = b;
  if (a == this.state) {
    this.syncTitleToState()
  }
};
ADButton.prototype.syncTitleToState = function(){
  if (!(this.type === ADButtonTypeRoundedRect || this.type === ADButtonTypeCustom)) {
    return
  }
  this.layer.innerText = this.titles[this.state] || this.titles[ADControlStateNormal]
};
ADClass(ADButton);
ADButton.init = function(){
  ADUtils.preloadImageAsset("tableview/UITableSelection.png")
};
window.addEventListener("load", ADButton.init, false);
ADInterfaceOrientationPortrait = 0;
ADInterfaceOrientationPortraitUpsideDown = 1;
ADInterfaceOrientationLandscapeLeft = 2;
ADInterfaceOrientationLandscapeRight = 3;
const ADViewControllerTransitionInFromRight = {
  properties: ["transform"],
  from: ["translateX($width)"],
  to: ["translateX(0)"]
};
const ADViewControllerTransitionInFromLeft = {
  properties: ["transform"],
  from: ["translateX(-$width)"],
  to: ["translateX(0)"]
};
const ADViewControllerTransitionOutToRight = {
  properties: ["transform"],
  from: ["translateX(0)"],
  to: ["translateX($width)"]
};
const ADViewControllerTransitionOutToLeft = {
  properties: ["transform"],
  from: ["translateX(0)"],
  to: ["translateX(-$width)"]
};
ADViewController.inherits = ADObject;
ADViewController.synthetizes = ["view", "title", "navigationItem", "toolbarItems", "navigationController", "tabBarItem", "tabBarController"];
function ADViewController(a){
  this.callSuper();
  this.viewArchiveURL = a;
  this._view = null;
  this._title = "";
  this._tabBarItem = null;
  this._navigationItem = null;
  this._toolbarItems = null;
  this.hidesBottomBarWhenPushed = false;
  this.modalViewController = null;
  this.parentViewController = null;
  this.modalTransitionStyle = null;
  this.searchDisplayController = null;
  this.wasBackItemTransition = ADViewControllerTransitionInFromLeft;
  this.becomesBackItemTransition = ADViewControllerTransitionOutToLeft;
  this.wasTopItemTransition = ADViewControllerTransitionOutToRight;
  this.becomesTopItemTransition = ADViewControllerTransitionInFromRight;
  this.interfaceOrientation = ADInterfaceOrientationPortrait
}

ADViewController.prototype.parentControllerOfKind = function(c){
  var a = this;
  var b = null;
  while (a.parentViewController !== null) {
    if (a instanceof c) {
      b = a;
      break
    }
    a = a.parentViewController
  }
  return b
};
ADViewController.prototype.getNavigationController = function(){
  return this.parentControllerOfKind(ADNavigationController)
};
ADViewController.prototype.getTabBarController = function(){
  return this.parentControllerOfKind(ADTabBarController)
};
ADViewController.prototype.getView = function(){
  if (this._view === null) {
    this.loadView()
  }
  return this._view
};
ADViewController.prototype.loadView = function(){
  if (this.viewArchiveURL) {
    this._view = new ADView();
    var a = new ADHTMLFragmentLoader(this.viewArchiveURL, this)
  }
  else {
    this.createDefaultView()
  }
};
ADViewController.prototype.createDefaultView = function(){
  this._view = new ADView();
  this.viewDidLoad()
};
ADViewController.prototype.isViewLoaded = function(){
  return (this._view != null)
};
ADViewController.prototype.viewDidLoad = function(){
};
ADViewController.prototype.viewDidUnload = function(){
};
ADViewController.prototype.setTitle = function(a){
  this._title = a;
  if (this.parentViewController instanceof ADTabBarController) {
    this.tabBarItem.title = a
  }
  else {
    if (this.parentViewController instanceof ADNavigationController) {
      this.navigationItem.title = a
    }
  }
};
ADViewController.prototype.viewWillAppear = function(a){
};
ADViewController.prototype.viewDidAppear = function(a){
};
ADViewController.prototype.viewWillDisappear = function(a){
};
ADViewController.prototype.viewDidDisappear = function(a){
};
ADViewController.prototype.willRotateToInterfaceOrientation = function(a){
};
ADViewController.prototype.didRotateFromInterfaceOrientation = function(a){
};
ADViewController.prototype.presentModalViewControllerAnimated = function(b, a){
  this.modalViewController = b
};
ADViewController.prototype.dismissModalViewControllerAnimated = function(a){
  this.modalViewController = null
};
ADViewController.prototype.getNavigationItem = function(){
  if (this._navigationItem === null) {
    this._navigationItem = new ADNavigationItem(this.title);
    this._navigationItem.viewController = this
  }
  return this._navigationItem
};
ADViewController.prototype.getTabBarItem = function(){
  if (this._tabBarItem === null) {
    this._tabBarItem = new ADTabBarItem();
    this._tabBarItem.title = this.title;
    this._tabBarItem.viewController = this
  }
  return this._tabBarItem
};
ADViewController.prototype.setToolbarItems = function(a){
  this.setToolbarItemsAnimated(a, false)
};
ADViewController.prototype.setToolbarItemsAnimated = function(b, c){
  this._toolbarItems = b;
  var a = this.parentViewController;
  if (a !== null && a instanceof ADNavigationController) {
    a.toolbar.setItemsAnimated(b, c)
  }
};
ADViewController.prototype.htmlFragmentLoaderDidLoad = function(a){
  var c = new ADContentView(a.fragment);
  if (this._view !== null && this._view.superview) {
    var d = this._view.layer;
    var b = c.layer;
    b.setAttribute("style", c.layer.style.cssText + d.style.cssText);
    d.parentNode.replaceChild(b, d)
  }
  this._view.layer = c.layer;
  c = null;
  this.viewDidLoad()
};
ADViewController.prototype.htmlFragmentLoaderDidFail = function(a){
  console.warn("ADViewController Ñ could not load view archive at URL " + a.url);
  this.createDefaultView()
};
ADClass(ADViewController);
const ADNavigationControllerWillShowViewController = "navigationControllerWillShowViewControllerAnimated";
const ADNavigationControllerDidShowViewController = "navigationControllerDidShowViewControllerAnimated";
const ADNavigationControllerHideShowBarDuration = 0.2;
ADNavigationController.inherits = ADViewController;
ADNavigationController.synthetizes = ["viewControllers", "topViewController", "visibleViewController", "navigationBarHidden", "toolbarHidden"];
function ADNavigationController(a, b){
  this.callSuper(a);
  this.delegate = null;
  this._viewControllers = [];
  this._navigationBarHidden = false;
  this._toolbarHidden = true;
  this.navigationBar = new ADNavigationBar();
  this.toolbar = null;
  this.busy = false;
  this.requiresDeferredHostViewSizeUpdate = false;
  this.previousController = null;
  if (b !== undefined) {
    this.viewControllers = [b]
  }
}

ADNavigationController.prototype.loadView = function(){
  if (this.isViewLoaded()) {
    return
  }
  this._view = new ADNavigationView(this);
  this._view.layer.addClassName("ad-navigation-controller-view");
  this._view.clipsToBounds = true;
  this._view.addSubview(this.navigationBar);
  this.navigationBar.autoresizingMask = ADViewAutoresizingFlexibleWidth;
  this.hostView = this._view.addSubview(new ADView());
  this.hostView.layer.addClassName("ad-navigation-controller-host-view");
  this.toolbar = this._view.addSubview(new ADToolbar());
  this.toolbar.autoresizingMask = ADViewAutoresizingFlexibleWidth;
  this._view.addPropertyObserver("size", this, "sizeChanged");
  this._view.size = new ADSize(window.innerWidth, window.innerHeight);
  this._view.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight
};
ADNavigationController.prototype.viewMovedToNewSuperview = function(){
  var a = this.navigationBar.topItem;
  if (a !== null) {
    a.updateLayoutIfTopItem()
  }
};
ADNavigationController.prototype.sizeChanged = function(){
  var b = -ADNavigationBarHeight;
  var a = 0;
  var c = this._view.size.height;
  if (!this._navigationBarHidden) {
    b = 0;
    a += ADNavigationBarHeight
  }
  if (!this._toolbarHidden) {
    c -= ADToolbarHeight
  }
  this.navigationBar.position = new ADPoint(0, b);
  this.toolbar.position = new ADPoint(0, c);
  this.hostView.position = new ADPoint(0, a);
  this.updateHostViewSize()
};
ADNavigationController.prototype.updateHostViewSize = function(){
  var a = this._view.size.height;
  if (!this._navigationBarHidden) {
    a -= ADNavigationBarHeight
  }
  if (!this._toolbarHidden) {
    a -= ADToolbarHeight
  }
  this.hostView.size = new ADSize(this._view.size.width, a)
};
ADNavigationController.prototype.getTopViewController = function(){
  return (this._viewControllers.length > 0) ? this._viewControllers[this._viewControllers.length - 1] : null
};
ADNavigationController.prototype.getVisibleViewController = function(){
  var a = this.topViewController;
  return a.modalViewController || a
};
ADNavigationController.prototype.setViewControllers = function(a){
  this.setViewControllersAnimated(a, false)
};
ADNavigationController.prototype.setViewControllersAnimated = function(g, d){
  if (this.busy || g.length == 0) {
    return
  }
  ADTransaction.begin();
  this.loadView();
  var f = this.topViewController;
  var b = g[g.length - 1];
  var h = (this._viewControllers.indexOf(b) != -1);
  if (f !== null) {
    f.viewWillDisappear(d)
  }
  b.viewWillAppear(d);
  for (var c = 0; c < this._viewControllers.length; c++) {
    this._viewControllers[c].parentViewController = null
  }
  for (var c = 0; c < g.length; c++) {
    g[c].parentViewController = this
  }
  b.view.size = this.hostView.size.copy();
  b.view.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
  this.hostView.addSubview(b.view);
  if (f === null) {
    if (ADUtils.objectHasMethod(this.delegate, ADNavigationControllerWillShowViewController)) {
      this.delegate[ADNavigationControllerWillShowViewController](this, b, d)
    }
    b.viewDidAppear()
  }
  else {
    if (f !== b) {
      if (ADUtils.objectHasMethod(this.delegate, ADNavigationControllerWillShowViewController)) {
        this.delegate[ADNavigationControllerWillShowViewController](this, b, d)
      }
      this.transitionToController(b, f, !h, d)
    }
  }
  this._viewControllers = g;
  var a = [];
  for (var c = 0; c < g.length; c++) {
    a.push(g[c].navigationItem)
  }
  this.navigationBar.setItemsAnimated(a, d);
  var e = b.toolbarItems;
  if (e !== null) {
    this.toolbar.setItemsAnimated(e, d)
  }
  ADTransaction.commit()
};
ADNavigationController.prototype.pushViewControllerAnimated = function(a, b){
  this.setViewControllersAnimated(this._viewControllers.concat([a]), b)
};
ADNavigationController.prototype.popViewControllerAnimated = function(b){
  if (this._viewControllers.length > 1) {
    var a = this.topViewController;
    this.setViewControllersAnimated(this._viewControllers.slice(0, this._viewControllers.length - 1), b);
    return a
  }
  return null
};
ADNavigationController.prototype.popToRootViewControllerAnimated = function(a){
  return this.popToViewControllerAnimated(this._viewControllers[0], a)
};
ADNavigationController.prototype.popToViewControllerAnimated = function(a, c){
  var d = this._viewControllers.indexOf(a);
  if (d < 0 || d >= this._viewControllers.length - 1) {
    return []
  }
  var b = this._viewControllers.slice(d + 1);
  this.setViewControllersAnimated(this._viewControllers.slice(0, d + 1), c);
  return b
};
ADNavigationController.prototype.transitionToController = function(d, c, a, b){
  this.busy = b;
  this.previousController = c;
  ADTransaction.defaults.duration = b ? ADNavigationBarAnimationDuration : 0;
  if (c !== null) {
    c.view.applyTransition(a ? c.becomesBackItemTransition : c.wasTopItemTransition, false)
  }
  d.view.applyTransition(a ? d.becomesTopItemTransition : d.wasBackItemTransition, false)
};
ADNavigationController.prototype.transitionsEnded = function(){
  var a = this.busy;
  if (this.previousController !== null) {
    this.previousController.view.removeFromSuperview();
    this.previousController.viewDidDisappear(a)
  }
  this.topViewController.viewDidAppear(a);
  this.busy = false;
  if (ADUtils.objectHasMethod(this.delegate, ADNavigationControllerDidShowViewController)) {
    this.delegate[ADNavigationControllerDidShowViewController](this, this.topViewController, a)
  }
};
ADNavigationController.prototype.setNavigationBarHidden = function(a){
  this.setNavigationBarHiddenAnimated(a, false)
};
ADNavigationController.prototype.setNavigationBarHiddenAnimated = function(b, a){
  if (this._navigationBarHidden == b) {
    return
  }
  this._navigationBarHidden = b;
  if (!this.isViewLoaded()) {
    return
  }
  ADTransaction.begin();
  ADTransaction.defaults.duration = a ? ADNavigationControllerHideShowBarDuration : 0;
  ADTransaction.defaults.properties = ["position"];
  new ADTransition({
    target: this.navigationBar,
    to: [new ADPoint(0, b ? -ADNavigationBarHeight : 0)]
  }).start();
  new ADTransition({
    target: this.hostView,
    to: [new ADPoint(0, b ? 0 : ADNavigationBarHeight)],
    delegate: this
  }).start();
  ADTransaction.commit();
  if (!a || b) {
    this.updateHostViewSize()
  }
  else {
    this.requiresDeferredHostViewSizeUpdate = true
  }
};
ADNavigationController.prototype.transitionDidComplete = function(a){
  if (this.requiresDeferredHostViewSizeUpdate) {
    this.requiresDeferredHostViewSizeUpdate = false;
    this.updateHostViewSize()
  }
};
ADNavigationController.prototype.setToolbarHidden = function(a){
  this.setToolbarHiddenAnimated(a, false)
};
ADNavigationController.prototype.setToolbarHiddenAnimated = function(b, a){
  if (this._toolbarHidden == b) {
    return
  }
  this._toolbarHidden = b;
  if (!this.isViewLoaded()) {
    return
  }
  new ADTransition({
    target: this.toolbar,
    properties: ["position"],
    to: [new ADPoint(0, this._view.size.height - (b ? 0 : ADNavigationBarHeight))],
    duration: a ? ADNavigationControllerHideShowBarDuration : 0,
    delegate: this
  }).start();
  if (!a || b) {
    this.updateHostViewSize()
  }
  else {
    this.requiresDeferredHostViewSizeUpdate = true
  }
};
ADClass(ADNavigationController);
ADNavigationView.inherits = ADView;
function ADNavigationView(a){
  this.callSuper();
  this.viewController = a
}

ADNavigationView.prototype.didMoveToSuperview = function(a){
  this.callSuper(a);
  if (a !== null) {
    this.viewController.viewMovedToNewSuperview()
  }
};
ADClass(ADNavigationView);
const ADTabBarControllerShouldSelectViewController = "tabBarControllerShouldSelectViewController";
const ADTabBarControllerDidSelectViewController = "tabBarControllerDidSelectViewController";
const ADTabBarControllerMaxItems = 5;
ADTabBarController.inherits = ADViewController;
ADTabBarController.synthetizes = ["viewControllers", "selectedViewController", "selectedIndex"];
function ADTabBarController(a){
  this.callSuper(a);
  this.delegate = null;
  this.tabBar = new ADTabBar();
  this._viewControllers = [];
  this.customizableViewControllers = [];
  this.moreNavigationController = null;
  this.tabBar.delegate = this
}

ADTabBarController.prototype.loadView = function(){
  if (this.isViewLoaded()) {
    return
  }
  this._view = new ADView(this);
  this._view.layer.addClassName("ad-tab-bar-controller-view");
  this._view.size = new ADSize(window.innerWidth, window.innerHeight);
  this._view.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
  this.hostView = this._view.addSubview(new ADView());
  this.hostView.layer.addClassName("ad-tab-bar-controller-host-view");
  this.hostView.size = new ADSize(this._view.size.width, this._view.size.height - ADTabBarHeight);
  this.hostView.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
  this._view.addSubview(this.tabBar);
  this.tabBar.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleTopMargin
};
ADTabBarController.prototype.tabBarDidSelectItem = function(b, a){
  while (this.hostView.subviews.length) {
    this.hostView.subviews[0].removeFromSuperview()
  }
  var d = this.selectedViewController;
  var c = d.view;
  d.viewWillAppear(false);
  c.size = this.hostView.size.copy();
  c.autoresizingMask = ADViewAutoresizingFlexibleWidth | ADViewAutoresizingFlexibleHeight;
  this.hostView.addSubview(c);
  if (ADUtils.objectHasMethod(this.delegate, ADTabBarControllerDidSelectViewController)) {
    this.delegate[ADTabBarControllerDidSelectViewController](this, d)
  }
  d.viewDidAppear(false)
};
ADTabBarController.prototype.setViewControllers = function(a){
  this.setViewControllersAnimated(a, false)
};
ADTabBarController.prototype.setViewControllersAnimated = function(d, c){
  if (d.length > ADTabBarControllerMaxItems) {
  }
  this._viewControllers = d;
  var a = [];
  for (var b = 0; b < d.length; b++) {
    a.push(d[b].tabBarItem)
  }
  this.tabBar.setItemsAnimated(a, c)
};
ADTabBarController.prototype.getSelectedViewController = function(){
  var b = null;
  var a = this.selectedIndex;
  if (a >= 0 && a < this._viewControllers.length) {
    b = this._viewControllers[a]
  }
  return b
};
ADTabBarController.prototype.setSelectedViewController = function(a){
  if (this._viewControllers.indexOf(a) != -1) {
    this.tabBar.selectedItem = a.tabBarItem
  }
};
ADTabBarController.prototype.getSelectedIndex = function(){
  return this.tabBar.items.indexOf(this.tabBar.selectedItem)
};
ADTabBarController.prototype.setSelectedIndex = function(a){
  if (a >= 0 && a < this._viewControllers.length) {
    this.tabBar.selectedItem = this._viewControllers[a]
  }
};
ADClass(ADTabBarController);
