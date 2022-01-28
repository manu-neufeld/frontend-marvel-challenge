import { Observable, of } from 'rxjs';
import characters from '../assets/wikipedia_marvel_data.json';
import {MarvelCharacterModel} from './marvel.model';

export class MarvelService {

    elementData: MarvelCharacterModel[] = [];
    
    constructor () {
        this.elementData = characters;
    }

    getAll() : Observable<MarvelCharacterModel[]> {
        return of(this.elementData);
    };

    getByName(name: string): MarvelCharacterModel | null {
        let hero = null;
        for (let x=0; x<this.elementData.length; x++){
            if (this.elementData[x].nameLabel === name) {
                hero = this.elementData[x];
                break;
            }
        };
        return hero;
    }
}