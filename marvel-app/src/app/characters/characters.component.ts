import { Component, OnInit, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MarvelService } from '../marvel.service'
import { Observable } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  
  allHeroes: any[] = [];
  displayedColumns!: string[];
  allHeroesNames!: string[];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  heroCtrl = new FormControl();
  filteredHeroes: Observable<string[]>;
  selectedHeroes: string[] = [];

  @ViewChild('heroInput') heroInput!: ElementRef<HTMLInputElement>;

  constructor(public MarvelService: MarvelService) {
    this.filteredHeroes = this.heroCtrl.valueChanges.pipe(
      startWith(null),
      map((hero: string | null) => (hero ? this.filter(hero) : this.allHeroesNames.slice())),
    );
  }

  ngOnInit(): void {
    this.MarvelService.getAll().subscribe(data=> {
      this.allHeroes = data;
    })
    this.displayedColumns = Object.keys(this.allHeroes[0]);
    this.allHeroesNames = getFields(this.allHeroes, "nameLabel");
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our hero
    if (value) {
      this.selectedHeroes.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.heroCtrl.setValue(null);
  }

  remove(hero: string): void {
    const index = this.selectedHeroes.indexOf(hero);
    if (index >= 0) {
      this.selectedHeroes.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedHeroes.push(event.option.viewValue);
    this.heroInput.nativeElement.value = '';
    this.heroCtrl.setValue(null);
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allHeroesNames.filter(hero => hero.toLowerCase().includes(filterValue));
  }

  sortData(sort: Sort) {
    const data = this.allHeroes.slice();
    if (!sort.active || sort.direction === '') {
      this.allHeroes = data;
      return;
    }
    this.allHeroes = data.sort((a, b) => {
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