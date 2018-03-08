'use strict';

const { spawn } = require('child_process');
const Rx = require('rxjs');

const { fromReadableStream$ } = require('./stream');


const spawn$ = (command, args, options) => {
  try {
    const spawned = spawn(command, args, options);
    const stdout$ = fromReadableStream$(spawned.stdout, 'data');
    const stderr$ = fromReadableStream$(spawned.stderr, 'data');
    const spawnedError$ = Rx.Observable.fromEvent(spawned, 'error');

    return stdout$
      .takeUntil(Rx.Observable.combineLatest(stderr$, spawnedError$))
      .map(buffer => buffer.toString('utf-8'));
  } catch (e) {
    return Rx.Observable.throw(e);
  }
};


spawn$('ls', ['-la', '/']).map(v => v.split('\n')).subscribe(
  v => console.dir(v),
  v1 => console.error('v1' + v1),
  // => console.dir('c' + c)
);
