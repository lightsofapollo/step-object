var StepObject = require('step-object');

describe("step-object", function(){

  
  var subject, context, fn = function(name){
    return function(){
      context = this;
      this.argumentStack = this.argumentStack || {};
      this.callOrder = this.callOrder || [];

      this.argumentStack[name] = Array.prototype.slice.call(arguments);
      this.callOrder.push(name);
      return this.callOrder[this.callOrder.length - 1];
    };
  };

  var fn1 = fn('1'), fn2 = fn('2'); 

  beforeEach(function(){

    subject = StepObject({
      one: fn1,
      two: fn2
    }, ['two', 'one']);

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

      describe("method copying", function(){

        beforeEach(function(){
          //create context by calling subject step
          subject(function(){
            return true;
          })
        });

        it("should have copied methods to scope of this (which is next)", function(){
          //remember context updated when step is called.
          expect(context.one).toBe(fn1);
          expect(context.two).toBe(fn2);
        });

      });

      it("should execute functions in order", function(){
        subject(function(err){
          list = this.callOrder;
        });

        expect(list).toEqual(['2', '1']);

      });

      it("should have recieved given arguments", function(){
        var arg = {}, argStack;

        subject(arg, function(){
          argStack = this.argumentStack;
        });

        expect(argStack['2']).toEqual([arg]);

      });

    });

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

    var subclass, fnNew = fn('special'), methods;

    beforeEach(function(){
      subclass = subject.inherit({
        one: fnNew
      });
    });

    describe("step call", function(){

      var list;

      it("should execute functions in order", function(){

        //Creates context
        subclass(function(err){
          list = this.callOrder;
          return list;
        });

        expect(list).toEqual(['2', 'special']);

      });

      describe("method copying", function(){

        it("should have copied new methods to scope of this", function(){
          //remember context updated when step is called.
          expect(context.one).toBe(fnNew);
        });

        it("should correctly copy inherited methods", function(){
          expect(context.two).toBe(fn2);
        });

      });

    });

    describe(".methods", function(){

      it("should have a reference to new methods", function(){
        expect(subclass.methods.one).toBe(fnNew);
      });

      it("should have a reference to old methods", function(){

        expect(subclass.methods.two).toBe(fn2);
      });

    });

  });

});
