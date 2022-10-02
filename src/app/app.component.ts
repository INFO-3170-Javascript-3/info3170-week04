import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Product } from './product/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductDialogResult } from './product-dialog/product-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dialog: MatDialog) {}

  products: Product[] = [
    {
      name: 'Product 1',
      description: 'Description 1'
    }
  ];

  wishList: Product[] = [];

  shoppingCart: Product[] = [];

  editProduct(list: string, product: Product): void {}

  newProduct(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '300px',
      data: {
        product: {},
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: ProductDialogResult|undefined)=>{
        if (!result) {
          return;
        }
        this.products.push(result.product);
      })
  }

  drop(event: CdkDragDrop<Product[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

}
