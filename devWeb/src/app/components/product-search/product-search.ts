import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss'
})
export class ProductSearch {
@Output() searchChange = new EventEmitter<string>();
  // searchControl = new FormControl('');

  searchForm: FormGroup;



  constructor(private fb: FormBuilder) {

    this.searchForm = this.fb.group({
      searchControl: new FormControl('')
    });
    this.searchForm.get('searchControl')?.valueChanges
      .pipe(
        debounceTime(300), // attend 300ms après que l'utilisateur a fini de taper
        distinctUntilChanged() // évite les requêtes répétées
      )
      .subscribe((query) => {
        this.searchChange.emit(query?.trim() || '');
      });
  }
}
