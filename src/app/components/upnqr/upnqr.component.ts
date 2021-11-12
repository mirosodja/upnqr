import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Oseba } from 'src/app/_models/oseba';
import { DataService } from 'src/app/_services/data.service';
import { SharedService } from 'src/app/_services/shared.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
// glej tudi tu kakako je naredil https://stackoverflow.com/questions/53246489/how-to-use-filesaver-in-angular-5-correctly

@Component({
  selector: 'app-upnqr',
  templateUrl: './upnqr.component.html',
  styleUrls: ['./upnqr.component.css']
})
export class UpnqrComponent implements OnInit {

  selectedOsebas = {};
  hideDl = true;

  constructor(
    private sharedService: SharedService,
    private dataService: DataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.sharedService.currentUpnSharedOsebas.subscribe(selectedOsebas => {
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
      .subscribe(data => {
        saveAs(data, fileName);
        this.hideDl = true;
      });
  }

  createJsZip(): void {
    this.hideDl = false;
    const jszip = new JSZip();
    this.selectedOsebas.forEach((oseba: Oseba, index: number) => {
      this.dataService
        .getPdf4Zip(oseba, 'pdfUpnQr4stream2zip')
        .subscribe(data => {
          const fileName = oseba.imePlacnik.replace(/ /g, '') + '.pdf';
          jszip.file(fileName, data);
          if (index === this.selectedOsebas.length - 1) {
            jszip.generateAsync({ type: 'blob' }).then(content => {
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
