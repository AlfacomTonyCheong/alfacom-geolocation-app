/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

var SW_VERSION = '1.0';
var OFFLINE_URL = '/offline';

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json',
    OFFLINE_URL
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;

self.toolbox.router.get('/(.*)', function (req, vals, opts) {
  return self.toolbox.networkFirst(req, vals, opts)
      .catch(function (error) {
          if (req.method === 'GET' && req.headers.get('accept').includes('text/html')) {
              return self.toolbox.cacheOnly(new Request(OFFLINE_URL), vals, opts);
          }
          throw error;
      });
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
})