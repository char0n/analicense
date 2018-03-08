'use strict';

const Rx = require('rxjs/Rx');
const { spawn } = require('child_process');

const ls = spawn('ls', ['-a', '.']);


