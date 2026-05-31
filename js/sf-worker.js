try {
  self.postMessage('LOADING');
  importScripts('/js/stockfish.js');
  if (typeof StockFish === 'undefined') {
    self.postMessage('ERROR:StockFish not defined');
  } else {
    self.postMessage('LOADED');
  }
} catch(e) {
  self.postMessage('ERROR:import:' + e.message);
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
