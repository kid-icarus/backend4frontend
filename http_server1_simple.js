#!/usr/bin/env node
//
// Simple echo server
// If you connect to it, it will echo things back to you.


var net = require('net');

var server = net.createServer();    

server.on('connection', handleConnection);

server.listen(9000, function() {    
  console.log('server listening to %j', server.address());  
});

function handleConnection(conn) {    
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
  console.log('new client connection from %s', remoteAddress);
  conn.on('data', onConnData);  
  conn.once('close', onConnClose);  
  conn.on('error', onConnError);

  function onConnData(d) {  
    console.log('connection data from %s: %s', remoteAddress, d);
    // note this is unsafe because we don't escape the data in 'd'
    // it could have html or javascript in it.
    var content = `<html>
    <title>Welcome to my custom server</title>
    <body>
    <p>This is my custom response.
    <p>You wrote to me: <pre>"${d}"</pre>
    </body>
    </html>XXXX
    XXXXXXX
    XXXXX`;
    // Content-Length: ${content.length}

    var header = `HTTP/1.1 200 OK
Date: Mon, 27 Jul 2020 12:28:53 GMT
Server: Apache/2.2.14 (Win32)
Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
Content-Type: text/html
Connection: Closed

`.replaceAll('\n', '\r\n');
    var response = header + content; // replaceall because HTTP standard needs \r\n
    conn.write(response, function() {
        console.log(`writing back: ${response}`);
        console.log(`calling end...`);
        conn.end();  
    });
    
  }
  function onConnClose() {  
    console.log('connection from %s closed', remoteAddress);  
  }
  function onConnError(err) {  
    console.log('Connection %s error: %s', remoteAddress, err.message);  
  }  
}
