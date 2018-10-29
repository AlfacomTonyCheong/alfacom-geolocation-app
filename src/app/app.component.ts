import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'LoginPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.updateMomentLocale();
  }

  updateMomentLocale() {
    moment.updateLocale('en', {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: '%ds', // 'a few seconds'
        ss: '%ds', // '%d seconds'
        m: "1m", // "a minute"
        mm: "%dm", // "%d minutes"
        h: "1h", // "an hour"
        hh: "%dh", // "%d hours"
        d: "1d",
        dd: "%dd",
        M: "1mth",
        MM: "%dmth",
        y: "yr",
        yy: "%dyr"
      },
      calendar: {
        lastDay: '[Yesterday at] LT',
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        lastWeek: '[last] dddd [at] LT',
        nextWeek: 'dddd [at] LT',
        sameElse: 'DD/MM/YYYY'
      }
    });
  }
}
