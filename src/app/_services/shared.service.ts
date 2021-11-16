import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Oseba } from '../_models/oseba';


@Injectable({
  providedIn: 'root'
})

export class SharedService {
  // glej tu: https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
  // in tu: https://coryrylan.com/blog/angular-observable-data-services
  private _upnMenuSelectableSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly currentUpnMenuSelectable: Observable<boolean> = this._upnMenuSelectableSource.asObservable();
  //! prej  
  // private upnSharedOsebasSource = new BehaviorSubject([]);
  // currentUpnSharedOsebas = this.upnSharedOsebasSource.asObservable();
  //! sedaj
  private _upnSharedOsebasSource: BehaviorSubject<Oseba[]> = new BehaviorSubject<Oseba[]>([]);
  public readonly currentUpnSharedOsebas: Observable<Oseba[]> = this._upnSharedOsebasSource.asObservable();

  // metodo kličem od drugod
  changeMessage(upnMenuSelectable: boolean) {
    this._upnMenuSelectableSource.next(upnMenuSelectable);
  }

  //! prej
  // changeSharedOsebas(upnSharedOsebas: Oseba[]) {
  //   this.upnSharedOsebasSource.next(upnSharedOsebas);
  // }

  //! sedaj
  changeSharedOsebas(upnSharedOsebas: Oseba[]) {
    this._upnSharedOsebasSource.next(upnSharedOsebas);
  }
}
