import { SliderModule } from './components/slider/slider.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ColorService } from './services/color/color.service';

@NgModule({
  imports: [
    BrowserModule,
    SliderModule,
    FormsModule,
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
  providers: [ColorService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
