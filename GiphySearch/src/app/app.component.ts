import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from './components/account.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  userEmail: string;
  totalCount: number;

  private loginSub: Subscription;
  private logoutSub: Subscription;
  private saveSub: Subscription;
  private removeSub: Subscription;

  readonly SEARCH_ICON = '/assets/search.png';
  readonly ACCOUNT_ICON = '/assets/account.png';
  readonly SAVED_ICON = '/assets/favorite.png';

  constructor(private accountSrv: AccountService) {
  }

  ngOnInit(): void {
    this.loginSub = this.accountSrv.loginEvent.subscribe(
      () => {
        this.isLoggedIn = this.accountSrv.isLoggedIn;
        this.userEmail = this.accountSrv.userEmail;
        this.accountSrv.getSavedImagesEvent.next(this.userEmail);
        this.accountSrv.getSavedImageCountsEvent.subscribe(
          (data) => {
            this.totalCount = data;
          });
      });

    this.logoutSub = this.accountSrv.logoutEvent.subscribe(
      () => {
        this.isLoggedIn = this.accountSrv.isLoggedIn;
        this.userEmail = this.accountSrv.userEmail;
      });

    this.saveSub = this.accountSrv.SaveAnImageEvent.subscribe(
      () => {
        this.totalCount = ++this.accountSrv.savedCount;
      });
    this.removeSub = this.accountSrv.RemoveAnImageEvent.subscribe(
      () => {
        this.totalCount = --this.accountSrv.savedCount;
      });
  }

  showSavedImages() {
      this.accountSrv.getSavedImagesEvent.next(this.userEmail);
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
    this.logoutSub.unsubscribe();
    this.saveSub.unsubscribe();
    this.removeSub.unsubscribe();
  }
}
