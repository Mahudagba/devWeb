import { Component } from '@angular/core';
import { OrdresService } from '../../../services/ordres-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.scss'
})
export class OrdersList {
 orders: any[] = [];
  loading = true;
  error = '';

  constructor(private orderService: OrdresService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  viewOrder(id: number) {
  this.router.navigate(['/admin/orders', id]);
}

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes', err);
        this.error = 'Impossible de charger les commandes.';
        this.loading = false;
      },
    });
  }

  deleteOrder(id:number){
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          alert('Commande supprimé');
          this.loadOrders();
        },
        error: (err) => alert('Erreur : ' + err.message)
      });
    }
  }
  navigateToCreateOrder(){
    this.router.navigate(['/admin/orders-create']);
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'paid':
        return 'Payée';
      case 'shipped':
        return 'Expédiée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  }
}
