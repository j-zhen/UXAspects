import { SliderModule } from './components/slider/slider.module';
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

@NgModule({
  imports: [
    BrowserModule,
    SliderModule,
    RouterModule.forRoot([
      {
        path: '**',
        component: HomeComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
