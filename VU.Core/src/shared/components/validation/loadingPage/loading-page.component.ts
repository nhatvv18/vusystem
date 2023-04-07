import { Component } from '@angular/core';

@Component({
    selector: 'app-loading-page',
    template: `
    <div class="splash-screen" class="z-5">
        <div class="spinner custom-spinner">
            <span class="ball-1"></span>
            <span class="ball-2"></span>
            <span class="ball-3"></span>
            <span class="ball-4"></span>
            <span class="ball-5"></span>
            <span class="ball-6"></span>
            <span class="ball-7"></span>
            <span class="ball-8"></span>
        </div>
    </div>
    `
})
export class LoadingPageComponent {

}
