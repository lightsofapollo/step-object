Object based creation of step functions.

Still an experiment at this stage.

Example:


```
    var StepObject = require('step-object'),
        fs = require('fs');

    var ReadDir = StepObject({

      _filter: function(files){
        var filteredFiles;

        //some filter logic
        return filteredFiles;
      },

      queue: function(path){
        fs.readdir(path, this);
      },

      read: function(err, files){
        if(err){
          throw err;
        }

        return this._filter(files);
      },

    }, ['queue', 'read']);

    ReadDir(function(err, files){
      //files is the result of read
    });

    //Once the object is created you can also gain access to its methods (for unit testing)
    ReadDir.methods //{queue: ....}
    ReadDir.order //['queueRead', 'fsReadDir']
    
