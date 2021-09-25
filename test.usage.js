/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var assert = require('assert'), asFuncResult = String;

function equal(ac, ex) {
  ac.toString = ac.toString();
  assert.deepStrictEqual(ac, ex);
}

(function readmeDemo() {
  // #BEGIN# usage demo
  var smartListen = require('net-smartlisten-pmb');

  //=== TCP ports ===//
  equal(smartListen(),
    { host: 'localhost', port: 0,
      toString: asFuncResult('TCP localhost:*') });
  equal(smartListen('192.168.0.23'),
    { host: '192.168.0.23', port: 0,
      toString: asFuncResult('TCP 192.168.0.23:*') });
  equal(smartListen(undefined, 23),
    { host: 'localhost', port: 23,
      toString: asFuncResult('TCP localhost:23') });
  equal(smartListen(undefined, 23),
    { host: 'localhost', port: 23,
      toString: asFuncResult('TCP localhost:23') });
  equal(smartListen('192.168.0.23', 42),
    { host: '192.168.0.23', port: 42,
      toString: asFuncResult('TCP 192.168.0.23:42') });
  equal(smartListen(':23'),
    { host: 'localhost', port: 23,
      toString: asFuncResult('TCP localhost:23') });
  equal(smartListen('23'),
    { host: 'localhost', port: 23,
      toString: asFuncResult('TCP localhost:23') });
  equal(smartListen(23),
    { host: 'localhost', port: 23,
      toString: asFuncResult('TCP localhost:23') });

  equal(smartListen('example.net:42'),
    { host: 'example.net', port: 42,
      toString: asFuncResult('TCP example.net:42') });
  equal(smartListen('192.168.0.23:42'),
    { host: '192.168.0.23', port: 42,
      toString: asFuncResult('TCP 192.168.0.23:42') });
  equal(smartListen('[2001:db8::23]:42'),
    { host: '2001:db8::23', port: 42,
      toString: asFuncResult('TCP6 [2001:db8::23]:42') });

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
  // #ENDOF# usage demo

  // #BEGIN# pathological
  equal(smartListen('127..', -42), { host: '127..', port: -42,
      toString: asFuncResult('TCP 127..:-42') });

  equal(smartListen('unix:[::1]'), { path: '[::1]',
      toString: asFuncResult('unix domain socket [::1]') });

  equal(smartListen('#$&=§?'), { host: '#$&=§?', port: 0,
      toString: asFuncResult('TCP #$&=§?:*') });
  // #ENDOF# pathological
}());









console.log("+OK usage demo test passed.");   //= "+OK usage demo test passed."
