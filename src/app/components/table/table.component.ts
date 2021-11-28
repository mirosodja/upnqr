import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Oseba } from 'src/app/_models/oseba';
import { DataService } from 'src/app/_services/data.service';
import { SharedService } from 'src/app/_services/shared.service';
import { MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [MessageService]
})
export class TableComponent implements OnInit {

  cols: { field: string; header: string; }[] = [];
  osebas: Oseba[] = [];
  oseba: Oseba = { $id: '', imePlacnik: '' };
  kodasNamen!: SelectItem[];
  // ! za CRUD
  displayDialogEdit: boolean = false; // prikaže menu za urejanje
  displayEditableField = 'all'; // kateri polja prikažem za urejanje
  newOseba: boolean = false;
  selectedOseba: Oseba | undefined; // izbrana oseba, ki jo urejam
  selectedOsebas: Oseba[] = []; // izbrana populacija v tabeli

  dt22: string = '';
  @ViewChild('dt')
  private table: Table | undefined;

  constructor(private dataService: DataService, private sharedService: SharedService, private storageMap: StorageMap, private messageService: MessageService, private primengConfig: PrimeNGConfig) { }


  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.storageMap.keys().subscribe({
      next: (key: string) => {
        this.storageMap.get(key).subscribe((oseba: any): void => {
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

    //! gumb options
    this.dataService.getKodaNamena().subscribe((data) => {
      this.kodasNamen = _.map(data, (item) =>
        _.assign({ label: item.Koda, value: item.Koda })
      );
      this.kodasNamen.splice(0, 0, { label: 'Ni kode', value: '' });
    });

    this.sharedService.currentUpnSharedOsebas.subscribe((selectedOsebas: Oseba[]) => {
      this.selectedOsebas = selectedOsebas;
    });
  }

  ngAfterContentInit() {
    if (!localStorage.getItem('AlreadyHere')) {
      setTimeout(() => {
        this.showCookiesInfo();
      }, 200);
      localStorage.setItem('AlreadyHere', 'Yes!');
    }
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
            if (this.cols[key].field == 'znesek') {
              if (value != "") {
                value = parseFloat(value.replace(/\./g, '').replace(',', '.')).toString();
              }
              else {
                value = "0.00"
              }
              if (isNaN(+value)) {
                value = "0.00"
              }
            }
            rowObject = _.fromPairs([[this.cols[key].field, value]]);
            data.push(rowObject);
          });
          oseba = Object.assign({}, ...data);
          // if (!oseba.znesek) {
          //   oseba.znesek = 0.00;
          // }
          this.insertNewRecord(oseba);
        });
      }
    }
  }

  //! editField
  editField(colfield: string): void {
    this.displayEditableField = colfield;
    this.newOseba = false;
    this.oseba = { $id: '', imePlacnik: '' };
    this.displayDialogEdit = true;
  }

  //! showErrorPaste
  showErrorPaste() {
    this.messageService.add({ key: 'error_clipboard', severity: 'error', summary: 'Error', detail: 'Napaka pri vstavljanju podatkov - ni 8 kolon!' });
  }

  //!  insertNewRecord
  insertNewRecord(oseba: Oseba): void {
    this.osebas.splice(0, 0, oseba);
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
    this.oseba = { $id: '', imePlacnik: '' };
    this.displayDialogEdit = false;
  }

  // ! Add row - button Dodaj
  showDialogToAdd() {
    this.displayEditableField = 'all';
    this.newOseba = true;
    this.oseba = { $id: '', imePlacnik: '' };
    this.displayDialogEdit = true;
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
    this.sharedService.changeMessage(!!this.selectedOsebas.length);
    this.sharedService.changeSharedOsebas(this.selectedOsebas);
  }

  onRowEdit(rowData: Oseba): void {
    this.displayEditableField = 'all';
    this.newOseba = false;
    this.oseba = this.cloneOseba(rowData);
    this.selectedOseba = rowData;
    this.displayDialogEdit = true;
  }

  cloneOseba(c: Oseba): Oseba {
    const oseba = { ...c };
    return oseba;
  }

  //! apply filter
  applyFilterGlobal($event: any, stringVal: any) {
    this.table!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  //! reset filter
  resetFilter() {
    this.dt22 = '';
    this.table!.reset();
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
      key: 'confirm_delete',
      sticky: true,
      severity: 'warn',
      summary: 'Ali izbrišem ' + this.selectedOsebas.length + ' zapisov?',
      detail: 'Klikni "Da" za izbris',
    });
  }

  onConfirm() {
    this.messageService.clear();
    this.deleteSelectedOsebas();
  }

  onReject() {
    this.messageService.clear();
  }

  //! end show dialog to delete

  //! go to page callUpnQr
  callUpnQr() {
  }

  //! show cookie info
  showCookiesInfo() {
    this.messageService.add({
      key: 'custom',
      severity: 'info',
      summary: 'O piškotkih',
      detail:
        'Analitičnih piškotkov ne uporabljamo. V brskalnik zabeležimo prvi obisk.<br /><br />Uporabljamo IndexedDB, zato so vsi podatki na vašem računalniku.<br /><br />Več si preberite v <a href="./help"><b>Help</b></a>',
      closable: true,
      life: 20000,
    });
  }

  //! v inputu spremeni digitalni zapis z vejico v digitalni zapis s piko
  numberInputChanged(value: string) {
    const num = value.replace('.', '').replace(',', '.');
    // let num = num1.replace(',', '.');
    return Number(num);
  }

  //! prepare data to save
  prepare4save(): void {
    if (this.displayEditableField === 'all') {
      // če shranjujem eno, enostavno shranim
      this.save();
    } else {
      // ko jih je več povečam referenco za ena, če je SI12
      const key: string = this.displayEditableField;
      const rows: Oseba[] = this.selectedOsebas;
      const oseba2change: any = this.oseba; // to spreminjam v dialgog boxu v fieldu
      _.each(rows, (row: any, keyRows: number) => {
        let value: string = oseba2change[key];
        if (key === 'prejemnik_referenca' && value && value.substr(0, 4) == "SI12") {
          if (value.length > 17) {
            value = value.substr(0, 17);
          }
          const rightString: Number =
            Number(value.substr(5, value.length - 5)) + keyRows;
          value = value.substr(0, 4) + ' ' + rightString.toString();
        }
        row[key] = value;
        this.save(row);
      });
    }
    this.displayDialogEdit = false;
  }

  save(oseba?: Oseba): void {
    const osebas = [...this.osebas];
    if (oseba) {
      this.oseba = oseba;
    }
    if (this.oseba!.prejemnik_referenca) {
      if (this.oseba!.prejemnik_referenca.startsWith('SI12')) {
        this.oseba!.prejemnik_referenca = this.calcControlNumber11(
          this.oseba!.prejemnik_referenca
        );
      }
    }
    // insert record
    if (this.newOseba) {
      osebas.splice(0, 0, this.oseba!);
      this.storageMap
        .set(this.oseba!.imePlacnik, this.oseba)
        .subscribe(() => { });
      // udpate record
    } else {
      osebas[this.osebas.indexOf(this.selectedOseba!)] = this.oseba!;
      this.storageMap
        .set(this.oseba!.imePlacnik, this.oseba)
        .subscribe(() => { });
    }

    this.osebas = osebas;
    this.selectedOseba = undefined;
    this.oseba = { $id: '', imePlacnik: '' };
  }
  // izracun kontrolne številke po modulu 11
  calcControlNumber11(referenca: string): string {
    let i = 0;
    let sestevek = 0;
    let ponder = 2;
    let stevka = 0;
    let s: string;
    if (referenca.length <= 12) {
      s = referenca.substring(5, referenca.length);
    } else {
      s = referenca.substring(5, 17);
    }
    let controlSum = null;
    for (i = s.length; i >= 1; i--) {
      stevka = Number(s.substr(i - 1, 1));
      if (0 <= stevka && stevka <= 9 && sestevek >= 0) {
        sestevek = sestevek + ponder * stevka;
        ponder = ponder + 1;
      }
    }
    controlSum = 11 - (sestevek % 11);

    if (controlSum === 11) {
      controlSum = 0;
    }

    if (controlSum === 10) {
      controlSum = 0;
    }
    referenca = 'SI12 ' + this.insertZeros(s) + controlSum.toString();
    return referenca;
  }

  // vstavi nule, default size=12
  insertZeros(input: string, size?: number) {
    const zero = (size ? size : 12) - input.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + input;
  }

}
