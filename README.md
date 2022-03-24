
<!--#echo json="package.json" key="name" underline="=" -->
net-smartlisten-pmb
===================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Determine where and how my net.Server shall listen.
<!--/#echo -->


Usage
-----

see [test.usage.js](test.usage.js).



No validation
-------------

* Input validation aims to __avoid__ opaque magic behavior based on user input.
* This module aims to __add__ opaque magic behavior based on user input.

Thus, we don't waste any effort (machine resources) on pathological cases.
(See "pathologicalExamples" in usage tests.)



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
