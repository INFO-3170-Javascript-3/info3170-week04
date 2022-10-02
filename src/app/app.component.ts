import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Product } from './product/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductDialogResult } from './product-dialog/product-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore
  ) {}

  products = this.store.collection('products').valueChanges(
    {
      idField: 'id'
    }
  ) as Observable<Product[]>;

  wishList = this.store.collection('wishList').valueChanges(
    {
      idField: 'id'
    }
  ) as Observable<Product[]>;

  shoppingCart = this.store.collection('shoppingCart').valueChanges(
    {
      idField: 'id'
    }
  ) as Observable<Product[]>;

  editProduct(list: 'shoppingCart' | 'wishList' | 'products', product: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '270px',
      data: {
        product,
        enableDelete: true
      }
    });
    dialogRef.afterClosed().subscribe((result:ProductDialogResult|undefined)=>{
      if(!result) {
        return;
      }
      if (result.delete) {
        this.store.collection(list).doc(product.id).delete();
      } else {
        this.store.collection(list).doc(product.id).update(product);
      }
    })
  }

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
        this.store.collection('products').add(result.product);
      })
  }

  drop(event: CdkDragDrop<Product[]|null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(()=>{
      console.log('runnning transaction');
      console.log('previous container data', event.previousContainer.data);
      console.log('container data', event.container.data);
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      console.log(promise);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

}
