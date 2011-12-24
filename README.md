Object based creation of step functions.

Still an experiment at this stage.

Example:


```
    var StepObject = require('step-object'),
        fs = require('fs');

    var ReadDir = StepObject({

      queueRead: function(path){
        fs.readdir(path, this);
      },
      
      _processFiles: function(files){
        return files;
      },

      fsReadDir: function(err, files){
        if(err){
          throw err;
        }
      }

    }, ['queueRead', 'fsReadDir']);

    ReadDir(function(err, files){
      //files is the result of fsReadDir
    });

    //Once the object is created you can also gain access to its methods (for unit testing)
    ReadDir.methods //{queueRead: ....}
    ReadDir.order //['queueRead', 'fsReadDir']
    