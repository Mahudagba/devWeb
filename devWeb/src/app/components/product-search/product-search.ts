import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss'
})
export class ProductSearch {
@Output() searchChange = new EventEmitter<string>();
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // attend 300ms après que l'utilisateur a fini de taper
        distinctUntilChanged() // évite les requêtes répétées
      )
      .subscribe((query) => {
        this.searchChange.emit(query?.trim() || '');
      });
  }
}
