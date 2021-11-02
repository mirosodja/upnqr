import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Banka } from 'src/app/_models/banka';
import { Oseba } from 'src/app/_models/oseba';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  bankas: Banka[] = []
  cols: { field: string; header: string; }[] = [];
  osebas: Oseba[] = [];

  constructor(private dataService: DataService, private storageMap: StorageMap) { }

  ngOnInit(): void {


    this.dataService.getBanka().subscribe((bankas: Banka[]) => { this.bankas = bankas });
    this.storageMap.keys().subscribe({
      next: (key) => {
        this.storageMap.get(key).subscribe((oseba: any): void => {
          console.log(oseba);
          oseba.id = key;
          this.osebas[this.osebas.length] = oseba;
        });
      },
      complete: () => {
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

}
