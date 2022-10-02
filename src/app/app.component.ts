import { Component } from '@angular/core';
import { Product } from './product/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  products: Product[] = [
    {
      name: 'Product 1',
      description: 'Description 1'
    }
  ]


}
