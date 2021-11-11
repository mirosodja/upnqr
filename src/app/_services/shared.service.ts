import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Oseba } from '../_models/oseba';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private upnMenuSelectableSource = new BehaviorSubject(false);
  private upnSharedOsebasSource = new BehaviorSubject({});
  currentUpnMenuSelectable = this.upnMenuSelectableSource.asObservable();
  currentUpnSharedOsebas = this.upnSharedOsebasSource.asObservable();

  // metodo kličem od drugod
  changeMessage(upnMenuSelectable: boolean) {
    this.upnMenuSelectableSource.next(upnMenuSelectable);
  }

  changeSharedOsebas(upnSharedOsebas: Oseba[]) {
    this.upnSharedOsebasSource.next(upnSharedOsebas);
  }
}
