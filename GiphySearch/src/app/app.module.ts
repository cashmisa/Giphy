import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {ResultComponent} from './components/result.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {GiphyService} from './components/giphy.service';
import {PanelComponent} from './components/panel.component';
import {RouterModule, Routes} from '@angular/router';
import {NavAccountComponent} from './components/nav-account.component';
import { NavSearchComponent } from './components/nav-search.component';
import {AccountService} from './components/account.service';

const ROUTES: Routes = [
  {path: '', component: NavSearchComponent},
  {path: 'account', component: NavAccountComponent},
  {path: 'account/:userEmail', component: NavAccountComponent},
  {path: '**', redirectTo: ''},
];


@NgModule({
  declarations: [
    AppComponent,
    NavSearchComponent,
    ResultComponent,
    PanelComponent,
    NavAccountComponent,
    NavSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [GiphyService, AccountService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
