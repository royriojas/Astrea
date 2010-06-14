module('Astrea');

test('object created using $.Namespace exists', function() {
  expect(1);
  var namespaceNotNull;
  $.Namespace('my.custom.ns');
  try {
    namespaceNotNull = my.custom.ns !== null;
  }
  catch(ex) {
    namespaceNotNull = false
  }  
  ok(namespaceNotNull, 'Namespace is not well created')
});

test('namespace object does not destroy objects that already exist', function () {
  
  var sameObject, old;
  window.my = {
    custom: {
      ns: {
        name: 'original object'
      }
    }
  }
  old = window.my.custom.ns; 
  $.Namespace('my.custom');
  expect(1);
  try {
    sameObject = my.custom.ns === old;
  }
  catch(ex) {
    sameObject = false;
  }
  ok(sameObject,'the object is not the same')
});

test('string format works on multiple replace tokens', function() {
  var str = "this is a {0}, a test {0} for the string format function. The values are passed as {1} after the {2}";
  var output = $.stringFormat(str, 'message', 'arguments', 'format string');
  expect(1);
  same('this is a message, a test message for the string format function. The values are passed as arguments after the format string', output,'Not the same output');
});

test('escape the {} symbols in the message', function() {
  var str = "this is a {0}, a test {0} for the string format function. The values are passed as {1} after the {2}. this token {{0}} should be matched and this {token} should not be matched";
  var output = $.stringFormat(str, 'message', 'arguments', 'format string');
  expect(1);
  same('this is a message, a test message for the string format function. The values are passed as arguments after the format string. this token {message} should be matched and this {token} should not be matched', output,'Not the same output');
});

module('Astrea.Util')

test('Astrea.Util.findValueBykey', function () {
  var obj = {
    data : {
      value : 'the value is here',
      key : 12
    }
  };
  expect(2);
  same(obj.data.value, Astrea.Util.findValueBykey(obj, 'data.value'), 'Not the same value');
  same(obj.data.key, Astrea.Util.findValueBykey(obj, 'data.key'), 'Not the same value');
});
