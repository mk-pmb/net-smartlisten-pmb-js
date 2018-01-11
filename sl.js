/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }

function toStrTCP() { return 'TCP ' + this.host + ':' + (this.port || '*'); }
function toStrUDS() { return 'unix domain socket ' + this.path; }
function toStrFD() { return 'file descriptor #' + this.fd; }

function tcpAddr(addr, port) {
  return { host: (addr || 'localhost'), port: port, toString: toStrTCP };
}

function fdAddr(a, p) {
  a = (+(a || p) || 0);
  return { fd: a, toString: toStrFD };
}

function envFdAddr(a) { return fdAddr(process.env[a]); }
function udsAddr(a) { return { path: a, toString: toStrUDS }; }

function systemdAddr(o) {
  var a = envFdAddr('LISTEN_FDS');
  a.fd += (+o || 0);
  a.sdPid = (+process.env.LISTEN_PID || 0);
  return a;
}


function core(addr, port) {
  var how = addr.substr(0, 1);
  if (how === '/') { return udsAddr(addr); }
  if (how === '&') { return fdAddr(addr.slice(1), port); }
  if (how === '$') { return envFdAddr(addr.slice(1)); }
  how = /^(\w{1,8}):/.exec(addr);
  if (!how) { return tcpAddr(addr, port); }
  addr = addr.slice(how[0].length);
  how = how[1];
  if (how === 'unix') { return udsAddr(addr); }
  if (how === 'envfd') { return envFdAddr(addr); }
  if (how === 'fd') { return fdAddr(addr, port); }
  if (how === 'systemd') { return systemdAddr(addr); }
  throw new Error('Not implemented: socket type ' + how);
}


function smartListen(addr, port, dict) {
  if (!ifObj(addr)) { addr = { addr: addr, port: port }; }
  dict = Object.assign({}, dict, core(addr.addr || '', (+addr.port || 0)));
  if (addr.server) { addr.server.listen(dict); }
  return dict;
}

















module.exports = smartListen;
