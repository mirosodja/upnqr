import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Kodanamena } from '../_models/kodanamena';
import { Oseba } from '../_models/oseba';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = '../api-upnqr/';
  // private baseUrl = 'http://localhost:5000/api-upnqr/';
  // private baseUrl = 'https://potep.in/api-upnqr/';
  constructor(private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      alert('ERROR: ' + error.status + '!');
      return throwError('Page not found!');
    }

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      alert('An error occurred: ' + error.error.message);
      console.error('An error occurred: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      alert(`UPN ERROR! Backend returned error code ${error.status}`);
      console.error(
        `UPN ERROR! Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private handleComplete() {
    return true;
  }

  getKodaNamena(): Observable<Kodanamena[]> {
    return this.http
      .get<Kodanamena[]>('./assets/data/codeDefinition.json')
      .pipe(catchError(this.handleError));
  }

  getPdf(osebas: Oseba[], actionUrl: string): Observable<Blob> {
    return this.http
      .post(this.baseUrl + actionUrl, osebas, {
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError));
  }

  getPdf4Zip(oseba: Oseba, actionUrl: string): Observable<Blob> {
    return this.http
      .post(this.baseUrl + actionUrl, oseba, {
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError));
  }

}
