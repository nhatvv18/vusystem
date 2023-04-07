import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { RootModule } from './root.module';

if (environment.production) {
    enableProdMode();
}

const bootstrap = async () => {
    try {
        return await platformBrowserDynamic().bootstrapModule(RootModule);
    } catch (err) {
        return console.error(err);
    }
};

bootstrap();