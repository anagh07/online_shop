const fs = require('fs');

exports.deleteProdImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    } 
  });
};
