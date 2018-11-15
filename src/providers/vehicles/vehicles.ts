import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Events } from 'ionic-angular';

export interface IVehicle{
  plateNumber: string,
  createdDate: string,
  modifiedDate: string
}

@Injectable()
export class VehiclesProvider {

  private storageString = 'vehicle';
  private vehicleList : IVehicle[];

  constructor(private storage: Storage,private events: Events,) {
    this.loadVehicleList();
  }

  loadVehicleList = () => {
    this.storage.get(this.storageString).then((storedVehicleList: IVehicle[]) => {
      if(!storedVehicleList) this.vehicleList = [];
      else this.vehicleList = storedVehicleList;
      this.events.publish('vehiclesProvider_loaded',this.vehicleList);
    });
  }

  saveVehicleList = () => {
    this.storage.set(this.storageString, this.vehicleList).then(() => {
      this.loadVehicleList();
    })
  }

  getVehicleList = () => {
    return this.vehicleList;
  }
  
  createVehicle = (plateNumber: string) => {
    return new Observable((observer) => {
      plateNumber = plateNumber.trim().replace(/\s+/g, '').toUpperCase();

      if(!plateNumber || plateNumber.length === 0)
        observer.error('Invalid plate number.');

      // Check for duplicates
      let idx = this.vehicleList.findIndex(x => x.plateNumber === plateNumber);
      if(idx != -1) {
        observer.error('Vehicle with plate number "' + plateNumber + '" already exists.');
      }
      else{
        let now = moment().format();
        let vehicle: IVehicle = {
          plateNumber: plateNumber,
          createdDate: now,
          modifiedDate: now
        }
        
        console.dir(vehicle);

        this.vehicleList.push(vehicle);
        this.saveVehicleList();
        observer.next(vehicle);
        observer.complete();
      }
    });
  }

  deleteVehicle = (plateNumber: string) => {
    return new Observable((observer) => {
      plateNumber = plateNumber.trim().replace(/\s+/g, '').toUpperCase();

      let idx = this.vehicleList.findIndex(x => x.plateNumber === plateNumber);
      if(idx != -1){
        this.vehicleList.splice(idx, 1);
        this.saveVehicleList();
        observer.next(true);
        observer.complete();
      }
      else{
        observer.error('Vehicle with plate number "' + plateNumber + '" not found.');
      }
    });
  }
  
  updateVehicle = (oldPlateNumber: string, newPlateNumber: string) => {
    return new Observable((observer) => {
      oldPlateNumber = oldPlateNumber.trim().replace(/\s+/g, '').toUpperCase();
      newPlateNumber = newPlateNumber.trim().replace(/\s+/g, '').toUpperCase();

      let idx = this.vehicleList.findIndex(x => x.plateNumber === oldPlateNumber);
      if(idx != -1){
        this.vehicleList[idx].plateNumber = newPlateNumber;
        this.vehicleList[idx].modifiedDate = moment().format();
        observer.next(true);
        observer.complete();
      }
      else{
        observer.error('Vehicle with plate number "' + oldPlateNumber + '" not found.');
      }
    });
  }
}
