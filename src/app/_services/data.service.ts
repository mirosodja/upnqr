import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Banka } from '../_models/banka';


@Injectable({
  providedIn: 'root'
})
export class DataService {

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

  getBanka(): Observable<Banka[]> {
    return this.http
      .get<Banka[]>('./assets/data/bankCode.json')
      .pipe(catchError(this.handleError));
  }


}
