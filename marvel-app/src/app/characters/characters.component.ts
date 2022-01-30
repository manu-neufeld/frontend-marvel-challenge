import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MarvelService } from '../marvel.service'
import { Observable, Subject  } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { MarvelCharacterModel } from '../marvel.model';
import {MatDialog} from '@angular/material/dialog'
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  
  allHeroes: MarvelCharacterModel[] = [];
  displayedColumns!: string[];
  allHeroesNames!: string[];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  heroCtrl = new FormControl();
  selectableHeroes: Subject<string[]> = new Subject();
  dropDownNames!: string[]
  selectedHeroes: string[] = [];

  filteredHeroes: MarvelCharacterModel[] = [];

  @ViewChild('heroInput') heroInput!: ElementRef<HTMLInputElement>;

  constructor(
    public MarvelService: MarvelService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.MarvelService.getAll().subscribe(data=> {
      this.allHeroes = data;
      this.filteredHeroes = this.allHeroes;
    })
    this.displayedColumns = Object.keys(this.allHeroes[0]);
    this.allHeroesNames = getFields(this.allHeroes, "nameLabel");
    this.dropDownNames = this.allHeroesNames;
    
    this.heroCtrl.valueChanges.pipe(
      startWith(null),
      map((hero: string | null) => (hero ? this.filter(hero) : this.dropDownNames.slice())),
    ).subscribe(this.selectableHeroes);
  }

  openDialog(heroName: string) {
    this.dialog.open(ModalComponent, {
      data: this.MarvelService.getByName(heroName)
    });
  }

  remove(hero: string): void {
    const index = this.selectedHeroes.indexOf(hero);
    if (index >= 0) {
      this.selectedHeroes.splice(index, 1);
    }

    //filter the table with the hero removed
    let length = this.filteredHeroes.length;
    if (length > 1) {
      this.filteredHeroes.splice(this.filteredHeroes.findIndex(item => item.nameLabel === hero), 1)
    } else if (length = 1) {
      this.filteredHeroes = this.allHeroes
    }
    this.dropDownNames.push(hero);
    this.dropDownNames = this.dropDownNames.sort();
    this.selectableHeroes.next(this.dropDownNames);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // Filter the table with the hero selected
    if (this.selectedHeroes.length == 0) {
      this.filteredHeroes = [];
    }
    this.selectedHeroes.push(event.option.viewValue);
    let i = this.selectedHeroes.length -1;
    let lastSelected = this.selectedHeroes[i];
    const [first] = this.allHeroes.filter(hero => hero.nameLabel === lastSelected);
    this.filteredHeroes.push(first);

    // Clean autocomplete value
    this.heroInput.nativeElement.value = '';
    this.heroCtrl.setValue(null);

    // Remove name dropbox list
    let nameIndex = this.dropDownNames.indexOf(event.option.viewValue);
    this.dropDownNames.splice(nameIndex, 1);
    this.selectableHeroes.next(this.dropDownNames);
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allHeroesNames.filter(hero => hero.toLowerCase().includes(filterValue));
  }

  sortData(sort: Sort) {
    const data = this.filteredHeroes.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredHeroes = data;
      return;
    }
    this.filteredHeroes = data.sort((a, b) => {
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

function getFields(input: any[], field: string) {
  var output = [];
  for (var i=0; i < input.length ; ++i)
      output.push(input[i][field]);
  return output;
}