var express = require('express');
var router = express.Router();
var photosHandler = require('../logic/photosHandler');

/* GET home page. */
router.get('/',function(req, res, next) {
  // res.render('index', { title: 'Express' });
  photosHandler.getAllUserPhotoPaths(50, function (error, userPhotoPaths) {
      if (error) {
          util.log('Fail on get all photoPaths because of error:' + error);
          res.render('error', {title: 'error'});
      }
      else {
          // console.log("userPathPaths:" + userPhotoPaths);
          // res.render('photos', {userPhotoPaths: userPhotoPaths, title: 'photos'});
          res.render('index', { userPhotoPaths: userPhotoPaths,title: 'Express' });
      }
  });
});

module.exports = router;
