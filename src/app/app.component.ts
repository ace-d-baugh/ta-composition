import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { BodyComponent } from "./components/body/body.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    HeaderComponent, 
    BodyComponent,
    FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieService) { }
  title = 'TA - Composition';

  ngOnInit(): void {
    let futureTime = new Date();
    futureTime.setMinutes(futureTime.getMinutes() + 30);
    if(this.cookieService.get('sessionTimer') === null) {
      this.cookieService.set('sessionTimer', futureTime.toISOString(), futureTime);
    }
  }
}
