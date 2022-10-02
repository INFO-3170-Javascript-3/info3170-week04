import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../product/product';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {

  private backupProduct: Partial<Product> = {...this.data.product};

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.data.product.name = this.backupProduct.name;
    this.data.product.description = this.backupProduct.description;
    this.data.product.pictureUrl = this.backupProduct.pictureUrl;
    this.dialogRef.close();
  }

}

export interface ProductDialogData {
  product: Partial<Product>;
  enableDelete: boolean;
}

export interface ProductDialogResult {
  product: Product;
  delete?: boolean;
}