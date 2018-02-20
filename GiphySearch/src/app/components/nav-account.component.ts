import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AccountService} from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './nav-account.component.html',
  styleUrls: ['./nav-account.component.css']
})
export class NavAccountComponent implements OnInit {

  @ViewChild('loginForm')
  loginForm: NgForm;

  userEmail: string = this.AccountSrv.userEmail || null;
  isLoggedIn: boolean = this.AccountSrv.isLoggedIn || null;

  constructor(private AccountSrv: AccountService) {
  }

  ngOnInit() {  }

  logIn() {
    this.isLoggedIn = this.AccountSrv.isLoggedIn = true;
    this.userEmail = this.AccountSrv.userEmail = this.loginForm.value.userEmail;
    this.AccountSrv.loginEvent.next();
  }

  logOut() {
    this.isLoggedIn = this.AccountSrv.isLoggedIn = false;
    this.userEmail = this.AccountSrv.isLoggedIn = null;
    this.AccountSrv.logoutEvent.next();
  }

}
