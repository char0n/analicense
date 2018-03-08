'use strict';

const Rx = require('rxjs/Rx');
const { curry, curryN } = require('ramda');


const fromStream$ = curryN(3, (stream, finishEventName = 'end', dataEventName = 'data') => {
  //stream.pause();

  return Rx.Observable.create((observer) => {
    const dataHandler = data => observer.next(data);
    const errorHandler = error => observer.error(error);
    const endHandler = () => observer.complete();

    stream.addListener(dataEventName, dataHandler);
    stream.addListener('error', errorHandler);
    stream.addListener('end', endHandler);

   // stream.resume();

    return () => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  }).publish().refCount();
});


const fromReadableStream$ = curry((stream, dataEventName) => fromStream$(stream, 'end', dataEventName));


const fromReadLineStream$ = stream => fromStream$(stream, 'close', 'line');


const fromWritableStream$ = stream => fromStream$(stream, 'finish', 'data');


const fromTransformStream$ = curry((stream, dataEventName) => fromStream$(stream, 'finish', dataEventName));


module.exports = {
  fromStream$,
  fromReadableStream$,
  fromReadLineStream$,
  fromWritableStream$,
  fromTransformStream$,
};