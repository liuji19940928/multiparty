var http = require('http')
  , multiparty = require('../')
  , azure = require('azure')
  , PORT = process.env.PORT || 27372;

var server = http.createServer(function(req, res) {
  if (req.url === '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  } else if (req.url === '/upload') {

    var blobService = azure.createBlobService();
    var form = new multiparty.Form();

    form.on('part', function(part) {
      if (!part.filename) return;

      var size = part.byteCount;
      var name = part.filename;
      var container = 'blobContainerName';

      blobService.createBlockBlobFromStream(container, name, part, size, function(error) {
        if (error) {
          // error handling
          res.status(500).send('Error uploading file');
        }
        res.send('File uploaded successfully');
      });
    });

    form.parse(req);

  }
});

server.listen(PORT, function() {
  console.info('listening on http://0.0.0.0:' + PORT + '/');
});

