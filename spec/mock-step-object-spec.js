var MockStep = require('../lib/mock-step-object'),
    StepObject = require('../lib/step-object');

describe("Mock StepObject spec helper", function(){
  var subject, StepSubject, spy, methods, order, context, wrapped;

  spy = {
    onMe: function(callback){
      return callback(null, true);
    }
  };

  order = ['init', 'nextCall', 'groupCall', 'parallelCall', 'methodCall']

  methods = {
    _helper: function(){
      return 'uniq';
    },

    init: function(){
      context = this;

      //Save arguments
      this.stepArguments = Array.prototype.slice.call(arguments);

      //Setup initial call
      this.calls = ['init'];

      return true;
    },

    nextCall: function(){
      if(this.debug){
        console.log('fooo!!');
      }
      this.calls.push('nextCall');
      spy.onMe(this);
    },

    groupCall: function(){
      this.calls.push('groupCall');
      var group = this.group();

      spy.onMe(group());
    },

    parallelCall: function(){
      var parallel = this.parallel();
      this.calls.push('parallelCall');
      spy.onMe(parallel());
    },

    methodCall: function(){
      this.calls.push('methodCall');
      return this._helper();
    }

  };


  //NOTE:
  //When this is executed the 'context' variable will be updated
  //with the 'this' inside the step execution.
  StepSubject = StepObject(
    methods, order
  );

  beforeEach(function(){
    spyOn(spy, 'onMe').andCallThrough();

    subject = MockStep(StepSubject);
  });

  describe("StepSubject validity (lets make sure our test subject works in real life)", function(){

    var expectedResult = 'uniq';

    it("should execute each step in correct order", function(done){
      StepSubject(function(err, result){
        expect(result).toEqual(expectedResult);
        expect(context.calls).toEqual(order);

        done();
      });
    });

  });

  describe("returning an 'in context' StepObject without execution logic", function(){

    it("should have stopped execution before init", function(){
      expect(subject.calls).toBe(undefined);
    });

    it("should have a real context with all methods defined", function(){
      for(method in methods){
        expect(subject[method]).toBe(methods[method]);
      }
    });

    it("should be in the same context", function(){
      subject.init();

      expect(subject).toBe(context);
    });

  });

});
