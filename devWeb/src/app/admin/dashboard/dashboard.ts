import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatsService } from '../../services/stats-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(private statsService: StatsService) { }
  statsFromApi: any;
  stats: any[] = [];
    loading = true;
  error: string | null = null;

  ngOnInit() {
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.statsFromApi = data;

        this.stats = [
          { title: 'Produits', value: this.statsFromApi?.totalProducts, icon: 'bi bi-box-seam', color: 'primary' },
          { title: 'Commandes', value: this.statsFromApi?.totalOrders, icon: 'bi bi-cart-check', color: 'success' },
          { title: 'Utilisateurs', value: this.statsFromApi?.totalUsers, icon: 'bi bi-people', color: 'info' },
          { title: 'Catégories', value: this.statsFromApi?.totalCategories, icon: 'bi bi-tags', color: 'warning' },
          { title: 'Revenus', value: `€${this.statsFromApi?.totalRevenue}`, icon: 'bi bi-currency-dollar', color: 'success' },
          { title: 'Commandes en attente', value: this.statsFromApi?.pendingOrders, icon: 'bi bi-clock', color: 'warning' },
          { title: 'Commandes annulées', value: this.statsFromApi?.cancelledOrders, icon: 'bi bi-x-circle', color: 'danger' },
          { title: 'Taux de réalisation', value: this.statsFromApi?.completionRate, icon: 'bi bi-check-circle', color: 'success' },
        ];
        this.loading = false;
      }, error: (err) => {
        console.error('Erreur lors du chargement des statistiques', err);
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
      }
    });
  }

}
