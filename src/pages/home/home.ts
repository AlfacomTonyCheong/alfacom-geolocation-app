import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, ModalController, Events } from 'ionic-angular';
import { VehiclesProvider } from '../../providers/vehicles/vehicles';
import { GeolocationOptions, Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import * as Quagga from 'quagga';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private unsubscribe$ = new Subject();

  chosenVehicle: any;
  chosenDuration: number;

  myPos: any;
  myPosResults: string[];
  myPosAddress: string;

  firebaseDoc;
  firebaseCollection;

  canvasSrc;

  constructor(
    public navCtrl: NavController,
    private vehiclesProvider: VehiclesProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private events: Events,
    private geolocation: Geolocation,
    private firebaseProvider: FirebaseProvider
  ) {

  }

  ionViewDidLoad() {
    this.initParkingDetails();
    //this.initGeolocationWatcher();
    //this.firebaseDoc = this.firebaseProvider.getDocRef('temp/mANmENJSsGo6DZ0Xx8Hn').valueChanges();
    //this.firebaseCollection = this.firebaseProvider.getCollectionRef('temp').valueChanges();
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
      this.myPosAddress = data.address;
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
}