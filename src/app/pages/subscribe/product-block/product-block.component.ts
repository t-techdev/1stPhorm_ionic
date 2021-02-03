import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../services/in-app-purchase/products';

@Component({
  selector: 'app-product-block',
  templateUrl: './product-block.component.html',
  styleUrls: ['./product-block.component.scss'],
})
export class ProductBlockComponent implements OnInit {

  @Input() selected = false;
  @Input() product: Product = null;
  @Input() bestValue = false;

  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  choose() {
    this.click.emit();
  }
}
