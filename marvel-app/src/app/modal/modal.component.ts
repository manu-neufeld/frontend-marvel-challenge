import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CharactersComponent } from '../characters/characters.component';
import { MarvelCharacterModel } from '../marvel.model';
import { MarvelService } from '../marvel.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  nameClicked!: string;

  constructor(
    public MarvelService: MarvelService,
    @Inject(MAT_DIALOG_DATA) public data: MarvelCharacterModel) { }

  ngOnInit(): void {};
}
