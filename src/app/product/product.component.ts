import { 
  Component, 
  OnInit,
  Input,
  Output,
  EventEmitter
 } from '@angular/core';
import { Product } from './product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() product: Product|null = null;
  @Output() edit = new EventEmitter<Product>();

}
