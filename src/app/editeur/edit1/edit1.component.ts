import { Component, OnInit, Input } from '@angular/core';
import { CV } from 'src/app/models/CV';
import { Liens } from 'src/app/models/Liens';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit1',
  templateUrl: './edit1.component.html',
  styleUrls: ['./edit1.component.scss'],
})
export class Edit1Component implements OnInit {
  @Input() monCV: CV;
  isCollapsed = true;
  isCollapsedcordonnee = true;
  isCollapsedliens = true;
  isCollapsedhobby = true;

  name: string;
  prenom: string;
  email: string;
  phone: string;
  adresse: string;
  aboutMe: string;
  nationalite: string;
  etatCivil: string;
  dateNaissance: Date;

  nameError: string;
  prenomError: string;
  emailError: string;
  phoneError: string;
  adresseError: string;
  nationaliteError: string;
  etatCivilError: string;
  dateNaissanceError: string;
  imageUrl: string = '../../../assets/image_placeholder.jpg';

  tabbleauHobby = [];
  Hobby: any[] = [];
  inputValueHobby: string;

  ajouterForm(tab) {
    tab.push({});
  }
  varnull: string = '';
  varnull1: string = '';
  varnull2: string = '';
  varnull3: string = '';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    if (!this.monCV.urlImage) {
      this.convertImageToBuffer(
        'http://localhost:4200/assets/image_placeholder.jpg'
      );
    }

    if (this.monCV.liens.length === 0) {
      this.monCV.liens.push(new Liens('Linkedin', ''));
      this.monCV.liens.push(new Liens('Github', ''));
      this.monCV.liens.push(new Liens('Behance', ''));
      this.monCV.liens.push(new Liens('website', ''));
    }
  }

  convertImageToBuffer(imageUrl: string): void {
    this.http
      .get(imageUrl, { responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        const base64Image = btoa(
          new Uint8Array(data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        this.monCV.urlImage = `data:image/jpeg;base64,${base64Image}`;
      });
  }
  addHobby(input: any) {
    const foundObj = this.monCV.loisirs.find(
      (obj) => obj === input.target.value
    );
    if (foundObj) {
      input.target.value = '';
    } else {
      event.preventDefault(); // prevent the default form submission behavior
      if (this.monCV.loisirs.indexOf(input.target.value) == -1) {
        this.monCV.loisirs.push(input.target.value);
      }
      input.target.value = '';
    }
  }

  removeHobby(hash: string) {
    const index = this.monCV.loisirs.indexOf(hash);
    if (index !== -1) {
      this.monCV.loisirs.splice(index, 1);
    }
  }
  async addLiens(event: any, name: any) {
    const indexToUpdate = this.monCV.liens.findIndex((obj) => obj.nom === name);
    if (indexToUpdate !== -1) {
      this.monCV.liens[indexToUpdate].nom = name;
      this.monCV.liens[indexToUpdate].url = await event;
    }
  }
  onFileSelected(event): void {
    const file = event.target.files[0]; // get the selected file
    const reader = new FileReader(); // create a new FileReader object
    reader.readAsDataURL(file); // read the file data as a base64-encoded string
    reader.onload = () => {
      // set the onload event handler
      this.monCV.urlImage = reader.result as string;
    };
  }
}
