# cm-smtp [![Build Status](https://secure.travis-ci.org/parroit/cm-smtp.png?branch=master)](http://travis-ci.org/parroit/cm-smtp) [![NPM version](https://badge-me.herokuapp.com/api/npm/cm-smtp.png)](http://badges.enytc.com/for/npm/cm-smtp) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/parroit/cm-smtp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

> A connect-mail compatible smtp server

This is a simple wrapper around Andris Reinman [simplesmtp server](https://github.com/andris9/simplesmtp)
to make it connect-mail compatible.


##Usage: 

```javascript
var smtp = require('cm-smtp');

//create new server instance
var server = smtp({
    port:10025,
    host: '0.0.0.0'
});

//subscribe to incoming mail event
server.on('mail',function(mail){
    console.dir(mail);
});

//start listening
server.listen();
```

##Options:

`smtp` options can include the following:

* **port** - the port on which to listen, default 25
* **hostname** - the port on which to listen, default to '127.0.0.1'

_plus the following ones, directly passed to simplesmtp server constructor:_

* **name** - the hostname of the server, will be used for informational messages
* **debug** - if set to true, print out messages about the connection
* **timeout** - client timeout in milliseconds, defaults to 60 000 (60 sec.)
* **secureConnection** - start a server on secure connection
* **SMTPBanner** - greeting banner that is sent to the client on connection
* **requireAuthentication** - if set to true, require that the client must authenticate itself
* **enableAuthentication** - if set to true, client may authenticate itself but don't have to (as opposed to `requireAuthentication` that explicitly requires clients to authenticate themselves)
* **maxSize** - maximum size of an e-mail in bytes (currently informational only)
* **credentials** - TLS credentials (`{key:'', cert:'', ca:['']}`) for the server
* **authMethods** - allowed authentication methods, defaults to `["PLAIN", "LOGIN"]`
* **disableEHLO** - if set to true, support HELO command only
* **ignoreTLS** - if set to true, allow client do not use STARTTLS
* **disableDNSValidation** - if set, do not validate sender domains



## License 

The MIT License

Copyright (c) 2014, Andrea Parodi

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

