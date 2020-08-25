const fs = require('fs');

exports.deleteProdImage = (filePath, next) => {
   fs.unlink(filePath, (err) => {
      if (err) {
         next(err);
      }
   });
};
