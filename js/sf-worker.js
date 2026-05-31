try {
  importScripts('stockfish.js');
} catch(e) {
  self.postMessage('ERROR:' + e.message);
  throw e;
}

self.onmessage = function(e) {
  try {
    StockFish.postMessage(e.data);
  } catch(err) {
    self.postMessage('ERROR:' + err.message);
  }
};

self.postMessage('WORKER_READY');
