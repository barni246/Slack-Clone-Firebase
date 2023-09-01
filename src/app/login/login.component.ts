import { Component } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isIntro = true;

  constructor( public accountService: AccountService ) {
     this.isIntro = accountService.isIntro;
  }
  
  checkIntro() {
    this.isIntro = false;
  }
}
