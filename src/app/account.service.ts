import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser: any = [];
  currentBoolean: any = [];
  isIntro = true;



  constructor() { }
}
