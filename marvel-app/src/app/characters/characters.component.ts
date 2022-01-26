import { Component, OnInit } from '@angular/core';
import characters from '../../assets/wikipedia_marvel_data.json';
import {MarvelCharacterModel} from './characters.model'



@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  
  elementData!: MarvelCharacterModel[];
  displayedColumns!: string[]

  constructor() { }
  //dataSource = ELEMENT_DATA;
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  ngOnInit(): void {
    this.elementData = characters;
    this.displayedColumns = Object.keys(this.elementData[0]);
    console.log(Object.keys(this.elementData[0]))
  }

}

// {
//   "nameLabel": "Anya Corazon",
//   "genderLabel": "female",
//   "citizenshipLabel": "United States of America",
//   "skillsLabel": "superhuman strength",
//   "occupationLabel": "student",
//   "memberOfLabel": "The Spider Society",
//   "creatorLabel": "Fiona Avery"
// }
