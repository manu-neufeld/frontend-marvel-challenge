import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
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

  ngOnInit(): void {
    this.elementData = characters;
    this.displayedColumns = Object.keys(this.elementData[0]);
  }

    sortData(sort: Sort) {
      const data = this.elementData.slice();
      if (!sort.active || sort.direction === '') {
        this.elementData = data;
        return;
      }

      this.elementData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'citizenshipLabel':
            return compare(a.citizenshipLabel, b.citizenshipLabel, isAsc);
          case 'creatorLabel':
            return compare(a.creatorLabel, b.creatorLabel, isAsc);
          case 'genderLabel':
            return compare(a.genderLabel, b.genderLabel, isAsc);
          case 'memberOfLabel':
            return compare(a.memberOfLabel, b.memberOfLabel, isAsc);
          case 'nameLabel':
            return compare(a.nameLabel, b.nameLabel, isAsc);
          case 'occupationLabel':
            return compare(a.occupationLabel, b.occupationLabel, isAsc);
          case 'skillsLabel':
            return compare(a.skillsLabel, b.skillsLabel, isAsc);
          default:
            return 0;
        }
      });
    }
}
function compare(a: string, b: string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}