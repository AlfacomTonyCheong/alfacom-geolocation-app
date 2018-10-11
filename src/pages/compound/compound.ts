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

  // inputMapper= {
  //   inputStream = {
  //       constraints: function(value){
  //           if (/^(\d+)x(\d+)$/.test(value)) {
  //               var values = value.split('x');
  //               return {
  //                   width: {min: parseInt(values[0])},
  //                   height: {min: parseInt(values[1])}
  //               };
  //           }
  //           return {
  //               deviceId: value
  //           };
  //       }
  //   },
  //   numOfWorkers: function(value) {
  //       return parseInt(value);
  //   },
  //   decoder:any= {
  //       readers: function(value) {
  //           if (value === 'ean_extended') {
  //               return [{
  //                   format: "ean_reader",
  //                   config: {
  //                       supplements: [
  //                           'ean_5_reader', 'ean_2_reader'
  //                       ]
  //                   }
  //               }];
  //           }
  //           console.log("value before format :"+value);
  //           return [{
  //               format: value + "_reader",
  //               config: {}
  //           }];
  //       }
  //   }
  // };

  state={
      inputStream: {
          type : "LiveStream",
          constraints: {
              width: {min: 640},
              height: {min: 480},
              aspectRatio: {min: 1, max: 100},
              facingMode: "environment" // or user
          }
      },
      locator: {
          patchSize: "large",
          halfSample: true
      },
      numOfWorkers: 4,
      decoder: {
          readers : ["code_39_reader","code_128_reader"]
      },
      locate: true,
      multiple:true
  }

  lastResult :any= null
  
  constructor(public navCtrl: NavController, public navParams: NavParams
    // ,public barcodeScanner: BarcodeScanner
  ) {
    // this.barcodeScanner.scan().then(barcodeData => {
    //   console.log('Barcode data', barcodeData);
    //  }).catch(err => {
    //      console.log('Error', err);
    //  });
      
  }

  scan(){
    if (this._scannerIsRunning) {
        Quagga.stop();
    } else {
        this.startScanner();
    }
    // Quagga.start();
    // this.options ={
    //   prompt:'Scan barcode'
    // };
    // this.barcodeScanner.scan(this.options).then((data)=>{
    //   console.log('scanned: ' + data)
    //   this.scannedData = data;
    // },(err)=>{
    //   console.log('Error: ' + err)
    // })
  }

  encode(){
    // this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE,this.encodText).then((data)=>{
    //   console.log('encoded: ' + data)
    //   this.encodedData = data;
    // },(err)=>{
    //   console.log('Error: ' + err);
    // })
  }

  // async scanBarcode(){
  //   const results = await this.barcodeScanner.scan();
  //   console.log(results);
  // }
  initQuagga(){
    console.log('init')
    Quagga.init(this.state, function(err) {
        if (err) {
            alert(err);
            return;
        }
        
        Quagga.start();
    });
  }

  initCameraSelection(){
    var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

      return Quagga.CameraAccess.enumerateVideoDevices()
      .then(function(devices) {
          function pruneText(text) {
              return text.length > 30 ? text.substr(0, 30) : text;
          }
          var $deviceSelection = document.getElementById("deviceSelection");
          while ($deviceSelection.firstChild) {
              $deviceSelection.removeChild($deviceSelection.firstChild);
          }
          devices.forEach(function(device) {
              var $option = document.createElement("option");
              $option.value = device.deviceId || device.id;
              $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
              $option.selected = streamLabel === device.label;
              $deviceSelection.appendChild($option);
          });
      });
  }

  querySelectedReaders(){
    return Array.prototype.slice.call(document.querySelectorAll('.readers input[type=checkbox]'))
    .filter(function(element) {
        return !!element.checked;
    })
    .map(function(element) {
        return element.getAttribute("name");
    });
  }

  stopQuagga(){
    alert('stopping')
    // e.preventDefault();
    Quagga.stop();
  }

  // readerConfigChange(){
  //   e.preventDefault();
  //   var $target = $(e.target);
  //     // value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
  //     value =  $target.attr("type") === "checkbox" ? this.querySelectedReaders() : $target.val();
  //     var  name = $target.attr("name"),
  //       state = self._convertNameToState(name);

  //   console.log("Value of "+ state + " changed to " + value);
  //   self.setState(state, value);
  // }

  _accessByPath(obj, path, val){
    var parts = path.split('.'),
    depth = parts.length,
    setter = (typeof val !== "undefined") ? true : false;

    return parts.reduce(function(o, key, i) {
        if (setter && (i + 1) === depth) {
            if (typeof o[key] === "object" && typeof val === "object") {
                Object.assign(o[key], val);
            } else {
                o[key] = val;
            }
        }
        return key in o ? o[key] : {};
    }, obj);
  }

  _convertNameToState(name) {
    return name.replace("_", ".").split("-").reduce(function(result, value) {
        return result + value.charAt(0).toUpperCase() + value.substring(1);
    });
  }

  // detachListeners: function() {
  //     $(".controls").off("click", "button.stop");
  //     $(".controls .reader-config-group").off("change", "input, select");
  // }

  // setState(path, value) {
  //     var self = this;

  //     if (typeof self._accessByPath(self.inputMapper, path) === "function") {
  //         value = self._accessByPath(self.inputMapper, path)(value);
  //     }

  //     self._accessByPath(self.state, path, value);

  //     console.log(JSON.stringify(self.state));
  //     App.detachListeners();
  //     Quagga.stop();
  //     App.init();
  // }

  

  ionViewDidLoad() {
    const supported = 'mediaDevices' in navigator;
    console.log('supported: ' + supported)
    console.log('ionViewDidLoad CompoundPage');

    var value;
    var $: any;
                  //value =  App.querySelectedReaders() ;
    this.initQuagga();

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;

        if (this.lastResult !== code) {
            this.lastResult = code;
            var $node = null, canvas = Quagga.canvas.dom.image;

            $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
            $node.find("img").attr("src", canvas.toDataURL());
            $node.find("h4.code").html(code);
            $("#result_strip ul.thumbnails").prepend($node);
        }
    });

  }

  
  startScanner() {
    Quagga.decodeSingle({
          src: "./assets/imgs/barcodeimg.png",
          numOfWorkers: 0,  // Needs to be 0 when used within node
          inputStream: {
              size: 800  // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
              readers: ["code_128_reader"] // List of active readers
          },
      }, function(result) {
          if(result.codeResult) {
              console.log("result", result.codeResult.code);
          } else {
              console.log("not detected");
          }
      });
    // Quagga.init({
    //     inputStream: {
    //         name: "Live",
    //         type: "LiveStream",
    //         target: document.querySelector('#scanner-container'),
    //         constraints: {
    //             width: 480,
    //             height: 320,
    //             facingMode: "environment"
    //         },
    //     },
    //     decoder: {
    //         readers: [
    //             "code_128_reader",
    //             "ean_reader",
    //             "ean_8_reader",
    //             "code_39_reader",
    //             "code_39_vin_reader",
    //             "codabar_reader",
    //             "upc_reader",
    //             "upc_e_reader",
    //             "i2of5_reader"
    //         ],
    //         debug: {
    //             showCanvas: true,
    //             showPatches: true,
    //             showFoundPatches: true,
    //             showSkeleton: true,
    //             showLabels: true,
    //             showPatchLabels: true,
    //             showRemainingPatchLabels: true,
    //             boxFromPatches: {
    //                 showTransformed: true,
    //                 showTransformedBox: true,
    //                 showBB: true
    //             }
    //         }
    //     },

    // }, function (err) {
    //     if (err) {
    //         console.log(err);
    //         return
    //     }

    //     console.log("Initialization finished. Ready to start");
    //     Quagga.start();

    //     // Set flag to is running
    //     this._scannerIsRunning = true;
    // });

    // Quagga.onProcessed(function (result) {
    //     var drawingCtx = Quagga.canvas.ctx.overlay,
    //     drawingCanvas = Quagga.canvas.dom.overlay;

    //     if (result) {
    //         if (result.boxes) {
    //             drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
    //             result.boxes.filter(function (box) {
    //                 return box !== result.box;
    //             }).forEach(function (box) {
    //                 Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
    //             });
    //         }

    //         if (result.box) {
    //             Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
    //         }

    //         if (result.codeResult && result.codeResult.code) {
    //             Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
    //         }
    //     }
    // });


    // Quagga.onDetected(function (result) {
    //     console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
    // });
}
  
    
  

}
