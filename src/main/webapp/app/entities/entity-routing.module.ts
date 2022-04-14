import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'client',
        data: { pageTitle: 'coopCycleJHipsterApp.client.home.title' },
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'livreur',
        data: { pageTitle: 'coopCycleJHipsterApp.livreur.home.title' },
        loadChildren: () => import('./livreur/livreur.module').then(m => m.LivreurModule),
      },
      {
        path: 'commercant',
        data: { pageTitle: 'coopCycleJHipsterApp.commercant.home.title' },
        loadChildren: () => import('./commercant/commercant.module').then(m => m.CommercantModule),
      },
      {
        path: 'cooperative',
        data: { pageTitle: 'coopCycleJHipsterApp.cooperative.home.title' },
        loadChildren: () => import('./cooperative/cooperative.module').then(m => m.CooperativeModule),
      },
      {
        path: 'commande',
        data: { pageTitle: 'coopCycleJHipsterApp.commande.home.title' },
        loadChildren: () => import('./commande/commande.module').then(m => m.CommandeModule),
      },
      {
        path: 'paiement',
        data: { pageTitle: 'coopCycleJHipsterApp.paiement.home.title' },
        loadChildren: () => import('./paiement/paiement.module').then(m => m.PaiementModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
