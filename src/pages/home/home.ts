import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, ModalController } from 'ionic-angular';
import { VehiclesProvider } from '../../providers/vehicles/vehicles';
import { GeolocationOptions, Geolocation } from '@ionic-native/geolocation';
import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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

  constructor(
    public navCtrl: NavController,
    private vehiclesProvider: VehiclesProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private firebaseProvider: FirebaseProvider
  ) {

  }

  ionViewDidLoad(){
    //this.firebaseDoc = this.firebaseProvider.getDocRef('temp/mANmENJSsGo6DZ0Xx8Hn').valueChanges();
    //this.firebaseCollection = this.firebaseProvider.getCollectionRef('temp').valueChanges();
  }

  ionViewDidLeave(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    if (vehicleList.length === 0) {
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
    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000
    }
    this.geolocation.getCurrentPosition(options).then((position: Position) => {
      this.myPos = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy };
      console.log('Current Position: ' + JSON.stringify(this.myPos));
      console.dir(position);
      this.getMyPosAddress();
    }).catch((error) => {
      console.error('Error getting location: [' + error.code + '] ' + error.message);
      // this.alertCurrentPositionError();
    })

    this.geolocation.watchPosition(options).takeUntil(this.unsubscribe$).subscribe((position: Position) => {
      this.myPos = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy };
      // this.myPosMarker.setPosition(this.myPos);
      console.log('My Position changed: ' + JSON.stringify(this.myPos));
      this.getMyPosAddress();
    });
  }

  reverseGeocode(){
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': {lat: this.myPos.lat, lng: this.myPos.lng}}, (results, status) => {
      console.log('Geocode status: ' + status);
      if(status.toString() === 'OK'){
        console.dir(results);
        this.myPosResults = [];
        for(let result of results){
          this.myPosResults.push(result.formatted_address);
        }
      }
    })
  }

  getMyPosAddress(){
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': {lat: this.myPos.lat, lng: this.myPos.lng}}, (results, status) => {
      console.log('Geocode status: ' + status);
      if(status.toString() === 'OK'){
        this.myPosAddress = results[0].formatted_address;
      }
    })
  }
}
