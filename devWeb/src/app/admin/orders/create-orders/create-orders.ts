import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product-service';
import { UserService } from '../../../services/user-service';
import { OrdresService } from '../../../services/ordres-service';

@Component({
  selector: 'app-create-orders',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './create-orders.html',
  styleUrl: './create-orders.scss'
})
export class CreateOrders {
  orderForm!: FormGroup;
  users: any[] = [];
  products: any[] = [];
  items: any[] = [];
  total: number = 0;
  loading = false;
  selectedProductId: string = '';


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrdresService) { }

  ngOnInit() {
    this.orderForm = this.fb.group({
      user_id: ['', Validators.required],
      status: ['pending', Validators.required]
    });

    this.loadUsers();
    this.loadProducts();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: res => this.users = res,
      error: err => console.error('Erreur chargement users', err)
    });
  }

  loadProducts() {
    this.productService.getProducts(true).subscribe({
      next: res => this.products = res,
      error: err => console.error('Erreur chargement produits', err)
    });
  }

  addProduct() {
    if (!this.selectedProductId) return;

    const product = this.products.find(p => p.id == this.selectedProductId);
    const exists = this.items.find(i => i.product.id == product.id);

    if (exists) {
      exists.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }

    this.selectedProductId = '';
    this.updateTotal();
  }

  removeProduct(index: number) {
    this.items.splice(index, 1);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  }

  createOrder() {
    this.loading = true;
    const data = {
      user_id: this.orderForm.value.user_id,
      status: this.orderForm.value.status,
      total: this.total,
      items: this.items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity
      }))
    };

    this.orderService.createOrderByAdmin(data).subscribe({
      next: res => {
        alert('Commande créée avec succès !');
        this.items = [];
        this.orderForm.reset({ status: 'pending' });
        this.total = 0;
        this.loading = false;

      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la création de la commande');
        this.loading = false;

      }
    });
  }

  checkDisableButton():boolean{
    if(this.loading){
      return this.loading;}
   return this.orderForm.invalid || this.items.length === 0;
  }
}
