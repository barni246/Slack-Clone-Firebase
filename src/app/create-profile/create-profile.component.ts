import { Component } from '@angular/core';
import { User } from 'src/models/user.class';
import { AccountService } from '../account.service';
import { Location, LocationChangeEvent } from '@angular/common';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent {
  user = new User();
  imageUrl: string | null = null;
  constructor(private accountService: AccountService,private location: Location) {
   
  }

  private storage = getStorage();


  uploadImage(event: any) {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.then(snapshot => {
      // Upload abgeschlossen
      getDownloadURL(snapshot.ref).then(url => {
        this.imageUrl = url;
      }).catch(error => {
        console.error('Fehler beim Abrufen der Download-URL:', error);
      });
    }).catch(error => {
      console.error('Fehler beim Hochladen der Datei:', error);
    });
  }
  
  
  
  checkIntro() {
      this.accountService.isIntro = false;
  }
  
  goBack() {
       this.location.back();
     }
  
     goForward() {
     this.location.forward();
   }
  
   ngOnInit(): void {
  }
}
