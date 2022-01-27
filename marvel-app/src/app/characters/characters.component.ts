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
  
  elementData: any[] = [];
  displayedColumns!: string[];
  allFruits!: string[];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Ahab'];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  constructor(public MarvelService: MarvelService) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  ngOnInit(): void {
    this.MarvelService.getAll().subscribe(data=> {
      this.elementData = data      
    })
    this.displayedColumns = Object.keys(this.elementData[0]);
    this.allFruits = getFields(this.elementData, "nameLabel");
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
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

function getFields(input: any[], field: string) {
  var output = [];
  for (var i=0; i < input.length ; ++i)
      output.push(input[i][field]);
  return output;
}