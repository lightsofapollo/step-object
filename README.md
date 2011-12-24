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

      fsReadDir: function(err, files){
        if(err){
          throw err;
        }

        return files;
      }

    }, ['queueRead', 'fsReadDir']);

    ReadDir(function(err, files){
      //files is the result of fsReadDir
    });
