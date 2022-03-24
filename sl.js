/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }

function portOrAst(addr, beforeProto, beforeHost, portSep) {
  return (beforeProto + (addr.urlProto || '')
    + beforeHost + addr.host
    + portSep + (addr.port || '*'));
}

function toStrTCP() { return portOrAst(this, 'TCP ', '', ':'); }
function toStrTCP6() { return portOrAst(this, 'TCP6 ', '[', ']:'); }
function toStrUDS() { return 'unix domain socket ' + this.path; }
function toStrFD() { return 'file descriptor #' + this.fd; }

function tcpAddr(addr, port) {
  var spec = { host: (addr || 'localhost'), port: port, toString: toStrTCP };
  if (addr) {
    if ((addr.slice(0, 1) === '[') && (addr.slice(-1) === ']')) {
      spec.host = addr.slice(1, -1);
      spec.toString = toStrTCP6;
    }
  }
  return spec;
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


function protoAddr(proto, addr, port) {
  if (proto === 'unix') { return udsAddr(addr); }
  if (proto === 'envfd') { return envFdAddr(addr); }
  if (proto === 'fd') { return fdAddr(addr, port); }
  if (proto === 'systemd') { return systemdAddr(addr); }
  throw new Error('Not implemented: socket type ' + proto);
}


function core(addr, port) {
  var m = addr.slice(0, 1);
  if (m === '/') { return udsAddr(addr); }
  if (m === '&') { return fdAddr(addr.slice(1), port); }
  if (m === '$') { return envFdAddr(addr.slice(1)); }
  m = /^(\w{1,8}):/.exec(addr);
  if (m) {
    m = m[1];
    return protoAddr(m, addr.slice(m.length + 1), port);
  }
  if (!port) {
    m = /(?:^|:)(\d+)$/.exec(addr);
    if (m) { return tcpAddr(addr.slice(0, m.index), +m[1]); }
  }
  return tcpAddr(addr, port);
}


function protoCore(a) {
  var u = a.urlProto;
  a = core(String(a.addr || ''), (+a.port || 0));
  if (u) { a.urlProto = u; }
  return a;
}


function smartListen(addr, port, dict) {
  if (typeof dict === 'string') { dict = { urlProto: dict }; }
  if (!ifObj(addr)) { addr = { addr: addr, port: port }; }
  dict = Object.assign({}, dict, protoCore(addr || false));
  if (addr.server) { addr.server.listen(dict); }
  return dict;
}

















module.exports = smartListen;
