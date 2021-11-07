import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Banka } from 'src/app/_models/banka';
import { Oseba } from 'src/app/_models/oseba';
import { DataService } from 'src/app/_services/data.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [MessageService]
})
export class TableComponent implements OnInit {

  bankas: Banka[] = []
  cols: { field: string; header: string; }[] = [];
  osebas: Oseba[] = [];
  oseba: Oseba | undefined;
  // ! za CRUD
  displayDialogEdit: boolean = false; // prikaže menu za urejanje
  displayEditableField = 'all'; // kateri polja prikažem za urejanje
  newOseba: boolean = false;
  selectedOseba: Oseba | undefined; // izbrana oseba, ki jo urejam
  selectedOsebas: Oseba[] = []; // izbrana populacija v tabeli

  dt22 = '';
  @ViewChild('dt')
  private table: Table | undefined;

  constructor(private dataService: DataService, private storageMap: StorageMap, private messageService: MessageService, private primengConfig: PrimeNGConfig) { }


  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.storageMap.keys().subscribe({
      next: (key) => {
        this.storageMap.get(key).subscribe((oseba: any): void => {
          // console.log({ oseba });
          oseba.id = key;
          this.osebas[this.osebas.length] = oseba;
        });
      },
      complete: () => {
        // return this.osebas;
        // console.log('Done');
      },
    });

    // setup colons of table
    this.cols = [
      // { field: 'id', header: 'Id' },
      { field: 'imePlacnik', header: 'Plačnik' },
      { field: 'placnik_skupina', header: 'Skupina' },
      { field: 'znesek', header: 'Znesek' },
      { field: 'koda_namena', header: 'Koda namena' },
      { field: 'namen_rok_placila', header: 'Namen plačila' },
      { field: 'prejemnik_IBAN', header: 'TRR' },
      { field: 'prejemnik_referenca', header: 'Referenca' },
      { field: 'imePrejemnik', header: 'Prejemnik' },
    ];
  }

  //! paste from Clipboard
  data(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    if (clipboardData) {
      let pastedText = clipboardData.getData('text');
      let row_data = pastedText.split('\n');
      let first_row = row_data[0].split('\t');

      if (row_data[row_data.length - 1] == "") {
        delete row_data[row_data.length - 1]
      }
      delete row_data[0];
      // firs row has to be removed, header
      if (first_row.length != 8) {
        this.showErrorPaste();
      } else {
        let data: any[] = [];
        let row: string[] = [];
        let rowObject = {};
        let oseba: Oseba;
        row_data.forEach((value) => {
          row = value.split('\t');
          row.forEach((value, key) => {
            rowObject = _.fromPairs([[this.cols[key].field, value]]);
            data.push(rowObject);
          });
          oseba = Object.assign({}, ...data);
          this.insertNewRecord(oseba);
        });
      }
    }
  }

  //! editField
  editField(colfield: string): void {
    this.displayEditableField = colfield;
    // this.newOseba = false;
    // this.oseba = {};
    // this.displayDialogEdit = true;
  }

  //! showErrorPaste
  showErrorPaste() {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Napaka pri vstavljanju podatkov - ni 8 kolon!' });
  }

  //!  insertNewRecord
  insertNewRecord(oseba: Oseba): void {
    this.osebas.splice(this.osebas.length, 0, oseba);
    this.storageMap
      .set(oseba.imePlacnik, oseba)
      .subscribe(() => { });
  }


  //! delete record
  delete(): void {
    const index = this.osebas.indexOf(this.selectedOseba!);
    this.osebas.splice(index, 1);
    this.storageMap.delete(this.selectedOseba!.imePlacnik).subscribe(() => { });
    this.selectedOseba = undefined;
    this.oseba = undefined;
    this.displayDialogEdit = false;
  }

  //! delete osebas
  deleteSelectedOsebas(): void {
    this.selectedOsebas.forEach((oseba) => {
      this.selectedOseba = oseba;
      this.delete();
    });
    this.selectedOsebas = [];
    this.selectedOseba = undefined;
    if (this.osebas.length === 0) {
      this.resetTable();
    }
  }
  //! add to selected
  add2selectedOsebas() {
    this.selectedOsebas = _.union(
      this.selectedOsebas,
      this.table!.filteredValue
    );
    this.onRowSelect();
  }

  //! invert selection
  invertSelectedOsebas() {
    this.selectedOsebas = _.difference(this.table!.value, this.selectedOsebas);
    this.onRowSelect();
  }

  //! onRowSelect  
  onRowSelect() {
    // this.sharedService.changeMessage(!!this.selectedOsebas.length);
    // this.sharedService.changeSharedOsebas(this.selectedOsebas);
  }

  onRowEdit(rowData: Oseba): void {
    // this.displayEditableField = 'all';
    // this.newOseba = false;
    // this.oseba = this.cloneOseba(rowData);
    // this.selectedOseba = rowData;
    // this.displayDialogEdit = true;
  }

  //! apply filter
  applyFilterGlobal($event: any, stringVal: any) {
    this.table!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  //! reset filter
  resetFilter() {
    this.dt22 = '';
    this.table!.reset();
    // this.table.reset();
  }

  // resetTable
  resetTable() {
    this.dt22 = '';
    this.table!.reset();
    this.selectedOsebas = [];
    this.osebas = [];
    // this.selectedOsebas.length = 0;
    this.storageMap.keys().subscribe({
      next: (key) => {
        this.storageMap.get(key).subscribe((oseba: any): void => {
          oseba.id = key;
          this.osebas[this.osebas.length] = oseba;
        });
      },
      complete: () => {
        // console.log('Done');
      },
    });
  }

  //! show dialog to delete
  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      summary: 'Ali izbrišem ' + this.selectedOsebas.length + ' zapisov?',
      detail: 'Klikni "Da" za izbris',
    });
  }

  onConfirm() {
    this.messageService.clear('c');
    this.deleteSelectedOsebas();
  }

  onReject() {
    this.messageService.clear('c');
  }

  //! end show dialog to delete

  //! go to page callUpnQr
  callUpnQr() {
  }
}
