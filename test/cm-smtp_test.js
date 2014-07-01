/*
 * cm-smtp
 * https://github.com/parroit/cm-smtp
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var cmsmtp = require('../lib/cm-smtp.js');

describe('cmsmtp module', function(){
  describe('#awesome()', function(){
    it('should return a hello', function(){
      cmsmtp.should.be.a('function');
    });
  });
});
