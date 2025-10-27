import { Component } from '@angular/core';
import { OrdresService } from '../../../services/ordres-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-detail',
  imports: [CommonModule,FormsModule],
  templateUrl: './orders-detail.html',
  styleUrl: './orders-detail.scss'
})
export class OrdersDetail {
 order: any;
  loading = true;
  error = '';
  statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
  selectedStatus = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrdresService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);
    }
  }

  loadOrder(id: string) {
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.selectedStatus = this.order.status;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement commande', err);
        this.error = 'Impossible de charger la commande.';
        this.loading = false;
      },
    });
  }

  updateStatus() {
    if (this.selectedStatus === this.order.status) return;

    this.orderService.updateOrderStatus(this.order.id, this.selectedStatus).subscribe({
      next: (updated) => {
        alert('Statut mis à jour avec succès ');
        this.order = updated;
      },
      error: (err) => {
        console.error('Erreur mise à jour statut', err);
        alert('Erreur lors de la mise à jour du statut ');
      },
    });
  }

  goBack() {
    this.router.navigate(['/admin/orders']);
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payée';
      case 'shipped': return 'Expédiée';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  }
}
