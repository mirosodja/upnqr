import { Component, OnInit } from '@angular/core';
import { Banka } from 'src/app/_models/banka';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  bankas: Banka[] = []
  cols: { field: string; header: string; }[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getBanka().subscribe((bankas: Banka[]) => { this.bankas = bankas });

    this.cols = [
      { field: 'idBank', header: 'idBank' },
      { field: 'nazivBank', header: 'nazivBank' },
      { field: 'naslovBank', header: 'naslovBank' },
      { field: 'bicKoda', header: 'bicKoda' }
  ];
  }

}
