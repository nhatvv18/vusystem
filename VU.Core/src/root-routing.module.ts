import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { NotfoundComponent } from './page/notfound/notfound.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule), // Lazy load account module
        data: { preload: true }
    },
    {
        path: '',
        loadChildren: () => import('./app/app.module').then(m => m.AppModule), // Lazy load app module
        data: { preload: true }
    },
    { path: '**', component: NotfoundComponent },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
    providers: [AppComponent]
})
export class RootRoutingModule { }
