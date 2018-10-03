import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  


  ionViewDidLoad() {
    console.log('ionViewDidLoad CompoundPage');
  }

  

}
