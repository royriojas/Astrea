/**
 * @author Roy Riojas
 */

describe("Astrea", function () {

  before( function () {

  });
  after( function () {

  });
  it('should exists', function () {
    assert(window.$a != null).should(be, true);
  });
  it('format should be a method', function () {
    assert($a.format).should(beA, Function);
  });
  it('ns should be a method', function () {
    assert($a.ns).should(beA, Function);
  });
});
describe('Astrea.format', function () {
  it('should replace the values in the right position', function () {
    var template = 'Some {0} template {1}. This should be the number {2}';
    var result = $a.format(template, 'nice', 'will be', 1);
    var expected = 'Some nice template will be. This should be the number 1';

    assert(result).should(eql, expected);
  });
  it('should replace the values even when the tokens are not in the right order', function () {
    var template = 'Some {2} template {0}. This should be the number {1}';
    var result = $a.format(template, 'will be', 1, 'nice');
    var expected = 'Some nice template will be. This should be the number 1';

    assert(result).should(eql, expected);
  });
  it('should ignore missing parameters', function () {
    var template = 'Some {2} template {0}. This should be the number {1}';
    var result = $a.format(template, 'will be', 1);
    var expected = 'Some  template will be. This should be the number 1';

    assert(result).should(eql, expected);
  });
  it('should ignore extra parameters', function () {
    var template = 'Some {2} template {0}. This should be the number {1}';
    var result = $a.format(template, 'will be', 1, 'nice', 'some extra value will be here');
    var expected = 'Some nice template will be. This should be the number 1';

    assert(result).should(eql, expected);
  });
});
describe('Astrea.ns', function () {
  it('should create a namespace object starting in the window object', function () {
    var obj = {
      ns : {
        abc : {}
      }
    };

    $a.ns('obj.ns.abc');
    assert(window.obj).should(beAn, Object);
    assert(window.obj).should(beSimilarTo, obj);
    delete window.obj;
  });
  it('should not alter an object if already exists', function () {

    window.abc = {
      cde : {
        fgh : {
          ijk : 'some value'
        }
      }
    };
    var expected = {
      cde : {
        fgh : {
          ijk : 'some value'
        },
        someNs : {}
      }
    };
    $a.ns('abc.cde.someNs');
    assert(window.abc.cde.fgh.ijk).should(eql,'some value');
    assert(window.abc).should(beSimilarTo, expected);
  });
  it('should not override string, booleans, number or arrays. Functions, arrays and objects are ok', function () {

    window.abc = {
      cde : {
        someBoolean : true,
        someNumber : 1,
        someString : "a String",
        someArray : [1,2,4],
        fn : function () {

        },
        fgh : {
          ijk : 'some value'
        }
      }
    };
    var fn = function() {};
    fn.moreValue = {};
    var arr = [1,2,4];
    arr.moreValue = {};
    var expected = {
      cde : {
        someBoolean : true,
        someNumber : 1,
        someString : "a String",
        someArray : arr,
        fn : fn,
        fgh : {
          ijk : 'some value'
        }
      }
    };
    $a.ns('abc.cde.someBoolean.moreValue');
    $a.ns('abc.cde.someNumber.moreValue');
    $a.ns('abc.cde.someString.moreValue');
    $a.ns('abc.cde.someArray.moreValue');
    $a.ns('abc.cde.fn.moreValue');
    

    assert(window.abc.cde.someBoolean.moreValue == null).should(be, true);
    assert(window.abc.cde.someNumber.moreValue == null).should(be, true);
    assert(window.abc.cde.someString.moreValue == null).should(be, true);

    assert(window.abc.cde.someArray.moreValue == null).shouldNot(be, true);
    assert(window.abc.cde.fn.moreValue == null).shouldNot(be, true);
    
    assert(JSON.stringify(window.abc)).should(beSimilarTo, JSON.stringify(expected));
  });
});

describe('Astrea.Sniff', function () {
  it('should detect ipad when the platform contains iPad', function () {
    var oldW = Astrea.w;
    Astrea.w = {
      navigator : {
        platform : 'iPad'
      }
    };
    
    var isiPad = $a.Sniff.isiPad;
    assert(isiPad).should(be, true);
    $a.w = oldW;
  })
});

describe('Astrea.Sniff', function () {
  it('should detect iphone when the platform contains iPhone', function () {
    var oldW = Astrea.w;
    Astrea.w = {
      navigator : {
        platform : 'iPhone'
      }
    };
    
    var isiPad = $a.Sniff.isiPhone;
    assert(isiPad).should(be, true);
    $a.w = oldW;
  })
});