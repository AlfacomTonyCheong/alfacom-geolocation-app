import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, IonicPage, AlertController, ModalController, Events, ToastController, Slides, PopoverController } from 'ionic-angular';
import { VehiclesProvider } from '../../providers/vehicles/vehicles';
import { GeolocationOptions, Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import * as Quagga from 'quagga';
import { DealsProvider } from '../../providers/deals/deals';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('dealsSlides') slides: Slides;
  @ViewChild('durationSlides') durationSlides: Slides;
  @ViewChild('vehicleSlides') vehicleSlides: Slides;
  private unsubscribe$ = new Subject();

  chosenVehicle: any;
  chosenDuration: number;
  durations = [1, 2, 3, 4, 5, 6, 7, 8];
  vehicleList:any[];
  myPos: any;
  myPosResults: string[];
  myPosAddress: string;
  myPosCoordinatesString:string;

  firebaseDoc;
  firebaseCollection;
  suggestions: any[];
  showSuggestions:boolean = false;
  canvasSrc;
  imgRoot:string = "assets/imgs/deals/"
  shareObj = {
    subject: "Parkir",
    text: "Please check this out!",
    link: window.location.href
  }

  constructor(
    public geolocationProvider:GeolocationProvider,
    public navCtrl: NavController,
    private vehiclesProvider: VehiclesProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private events: Events,
    private geolocation: Geolocation,
    private firebaseProvider: FirebaseProvider,
    private dealsProvider: DealsProvider,
    private ref: ChangeDetectorRef,
    private popoverCtrl: PopoverController
  ) {
  }


  ionViewDidEnter() {
    this.durationSlides.lockSwipes(true);
    this.vehicleSlides.lockSwipes(true);
    //this.vehicleList = this.vehiclesProvider.getVehicleList();
  }


  ionViewDidLoad() {
    this.initParkingDetails();
    
    this.events.publish('geolocationWatcher_start');
    this.events.subscribe('vehiclesProvider_loaded',(data)=>{
      console.log('subscribed')
      this.vehicleList = data;
    })

    //this.initGeolocationWatcher();
    //this.firebaseDoc = this.firebaseProvider.getDocRef('temp/mANmENJSsGo6DZ0Xx8Hn').valueChanges();
    //this.firebaseCollection = this.firebaseProvider.getCollectionRef('temp').valueChanges();
    // this.geolocationProvider.getPosition().subscribe((pos) => {
    //   console.log('[Geolocation] Lat: ' + pos.coords.latitude + ' | Lng: ' + pos.coords.longitude + ' | Acc: ' + pos.coords.accuracy);
    //   this.events.publish('geolocationWatcher_start');

    //   let canvasSrc = 'https://maps.googleapis.com/maps/api/staticmap?center=' + pos.coords.latitude + ',' + pos.coords.longitude;
    //   canvasSrc += '&size=600x250&zoom=18&maptype=' + google.maps.MapTypeId.ROADMAP + '&key=AIzaSyCYi-w3mNVhQgqdUtY5BTlUac9RsxAc1y0';
    //   canvasSrc += '&markers=color:red|' + pos.coords.latitude + ',' + pos.coords.longitude;
    //   this.events.publish('location_canvasImg', canvasSrc);
    // }, (err) => {
    //   console.error(err);
    // })
  }

  

  ionViewDidLeave() {
    this._unsubscribe();
  }

  _unsubscribe() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  

  initParkingDetails() {
    this.events.subscribe('geolocationWatcher_update', (data) => {
      console.log(data)
      this.myPosAddress = data.address;
      var coordString = data.lat.toString() +","+data.lng.toString();
      this.events.publish('geolocationWatcher_getCanvas',{ lat: data.lat.toString(), lng: data.lng.toString()});
      this.loadDeals(coordString)
    })

    this.events.subscribe('location_canvasImg', (url) => {
      this.canvasSrc = url;
    })
  }

  async addVehicle(selectAfterAdd?: boolean) {
    const alert = await this.alertCtrl.create({
      title: 'Add Vehicle',
      inputs: [
        {
          name: 'plateNumber',
          type: 'text',
          placeholder: 'Plate Number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            let plateNumber = data.plateNumber;
            if (plateNumber && plateNumber.length > 0) {
              this.vehiclesProvider.createVehicle(plateNumber).pipe(first()).subscribe((vehicle) => {
                console.log('Vehicle with plate number "' + plateNumber.trim().replace(/\s+/g, '').toUpperCase() + '" created successfully.');
                if (selectAfterAdd) this.chosenVehicle = vehicle;
              },
                (error) => {
                  console.error(error);
                });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async chooseVehicle() {
    let vehicleList = this.vehiclesProvider.getVehicleList();
    if (vehicleList && vehicleList.length === 0) {
      const alert = await this.alertCtrl.create({
        title: 'No vehicles',
        subTitle: 'Please add a vehicle first.',
        buttons: [{
          text: 'Okay',
          handler: () => {
            this.addVehicle(true);
          }
        }]
      });
      await alert.present();
    }
    else {
      let inputs = [];
      for (let i = 0; i < vehicleList.length; i++) {
        inputs.push({
          name: i,
          type: 'radio',
          label: vehicleList[i].plateNumber,
          value: vehicleList[i],
          checked: this.chosenVehicle ? (vehicleList[i].plateNumber === this.chosenVehicle.plateNumber) : false
        })
      }

      const alert = await this.alertCtrl.create({
        title: 'Choose Vehicle',
        inputs: inputs,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Okay',
            handler: (data) => {
              this.chosenVehicle = data;
              console.log('Chose vehicle: ' + JSON.stringify(this.chosenVehicle));
            }
          }
        ]
      });

      await alert.present();
    }
  }

  async chooseDuration() {
    let durations = [1, 2, 3, 4, 5, 6, 7, 8];
    let inputs = [];

    for (let i = 0; i < durations.length; i++) {
      let label = this.getDurationLabel(durations[i]);

      inputs.push({
        name: i,
        type: 'radio',
        label: label,
        value: durations[i],
        checked: this.chosenDuration ? (durations[i] === this.chosenDuration) : false
      })
    }

    const alert = await this.alertCtrl.create({
      title: 'Choose Duration',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Okay',
          handler: (data) => {
            this.chosenDuration = data;
            console.log('Chose duration: ' + this.chosenDuration);
          }
        }
      ]
    });

    await alert.present();
  }

  getImgSrc(name:string){
    if (name || name == '0'){
      return this.imgRoot + name.toString().toLowerCase() + '.jpg'
    }
  }

  getDurationLabel(hours: number) {
    return hours + ' hour' + (hours > 1 ? 's' : '')
  }

  async presentModal() {
    const modal = await this.modalCtrl.create('MChooseVehiclePage');
    return await modal.present();
  }

  async getLocation() {
    //this.events.publish('geolocationWatcher_start');
    const modal = await this.modalCtrl.create('MGoogleMapsPage');
    return await modal.present();

  }

  initGeolocationWatcher() {
    this.events.publish('geolocationWatcher_start');
  }

  async initQuagga() {
    var quaggaOptions = {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#quaggaViewport')
      },
      decoder: {
        readers: ['code_128_reader']
      }
    }

    Quagga.init(quaggaOptions, function (error) {
      if (error) {
        console.error(error);
      }
      else {
        console.log('[Quagga] Initialization finished. Ready to start.');
        Quagga.start();
      }
    })
  }

  nextSlide(slide,type) {
    //var slide = type ==1?this.vehicleSlides:this.durationSlides;
    slide.lockSwipes(false);
    slide.slideNext();
    slide.lockSwipes(true);
    this.bindData(slide,type)
  }

  prevSlide(slide,type) {
    console.log(slide)
    //var slide = type ==1?this.vehicleSlides:this.durationSlides;
    slide.lockSwipes(false);
    slide.slidePrev();
    slide.lockSwipes(true);
    this.bindData(slide,type)
  }

  bindData(slide,type){
    if (type == 1){// vehicle
      this.chosenVehicle = this.vehicleList[slide.getActiveIndex()];
      console.log(this.chosenVehicle)
    }else{
      this.chosenDuration = this.durations[slide.getActiveIndex()]
      console.log(this.chosenDuration)
    }
  }


  //===========================
  // Deals
  //===========================
  openDealsModal(index){
    var modalPage = this.modalCtrl.create(
      'DealsModalPage',
      {
        index:index,
        suggestions: this.suggestions
      },
      {
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );
    modalPage.present();

    modalPage.onDidDismiss(data => {
      //this.navCtrl.push(nextPage)
    })
  }

  loadDeals(coordString) {
    // this.loadError = false;
    // let loading = this.loadingCtrl.create({
    //   content: "Loading Highlights..."
    // });
    // loading.present();

    this.dealsProvider.GetDealsByCoordinates(coordString)
      
      .subscribe((data : any) => {
        if (data && data.meta.code == '200'){
          try{
            this.suggestions = data.response.groups[0].items;
          }catch(Exception){

            this.suggestions = [];

          }
          if (this.suggestions.length > 0){
            //this.getDealsImages()
            this.showSuggestions = true;
            this.ref.detectChanges();
         }
        }
        // this.highlights = data.content as IWiseInfoTVHighlights[];
      },
      (error) => {
        // this.loadError = true;
        let toast = this.toastCtrl.create({
          message: error.message,
          position: 'middle',
          duration: 2000
          // showCloseButton:true
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      },()=>{
        console.log(this.suggestions)
        
        // console.log('finally')
        // if (this.suggestions.length > 0){
        //    //this.getDealsImages()
        //    this.showSuggestions = true;
        //    this.ref.detectChanges();
        // }
        // console.log(this.suggestions)
      }
      );
  }

  getDealsImages(){
    if (this.suggestions.length > 0){
      var imgUrl = "";
      for (let deal of this.suggestions){
        this.dealsProvider.GetVenueImage(deal.venue.id)
          .subscribe((data : any) => {
            if (data && data.meta.code == '200'){
              try{
                var imgJson = data.response.photos.items[0];
                console.log(imgJson)
                imgUrl = imgJson.prefix + imgJson.width + "x"+imgJson.height+imgJson.suffix
                console.log('imgUrl: ' + imgUrl)
              }catch(Exception){
    
                imgUrl = "";
    
              }
            }
            // this.highlights = data.content as IWiseInfoTVHighlights[];
          },
          (error) => {
            // this.loadError = true;
            let toast = this.toastCtrl.create({
              message: error.message,
              position: 'middle',
              duration: 2000
              // showCloseButton:true
            });
          
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
          
            toast.present();
          },()=>{
            deal.venue.imgUrl = imgUrl;
          }
          );

        
      } 
    }
  }

  share(){
    let newVariable: any;

    newVariable = window.navigator;

    if(newVariable && newVariable.share) {
      newVariable.share({
        title: this.shareObj.subject,
        text: this.shareObj.text,
        url: this.shareObj.link
      })
      .then(() => console.log('Share complete'))
      .error((error) => console.log('Could not share at this time ' +error))
    }else{
      var popover = this.popoverCtrl.create(
        'ShareModalPage',
        {
          link: this.shareObj.link
        },
        {
          showBackdrop: true,
          enableBackdropDismiss: true
        }
      );
  
      popover.present();
    }
  }
}
