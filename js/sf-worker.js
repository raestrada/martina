importScripts('/js/stockfish.js');

self.onmessage = function(e) {
  StockFish.postMessage(e.data);
};
