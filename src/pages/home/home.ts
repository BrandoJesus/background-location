import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  logs: string[] = [];

  constructor(
    private backgroundGeolocation: BackgroundGeolocation
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  startBackgroundGeolocation(){
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) =>{
      if(rta){
        this.start();
      }else {
        this.backgroundGeolocation.showLocationSettings();
      }
    })
  }

  start(){

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: true,
      stopOnTerminate: false,
      // Android only section
      locationProvider: 1, // https://github.com/mauron85/cordova-plugin-background-geolocation/blob/master/PROVIDERS.md
      startForeground: true,
      interval: 6000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      notificationIconSmall: 'mappointer_small'
    };

    console.log('start');

    this.backgroundGeolocation
    .configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => {
      console.log(location);
      this.logs.push(`${location.latitude},${location.longitude}`);
    });

    // start recording location
    this.backgroundGeolocation.start();

  }

  stopBackgroundGeolocation(){
    this.backgroundGeolocation.stop();
  }

}
