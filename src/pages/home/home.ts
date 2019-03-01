import { Component, NgZone } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, 
  BackgroundGeolocationCurrentPositionConfig } from '@ionic-native/background-geolocation';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  logs: string[] = [];
  intervalo: any;

  constructor(
    private backgroundGeolocation: BackgroundGeolocation, public zone: NgZone
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  startBackgroundGeolocation(){
    console.log('this.backgroundGeolocation ', this.backgroundGeolocation);

    this.backgroundGeolocation.checkStatus().then((status) =>{
      // alert('isRunning '+ status.isRunning);
      alert('locationServicesEnabled '+ status.locationServicesEnabled);
      console.log('status ', status);

      if(status.locationServicesEnabled) this.interval();
      else this.backgroundGeolocation.showLocationSettings(); 
    });
  }

  start(){    
    // Background Tracking
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      // debug: true,
      stopOnTerminate: false,
      stopOnStillActivity: false,
      // Android only section
      locationProvider: 1, // https://github.com/mauron85/cordova-plugin-background-geolocation/blob/master/PROVIDERS.md
      interval: 6000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      notificationsEnabled: true,
      notificationTitle: 'Tracking Motorizado',
      notificationText: 'Habilitado',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      notificationIconSmall: 'mappointer_small'
    };
    this.backgroundGeolocation.configure(config);

    this.backgroundGeolocation.getCurrentLocation()
    .then((location: BackgroundGeolocationResponse) => {
      console.log(location);
      this.zone.run( () => {
        // alert(location.latitude + ' , ' + location.longitude);
        this.logs.push(`${location.latitude},${location.longitude}`);
      });
      
    }, (error) => {
        console.log(error.code + ' - ' + error.message);
    });

    this.backgroundGeolocation.getLocations()
    .then((locations) => {
      locations.forEach(l => {
        // alert(l.latitude + ' , ' + l.longitude);
      });
      console.log(locations);
    }, (error) => {
      alert(error.code + ' - ' + error.message);
    });

    // start recording location
    this.backgroundGeolocation.start();
  } 

  interval() {
    this.intervalo = setInterval(() => {
      this.start();
    }, 3000);
    // alert('intervalo ' + this.intervalo);  
  }

  stopBackgroundGeolocation(){
    this.backgroundGeolocation.stop();
    clearInterval(this.intervalo);
    this.logs = [];
  }

}
