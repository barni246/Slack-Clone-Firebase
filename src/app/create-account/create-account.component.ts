import { Component, inject } from '@angular/core';
import { Firestore, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { NgForm } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { AccountService } from '../account.service';
import { collection } from 'firebase/firestore';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
  loggedIn!: boolean;
  isEmailExist: boolean = false;
  isPasswordExist: boolean = false;
  isName: boolean = false;
  isValidName = true;
  isValidEmail = true;
  isValidPassword = true;
  user = new User();
 
  namePattern: RegExp = /^[a-zA-Z\süöäßÜÖÄ]*$/;
  emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  isChecked: boolean = false;

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' },
    ],
  };

  firestore: Firestore = inject(Firestore);

  ngOnInit(): void {
  }

  constructor(public accountService: AccountService) {

    const lastBooleanIndex = this.accountService.currentBoolean.length - 1;
    const lastUserIndex = this.accountService.currentUser.length - 1;
  
    if (lastBooleanIndex >= 0) {
      const lastBoolean = this.accountService.currentBoolean[lastBooleanIndex];
      this.isName = lastBoolean.isName;
      this.isValidEmail = lastBoolean.isValidName;
      this.isValidPassword = lastBoolean.isValidPassword;
      this.isPasswordExist = lastBoolean.isPasswordExist;
      this.isEmailExist = lastBoolean.isEmailExist;
      this.isValidEmail = lastBoolean.isValidEmail;
      this.isChecked = lastBoolean.isChecked;
    }
  
    if (lastUserIndex >= 0) {
      const lastUser = this.accountService.currentUser[lastUserIndex];
      this.user.name = lastUser.name;
      this.user.email = lastUser.email;
      this.user.password = lastUser.password;
       
    }
    this.checkUserEmail();
    this.checkUserPassword();
    this.checkUserName();
   
  }


  checkIntro() {
    this.accountService.isIntro = false;
  }

  async saveUser(userForm: NgForm) {
    if (this.isName &&
      !this.isEmailExist &&
      !this.isPasswordExist) { // 
      const collRef = collection(this.firestore, "user");
      const newUserDocRef = doc(collRef);
      await setDoc(newUserDocRef, {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        loggedIn: false,
        profile: this.user.profile
      });
      userForm.resetForm();
      this.isValidName = true;
      this.isValidEmail = true;
      this.isValidPassword = true;
      this.isChecked = false;

    }
  }


  async getUsers() {
    const collRef = collection(this.firestore, "user");
    const querySnapshot = await getDocs(collRef);
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as User;
      const userId = doc.id;
      console.log('User ID:', userId);
      console.log('User Data:', userData);
    });
  }


  async checkUserEmail() {
    
    const collRef = collection(this.firestore, "user");
    const querySnapshot = await getDocs(collRef);
    if(!querySnapshot.empty)
    this.isEmailExist = querySnapshot.docs.some((doc) => {
      const userData = doc.data() as User;
      return userData.email === this.user.email;
    });

    if (this.user.email === '' || !this.emailPattern.test(this.user.email) || this.isEmailExist) {
      this.isValidEmail = true;
    } else {
      this.isValidEmail = false;
    }
  }


  async checkUserPassword() {
    const collRef = collection(this.firestore, "user");
    const querySnapshot = await getDocs(collRef);
    this.isPasswordExist = querySnapshot.docs.some((doc) => {
      const userData = doc.data() as User;
      return userData.password === this.user.password;
    });

    if (this.user.password === '' || !this.passwordPattern.test(this.user.password) || this.isPasswordExist) {
      this.isValidPassword = true;
    } else {
      this.isValidPassword = false;
    }
  }


  checkUserName() {
    this.isName = this.namePattern.test(this.user.name);
    if (this.user.name === '' || !this.isName) {
      this.isValidName = true;
    } else {
      this.isValidName = false;
    }
  }



  saveCurrentUser() {

    let currentUser = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    };
    let currentBoolean = {
      isName: this.isName,
      isValidName: this.isValidEmail,
      isValidPassword: this.isValidPassword,
      isPasswordExist: this.isPasswordExist,
      isEmailExist: this.isEmailExist,
      isValidEmail: this.isValidEmail,
      isChecked: this.isChecked
    };
    this.accountService.currentUser.push(currentUser);
    this.accountService.currentBoolean.push(currentBoolean);

  }





}
