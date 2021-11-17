import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Oseba } from 'src/app/_models/oseba';
import { DataService } from 'src/app/_services/data.service';
import { SharedService } from 'src/app/_services/shared.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PrimeNGConfig } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
// glej tudi tu kakako je naredil https://stackoverflow.com/questions/53246489/how-to-use-filesaver-in-angular-5-correctly

@Component({
  selector: 'app-upnqr',
  templateUrl: './upnqr.component.html',
  styleUrls: ['./upnqr.component.css']
})
export class UpnqrComponent implements OnInit {

  selectedOsebas: Oseba[] = [];
  hideDl = true;

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private datePipe: DatePipe,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.sharedService.currentUpnSharedOsebas.subscribe((selectedOsebas: Oseba[]) => {
      this.selectedOsebas = selectedOsebas;
    });
  }

  // prenost PDF
  createUpnPdf(): void {
    this.hideDl = false;
    const currDate = new Date();
    const fileName =
      'upn_' + this.datePipe.transform(currDate, 'yyyyMMdd_T_HHmm') + '.pdf';
    this.dataService
      .getPdf(this.selectedOsebas, 'pdfUpnQrPrint')
      .subscribe((data: Blob) => {
        saveAs(data, fileName);
        this.hideDl = true;
      });
  }

  // glej tu mogoče za rešitev, da downloada vse: https://github.com/Stuk/jszip/issues/442 

  createJsZip(): void {
    this.hideDl = false;
    const jszip = new JSZip();
    let counter: number = 0;
    this.selectedOsebas.forEach((oseba: Oseba) => {
      this.dataService
        .getPdf4Zip(oseba, 'pdfUpnQr4stream2zip')
        .subscribe((data: Blob) => {
          const fileName = oseba.imePlacnik.replace(/ /g, '') + '.pdf';
          jszip.file(fileName, data);
          counter++;
          if (counter === this.selectedOsebas.length) {
            jszip.generateAsync({ type: 'blob' }).then((content: Blob): void => {
              const currDate = new Date();
              const fileName =
                'upn_' +
                this.datePipe.transform(currDate, 'yyyyMMdd_T_HHmm') +
                '.zip';
              saveAs(content, fileName);
              this.hideDl = true;
            });
          }
        });
    });
  }

}
