import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import Quagga from 'quagga'; // ES6
// import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the CompoundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compound',
  templateUrl: 'compound.html'
})
export class CompoundPage {
  // options:BarcodeScannerOptions;
  encodText:string='';
  encodedData:any={};
  scannedData:any={};
  _scannerIsRunning = false;



//   state={
//       inputStream: {
//           type : "LiveStream",
//           constraints: {
//               width: {min: 640},
//               height: {min: 480},
//               aspectRatio: {min: 1, max: 100},
//               facingMode: "environment" // or user
//           }
//       },
//       locator: {
//           patchSize: "large",
//           halfSample: true
//       },
//       numOfWorkers: 4,
//       decoder: {
//           readers : ["code_39_reader","code_128_reader"]
//       },
//       locate: true,
//       multiple:true
//   }

  lastResult :any= null
  
  constructor(public navCtrl: NavController, public navParams: NavParams
  ) {
      
  }

   scan(){
//     if (this._scannerIsRunning) {
//         Quagga.stop();
//     } else {
//         this.startScanner();
//     }
   }

//   encode(){
//   }

//   initQuagga(){
//     console.log('init')
//     Quagga.init(this.state, function(err) {
//         if (err) {
//             alert(err);
//             return;
//         }
        
//         Quagga.start();
//     });
//   }

//   initCameraSelection(){
//     var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

//       return Quagga.CameraAccess.enumerateVideoDevices()
//       .then(function(devices) {
//           function pruneText(text) {
//               return text.length > 30 ? text.substr(0, 30) : text;
//           }
//           var $deviceSelection = document.getElementById("deviceSelection");
//           while ($deviceSelection.firstChild) {
//               $deviceSelection.removeChild($deviceSelection.firstChild);
//           }
//           devices.forEach(function(device) {
//               var $option = document.createElement("option");
//               $option.value = device.deviceId || device.id;
//               $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
//               $option.selected = streamLabel === device.label;
//               $deviceSelection.appendChild($option);
//           });
//       });
//   }

//   querySelectedReaders(){
//     return Array.prototype.slice.call(document.querySelectorAll('.readers input[type=checkbox]'))
//     .filter(function(element) {
//         return !!element.checked;
//     })
//     .map(function(element) {
//         return element.getAttribute("name");
//     });
//   }

   stopQuagga(){
//     alert('stopping')
//     // e.preventDefault();
//     Quagga.stop();
  }

//   _accessByPath(obj, path, val){
//     var parts = path.split('.'),
//     depth = parts.length,
//     setter = (typeof val !== "undefined") ? true : false;

//     return parts.reduce(function(o, key, i) {
//         if (setter && (i + 1) === depth) {
//             if (typeof o[key] === "object" && typeof val === "object") {
//                 Object.assign(o[key], val);
//             } else {
//                 o[key] = val;
//             }
//         }
//         return key in o ? o[key] : {};
//     }, obj);
//   }

//   _convertNameToState(name) {
//     return name.replace("_", ".").split("-").reduce(function(result, value) {
//         return result + value.charAt(0).toUpperCase() + value.substring(1);
//     });
//   }

//   ionViewDidLoad() {
//     const supported = 'mediaDevices' in navigator;
//     console.log('supported: ' + supported)
//     console.log('ionViewDidLoad CompoundPage');

//     var value;
//     var $: any;
//                   //value =  App.querySelectedReaders() ;
//     this.initQuagga();

//     Quagga.onProcessed(function(result) {
//         var drawingCtx = Quagga.canvas.ctx.overlay,
//             drawingCanvas = Quagga.canvas.dom.overlay;

//         if (result) {
//             if (result.boxes) {
//                 drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
//                 result.boxes.filter(function (box) {
//                     return box !== result.box;
//                 }).forEach(function (box) {
//                     Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
//                 });
//             }

//             if (result.box) {
//                 Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
//             }

//             if (result.codeResult && result.codeResult.code) {
//                 Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
//             }
//         }
//     });

//     Quagga.onDetected(function(result) {
//         var code = result.codeResult.code;

//         if (this.lastResult !== code) {
//             this.lastResult = code;
//             var $node = null, canvas = Quagga.canvas.dom.image;

//             $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
//             $node.find("img").attr("src", canvas.toDataURL());
//             $node.find("h4.code").html(code);
//             $("#result_strip ul.thumbnails").prepend($node);
//         }
//     });

//   }

  
//   startScanner() {
//     Quagga.decodeSingle({
//           src: "./assets/imgs/barcodeimg.png",
//           numOfWorkers: 0,  // Needs to be 0 when used within node
//           inputStream: {
//               size: 800  // restrict input-size to be 800px in width (long-side)
//           },
//           decoder: {
//               readers: ["code_128_reader"] // List of active readers
//           },
//       }, function(result) {
//           if(result.codeResult) {
//               console.log("result", result.codeResult.code);
//           } else {
//               console.log("not detected");
//           }
//       });
}
  
    
  

