import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { NgIconsModule } from '@ng-icons/core';
import { NgIconComponent, provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { bootstrapInfoCircle, bootstrapXCircle } from '@ng-icons/bootstrap-icons';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(CommonModule, NgIconsModule.withIcons({ bootstrapInfoCircle, bootstrapXCircle })),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
}).catch((err) => console.error(err));