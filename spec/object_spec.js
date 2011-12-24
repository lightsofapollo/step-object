var StepObject = require('step-object');

describe("step-object", function(){

  
  var subject, fn = function(name){
    return function(){
      this.callOrder = this.callOrder || [];
      return this.callOrder.push(name);
    };
  };

  var fn1 = fn('1'), fn2 = fn('2'); 


  beforeEach(function(){
    subject = StepObject({
      one: fn1,
      two: fn2
    }, ['two', 'one']);
  });

  describe(".inheritObject", function(){
    var subject, 
        obj = {one: '1'},
        props = {one: 'one'};

    beforeEach(function(){
      subject = StepObject.inheritObject(obj, props);
    });

    it("should have inherited properties of base object", function(){
      expect(subject.one).toEqual('one');

      delete subject.one;

      expect(subject.one).toEqual('1');
    });
  });


  describe("inherting a step", function(){

    var subclass, fnNew = fn('special');

    beforeEach(function(){
      subclass = subject.inherit({
        one: fnNew
      });
    });

    describe("step call", function(){

      var list;

      it("should execute functions in order", function(){

        subclass(function(err){
          list = this.callOrder;
        });

        expect(list).toEqual(['2', 'special']);

      });

    });

    describe(".methods", function(){

      it("should have a reference to both new and old methods", function(){
        expect(subclass.methods.one).toBe(fnNew);
        expect(subclass.methods.two).toBe(fn2);
      });

    });

  });

  describe("creating a step", function(){

    describe(".methods", function(){

      it("should have a reference to methods defined in first argument", function(){
        expect(subject.methods.one).toBe(fn1);
        expect(subject.methods.two).toBe(fn2);
      });

    });

    describe(".order", function(){

      it("should return the second argument of creation", function(){
        expect(subject.order).toEqual(['two', 'one']);
      });

    });

    describe("step call", function(){

      var list;

      it("should execute functions in order", function(){
        subject(function(err){
          list = this.callOrder;
        });

        expect(list).toEqual(['2', '1']);

      });

    });

  });


});
