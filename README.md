
<!--#echo json="package.json" key="name" underline="=" -->
net-smartlisten-pmb
===================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Determine where and how my net.Server shall listen.
<!--/#echo -->


Usage
-----

from [test.usage.js](test.usage.js):

<!--#include file="test.usage.js" outdent="  " code="javascript"
  start="  // #BEGIN# usage demo" stop="  // #ENDOF# usage demo" -->
<!--#verbatim lncnt="47" -->
```javascript
var smartListen = require('net-smartlisten-pmb');

//=== TCP PORTS ===//
equal(smartListen(),
  { host: 'localhost', port: 0,
    toString: asFuncResult('TCP localhost:*') });
equal(smartListen('192.168.0.23'),
  { host: '192.168.0.23', port: 0,
    toString: asFuncResult('TCP 192.168.0.23:*') });
equal(smartListen(undefined, 23),
  { host: 'localhost', port: 23,
    toString: asFuncResult('TCP localhost:23') });
equal(smartListen('192.168.0.23', 42),
  { host: '192.168.0.23', port: 42,
    toString: asFuncResult('TCP 192.168.0.23:42') });

//=== Domain sockets ===//
// NB: For OS-specific naming restrictions, see the API manual.
equal(smartListen('/var/run/demo.sock'),
  { path: '/var/run/demo.sock',
    toString: asFuncResult('unix domain socket /var/run/demo.sock') });
equal(smartListen('unix:/var/run/demo.sock'),
  { path: '/var/run/demo.sock',
    toString: asFuncResult('unix domain socket /var/run/demo.sock') });

//=== File descriptors ===//
equal(smartListen('&8'), { fd: 8,
  toString: asFuncResult('file descriptor #8') });
equal(smartListen('fd:8'), { fd: 8,
  toString: asFuncResult('file descriptor #8') });

process.env.LISTEN_FDS = 5;
equal(smartListen('$LISTEN_FDS'), { fd: 5,
  toString: asFuncResult('file descriptor #5') });
equal(smartListen('envfd:LISTEN_FDS'), { fd: 5,
  toString: asFuncResult('file descriptor #5') });

//=== systemd ===//
process.env.LISTEN_PID = 333;
equal(smartListen('systemd:'), { fd: 5, sdPid: 333,
  toString: asFuncResult('file descriptor #5') });
equal(smartListen('systemd:0'), { fd: 5, sdPid: 333,
  toString: asFuncResult('file descriptor #5') });
equal(smartListen('systemd:2'), { fd: 7, sdPid: 333,
  toString: asFuncResult('file descriptor #7') });
```
<!--/include-->



No validation
-------------

* Input validation aims to __avoid__ opaque magic behavior based on user input.
* This module aims to __add__ opaque magic behavior based on user input.

Thus, we don't waste any effort (machine resources) on pathological cases:

<!--#include file="test.usage.js" outdent="  " code="javascript"
  start="  // #BEGIN# pathological" stop="  // #ENDOF# pathological" -->
<!--#verbatim lncnt="10" -->
```javascript
equal(smartListen('127..', -42), { host: '127..', port: -42,
    toString: asFuncResult('TCP 127..:-42') });

equal(smartListen('unix:[::1]'), { path: '[::1]',
    toString: asFuncResult('unix domain socket [::1]') });

equal(smartListen('#$&=§?'), { host: '#$&=§?', port: 0,
    toString: asFuncResult('TCP #$&=§?:*') });
```
<!--/include-->


<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
