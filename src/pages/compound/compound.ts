import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Toast, AlertOptions, AlertController, ModalController, Slides } from 'ionic-angular';
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
    @ViewChild('slides') slides: Slides;
    scannedData:any;
    imgToScan:any;
    isMobile:boolean = false;
    toast: Toast;
    alertExist:boolean= false;
    
    ngAfterViewInit() {
        this.slides.lockSwipes(true);
        this.isMobile = this.checkIfBrowserIsMobile();
        console.log('ismobile: ' + this.isMobile)
    }

    checkIfBrowserIsMobile(){
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
        return check;
    }
  
    constructor(
        private toastCtrl: ToastController, 
        private alertCtrl: AlertController,
    ) {
        
    }

    //===========================
    // Quagga
    //===========================

    startScanner(){
        let that = this;
        this.nextSlide();
        Quagga.init({
            inputStream: {
                name : "Live",
                type : "LiveStream",
                //target: document.querySelector('#scanner-container'),    // Or '#yourElement' (optional)
                constraints: {
                    // width: 200,
                    // height: 200,
                    aspectRatio: {min: 1, max: 100},
                    facingMode: "environment" // or user
                }
            },
            locator: {
                patchSize: "large",
                halfSample: true
            },
            numOfWorkers: 0,
            decoder: {
                readers: ["code_128_reader","ean_reader","ean_8_reader","code_39_reader"
                ,"code_39_vin_reader"
                ,"codabar_reader"
                ,"upc_reader"
                ,"upc_e_reader"
                ,"i2of5_reader"
                ,"2of5_reader"
                ,"code_93_reader"] // List of active readers
            },
            locate: true,
        }, function(err) {
            if (err) {
                that.showToast(err);
                return
            }
            that.showToast("Initialization finished. Ready to start");
            Quagga.start();
        });

        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
    
            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }
    
                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }
    
                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });

        Quagga.onDetected(function (result) {
            if (!that.alertExist){
                Quagga.stop();
                that.alertMessage("Barcode Detected", result.codeResult.code);
            }
            
            //that.showToast("Barcode detected and processed : [" + result.codeResult.code + "] " + result);
        });
    }

    startGallery(){
        let that = this;
        Quagga.decodeSingle({
            src: this.imgToScan,
            numOfWorkers: 0,  // Needs to be 0 when used within node
            inputStream: {
                size: 800  // restrict input-size to be 800px in width (long-side)
            },
            decoder: {
                readers: ["code_128_reader","ean_reader","ean_8_reader","code_39_reader"
                ,"code_39_vin_reader"
                ,"codabar_reader"
                ,"upc_reader"
                ,"upc_e_reader"
                ,"i2of5_reader"
                ,"2of5_reader"
                ,"code_93_reader"] // List of active readers
            },
        }, function(result) {
            if(result && result.codeResult) {
            that.scannedData = result.codeResult.code;
            that.showToast("result: " + result.codeResult.code);
            } else {
            that.showToast("not detected");
            }
        });

        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;
    
            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }
    
                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }
    
                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });

        Quagga.onDetected(function (result) {
            if (!that.alertExist){
                Quagga.stop();
                const alert = that.alertCtrl.create({
                    title: "Barcode Detected",
                    subTitle: result.codeResult.code,
                    buttons: ['Okay']
                  });
                alert.present();
                // that.alertMessage("Barcode Detected", result.codeResult.code);
            }
            
            //that.showToast("Barcode detected and processed : [" + result.codeResult.code + "] " + result);
        });
    }

    //===========================
    // Misc
    //===========================
    
    
    async showToast(msg: string) {
        this.toast = this.toastCtrl.create({ message: msg, position: 'bottom', duration: 3000 });
        await this.toast.present();
    }
    
    alertMessage(title: string, message: string, options?: AlertOptions) {
        // this.stopQuagga();
        this.alertExist = true;
        let alert = this.alertCtrl.create(options);
        alert.setTitle(title);
        alert.setSubTitle(message);
        alert.addButton({
            text: 'Try again',
            handler: () => {
                this.alertExist = false;
                this.startScanner();
            }
        });
        alert.addButton({
            text: 'Okay',
            handler: () => {
                this.alertExist = false;
                this.prevSlide();
                this.scannedData = message;
                // Quagga.stop();
            }
        });
        alert.present();
    }


    async openScannerAlert() {
        const alert = await this.alertCtrl.create({
          title: 'Scan',
          buttons: [
            {
              text: 'Gallery',
              handler: (data) => {
                let el: HTMLElement = document.getElementById("barcodeInput") as HTMLElement;
                el.click();
              }
            },
            {
              text: 'Camera',
              handler: () => {
                this.startScanner();
              }
            }
          ]
        });
    
        await alert.present();
      }
  
    nextSlide() {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
    }

    prevSlide() {
        Quagga.stop();
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.slides.lockSwipes(true);
    }

    triggerInput(){
        if (this.isMobile){
            this.openScannerAlert();
        }else{
            let el: HTMLElement = document.getElementById("barcodeInput") as HTMLElement;
            el.click();
        }
    }

    readUrl(event:any) {
        
        if (event.target.files && event.target.files.length > 0) {
            var reader = new FileReader();

            reader.onload = (event: ProgressEvent) => {
                this.imgToScan = (<FileReader>event.target).result
                //console.log('img: ' + this.imgToScan)
                this.startGallery();
            }
        
            reader.readAsDataURL(event.target.files[0]);
        }
    }
}
