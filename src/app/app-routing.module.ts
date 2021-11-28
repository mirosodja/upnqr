import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './components/help/help.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PravnoComponent } from './components/pravno/pravno.component';
import { TableComponent } from './components/table/table.component';
import { UpnqrComponent } from './components/upnqr/upnqr.component';

const routes: Routes = [{ path: '', component: TableComponent },
{ path: 'upnqr', component: UpnqrComponent },
{ path: 'help', component: HelpComponent },
{path:'pravno', component: PravnoComponent},
{ path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
