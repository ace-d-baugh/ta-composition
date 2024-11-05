import { Component } from '@angular/core';
import { LineBidsComponent } from "./components/line-bids/line-bids.component";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [LineBidsComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}
