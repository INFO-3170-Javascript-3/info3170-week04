import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Product } from './product/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductDialogResult } from './product-dialog/product-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

const getObservable = (collection: AngularFirestoreCollection<Product>) => {
  const subject = new BehaviorSubject<Product[]>([]);
  collection.valueChanges({idField: 'id'}).subscribe((val: Product[]) => {
   subject.next(val);
  });
  return subject
};

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

  products = getObservable(this.store.collection('products')) as Observable<Product[]>;
  wishList = getObservable(this.store.collection('wishList')) as Observable<Product[]>;
  shoppingCart = getObservable(this.store.collection('shoppingCart')) as Observable<Product[]>;

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
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
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
