import { Component } from '@angular/core';
import { OrderModel } from '../../models/cart.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { animate, state, style, transition, trigger } from '@angular/animations';




@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
  animations: [ // le trigger doit être ici
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
  
})
export class Orders  {
  expandedOrderId: number | null = null;

  constructor(private authService: AuthService) {}
  orders: OrderModel[] = [];
  ngOnInit() {
     this.authService.getUserOrders().subscribe( {
      next:( orders:any) =>{
        this.orders = orders;
        console.log('Orders: ',orders);
      },
      error:(error) =>{
        console.error('Erreur lors de la connexion',error);
      }
  });
  }

  toggleOrder(id: number) {
    this.expandedOrderId = this.expandedOrderId === id ? null : id;
  }

  cancelOrder(order: OrderModel) {
    if (order.status === 'paid') return;
    order.status = 'cancelled';
    this.authService.cancelOrder(order.id).subscribe( {
      next:() =>{
        console.log('Order cancelled: ',order);
        alert(`Commande #${order.id} annulée`);
      },
      error:(error) =>{
        console.error('Erreur lors de l\'annulation de la commande',error);
      }
  })  ;
    
  }

  getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'status-pending';
    case 'paid':
      return 'status-paid';
    case 'shipped':
      return 'status-shipped';
    case 'completed':
      return 'status-completed';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
}}
