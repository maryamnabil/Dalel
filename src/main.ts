import { importProvidersFrom, inject } from '@angular/core';
import { AppComponent } from './app/app.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  provideHttpClient,
  HttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { TranslationService } from './app/shared/services/translation.service';
import { MatDialogModule } from '@angular/material/dialog';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { loaderInterceptor } from './app/core/interceptors/loader.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) =>
            new TranslateHttpLoader(http, './assets/translations/', '.json'),
          deps: [HttpClient],
        },
      }),
      MatDialogModule
    ),
    TranslationService,
    provideAnimations(),
    provideHttpClient(withInterceptors([loaderInterceptor, errorInterceptor])),
  ],
}).catch((err) => console.error(err));
