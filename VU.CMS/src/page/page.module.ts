import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [
        NotfoundComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule
    ],
    exports: [
        NotfoundComponent
    ]
})
export class PageModule { }
