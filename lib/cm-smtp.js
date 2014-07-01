/*
 * cm-smtp
 * https://github.com/parroit/cm-smtp
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var Readable = require('stream').Readable;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var uuid = require('node-uuid');
var assert = require('assert');
var smtp = require('simplesmtp');

function SmtpConnectionReadableStream(connection, opt) {
    Readable.call(this, opt);
    this.chunks = [];
    this.ended = false;
    this.connectMailId = connection.connectMailId = uuid.v1();
}

util.inherits(SmtpConnectionReadableStream, Readable);


SmtpConnectionReadableStream.prototype.mailChunkReceived = function(chunk) {
    this.chunks.push(chunk);
};

SmtpConnectionReadableStream.prototype.mailReceivedSuccessfully = function() {
    this.ended = true;
};


SmtpConnectionReadableStream.prototype._read = function() {
    if (this.ended && this.chunks.length === 0) {
        this.push(null);
    } else {
        var chunkAccepted = true;
        while (chunkAccepted && this.chunks.length > 0) {
            var chunk = this.chunks.splice(0, 1)[0];
            chunkAccepted = this.push(chunk);
        }
    }
};


function SimpleSmtpBridge(server, options) {
    EventEmitter.call(this);
    this.server = server;
    this.connections = {};

    options.port = options.port || 25;
    options.hostname = options.hostname || '127.0.0.1';

    this.options = options;
 
}
util.inherits(SimpleSmtpBridge, EventEmitter);

SimpleSmtpBridge.prototype._removeConnection = function(connectMailId) {
    delete this.connections[connectMailId];
};

SimpleSmtpBridge.prototype._obtainConnectionStream = function(connection) {
    var id = connection.connectMailId;
    if (id) {
        assert(id in this.connections, 'connection not found: ' + id);
        return this.connections[id];
    }

    var cn = new SmtpConnectionReadableStream(connection);
    this.connections[cn.connectMailId] = cn;
    return cn;
};

SimpleSmtpBridge.prototype.listen = function() {
    var obtainConnectionStream = this._obtainConnectionStream.bind(this);
    var emit = this.emit.bind(this);
    var removeConnection = this._removeConnection.bind(this);
    var options = this.options;

    this.server.on('startData', function(connection) {
        var cn = obtainConnectionStream(connection);
        emit('mail', {
            from: connection.from,
            to: connection.to,
            date: connection.date,
            remoteAddress: connection.remoteAddress,
            authentication: connection.authentication,
            host: connection.host,
            data: cn
        });

    });

    this.server.on('data', function(connection, chunk) {
        var cn = obtainConnectionStream(connection);
        cn.mailChunkReceived(chunk);
    });

    this.server.on('dataReady', function(connection, callback) {
        var cn = obtainConnectionStream(connection);
        cn.mailReceivedSuccessfully();
        callback(null, cn.connectMailId);

    });

    this.server.on('close', function(connection) {
        var cn = obtainConnectionStream(connection);
        cn.mailReceivedSuccessfully();
        removeConnection(cn.connectMailId);
    });



    this.server.listen(options.port, options.hostname, function() {
        //console.dir(arguments);
        console.log('connect mail is listening on ' + options.hostname + ':' + options.port);
    });
};

module.exports = function(options) {


    var server = smtp.createServer(options);
    var bridge = new SimpleSmtpBridge(server, options);
    return bridge;
};
