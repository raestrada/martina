try {
  self.postMessage('LOADING');
  importScripts('/js/stockfish.js');
  self.postMessage('LOADED');
} catch(e) {
  self.postMessage('ERROR:' + e.message);
  throw e;
}

self.onmessage = function(e) {
  try {
    StockFish.postMessage(e.data);
  } catch(err) {
    self.postMessage('CMD_ERR:' + err.message);
  }
};

self.postMessage('READY');
