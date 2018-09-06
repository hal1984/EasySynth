import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Plugins, StatusBarStyle } from '@capacitor/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Plugins.StatusBar) {
        Plugins.StatusBar.setStyle({ style: StatusBarStyle.Light }).catch(e => console.error(e));
      }
      if (Plugins.SplashScreen) {
        Plugins.SplashScreen.hide().catch(reason => console.error(reason));
      }
    });
  }
}
