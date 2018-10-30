'use strict';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Force development builds
//workbox.setConfig({ debug: true });

// Force production builds
workbox.setConfig({ debug: false });

workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.precacheAndRoute([]);

// workbox.precaching.precacheAndRoute([
//     './build/main.js',
//     './build/vendor.js',
//     './build/main.css',
//     './build/polyfills.js',
//     'index.html',
//     'manifest.json'
// ])
// workbox.routing.registerRoute(
//   // Cache JS files
//   /.*\.js/,
//   // Get from the network whenever possible, but fallback to the cached version if the network fails,
//   workbox.strategies.networkFirst({
//     cacheName: 'parkir-js-cache'
//   })
// );

// workbox.routing.registerRoute(
//   // Cache CSS files
//   /.*\.css/,
//   // Use cache but update in the background ASAP
//   workbox.strategies.staleWhileRevalidate({
//     // Use a custom cache name
//     cacheName: 'parkir-css-cache',
//   })
// );

// workbox.routing.registerRoute(
//   // Cache image files
//   /.*\.(?:png|jpg|jpeg|svg|gif)/,
//   // Use the cache if it's available
//   workbox.strategies.cacheFirst({
//     // Use a custom cache name
//     cacheName: 'parkir-image-cache',
//     plugins: [
//       new workbox.expiration.Plugin({
//         // Cache only 20 images
//         maxEntries: 20,
//         // Cache for a maximum of a week
//         maxAgeSeconds: 7 * 24 * 60 * 60,
//       })
//     ],
//   })
// );

// Disable caching
workbox.routing.registerRoute(
  // All files
  /(.*)/,
  workbox.strategies.networkOnly()
)
