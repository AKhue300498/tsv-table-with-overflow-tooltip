import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener } from '@angular/material/tree';
import { FlatTableDataSource } from './datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  generate100Categories,
  generateDataForPerformanceTesting,
  generateHugeDataset,
  generateLargeDataset,
  main,
} from './generator';
import { LazyOverflowTooltipDirective } from './tooltip-advance.directive';

// Interface for the original nested data structure
interface NestedTableNode {
  name: string;
  category: string;
  price?: number;
  quantity?: number;
  status?: string;
  children?: NestedTableNode[];
}

// Interface for the flattened table node
interface FlatTableNode {
  expandable: boolean;
  name: string;
  category: string;
  price: number | null;
  quantity: number | null;
  status: string;
  level: number;
}

// Sample nested data for the table
const NESTED_TABLE_DATA: NestedTableNode[] = [
  {
    name: 'Electronics',
    category: 'Category',
    status: 'Active',
    children: [
      {
        name: 'Smartphones',
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'iPhone 14',
            category: 'Product',
            price: 999,
            quantity: 50,
            status: 'In Stock',
          },
          {
            name: 'Samsung Galaxy S23',
            category: 'Product',
            price: 899,
            quantity: 30,
            status: 'In Stock',
          },
          {
            name: 'Google Pixel 7',
            category: 'Product',
            price: 699,
            quantity: 0,
            status: 'Out of Stock',
          },
          {
            name: 'OnePlus 11',
            category: 'Product',
            price: 749,
            quantity: 25,
            status: 'In Stock',
          },
          {
            name: 'Xiaomi 13',
            category: 'Product',
            price: 599,
            quantity: 12,
            status: 'Low Stock',
          },
        ],
      },
      {
        name: 'Laptops',
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'MacBook Pro 16"',
            category: 'Product',
            price: 2499,
            quantity: 15,
            status: 'In Stock',
          },
          {
            name: 'Dell XPS 13',
            category: 'Product',
            price: 1299,
            quantity: 25,
            status: 'In Stock',
          },
          {
            name: 'ThinkPad X1 Carbon',
            category: 'Product',
            price: 1599,
            quantity: 8,
            status: 'Low Stock',
          },
          {
            name: 'HP Spectre x360',
            category: 'Product',
            price: 1199,
            quantity: 20,
            status: 'In Stock',
          },
          {
            name: 'Surface Laptop 5',
            category: 'Product',
            price: 1399,
            quantity: 18,
            status: 'In Stock',
          },
        ],
      },
      {
        name: 'Tablets',
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'iPad Pro 12.9"',
            category: 'Product',
            price: 1099,
            quantity: 22,
            status: 'In Stock',
          },
          {
            name: 'Samsung Galaxy Tab S8',
            category: 'Product',
            price: 699,
            quantity: 15,
            status: 'In Stock',
          },
          {
            name: 'Surface Pro 9',
            category: 'Product',
            price: 999,
            quantity: 0,
            status: 'Out of Stock',
          },
        ],
      },
    ],
  },
  {
    name: 'Clothing',
    category: 'Category',
    status: 'Active',
    children: [
      {
        name: "Men's Clothing",
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'T-Shirts',
            category: 'Product',
            price: 25,
            quantity: 100,
            status: 'In Stock',
          },
          {
            name: 'Jeans',
            category: 'Product',
            price: 79,
            quantity: 45,
            status: 'In Stock',
          },
          {
            name: 'Jackets',
            category: 'Product',
            price: 149,
            quantity: 12,
            status: 'Low Stock',
          },
          {
            name: 'Polo Shirts',
            category: 'Product',
            price: 35,
            quantity: 60,
            status: 'In Stock',
          },
          {
            name: 'Chinos',
            category: 'Product',
            price: 65,
            quantity: 28,
            status: 'In Stock',
          },
        ],
      },
      {
        name: "Women's Clothing",
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'Dresses',
            category: 'Product',
            price: 89,
            quantity: 35,
            status: 'In Stock',
          },
          {
            name: 'Blouses',
            category: 'Product',
            price: 59,
            quantity: 22,
            status: 'In Stock',
          },
          {
            name: 'Shoes',
            category: 'Product',
            price: 129,
            quantity: 0,
            status: 'Out of Stock',
          },
          {
            name: 'Skirts',
            category: 'Product',
            price: 45,
            quantity: 40,
            status: 'In Stock',
          },
          {
            name: 'Sweaters',
            category: 'Product',
            price: 75,
            quantity: 30,
            status: 'In Stock',
          },
        ],
      },
    ],
  },
  {
    name: 'Books',
    category: 'Category',
    status: 'Active',
    children: [
      {
        name: 'Fiction',
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'The Great Gatsby',
            category: 'Product',
            price: 15,
            quantity: 75,
            status: 'In Stock',
          },
          {
            name: '1984',
            category: 'Product',
            price: 18,
            quantity: 60,
            status: 'In Stock',
          },
          {
            name: 'To Kill a Mockingbird',
            category: 'Product',
            price: 16,
            quantity: 45,
            status: 'In Stock',
          },
          {
            name: 'Pride and Prejudice',
            category: 'Product',
            price: 14,
            quantity: 50,
            status: 'In Stock',
          },
        ],
      },
      {
        name: 'Non-Fiction',
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'Sapiens',
            category: 'Product',
            price: 22,
            quantity: 40,
            status: 'In Stock',
          },
          {
            name: 'Atomic Habits',
            category: 'Product',
            price: 20,
            quantity: 55,
            status: 'In Stock',
          },
          {
            name: 'The 7 Habits',
            category: 'Product',
            price: 18,
            quantity: 35,
            status: 'In Stock',
          },
          {
            name: 'Think and Grow Rich',
            category: 'Product',
            price: 17,
            quantity: 42,
            status: 'In Stock',
          },
        ],
      },
      {
        name: 'Technical',
        category: 'Subcategory',
        status: 'Active',
        children: [
          {
            name: 'Clean Code',
            category: 'Product',
            price: 45,
            quantity: 25,
            status: 'In Stock',
          },
          {
            name: 'Design Patterns',
            category: 'Product',
            price: 55,
            quantity: 15,
            status: 'Low Stock',
          },
          {
            name: 'Refactoring',
            category: 'Product',
            price: 50,
            quantity: 20,
            status: 'In Stock',
          },
        ],
      },
    ],
  },
];

@Component({
  selector: 'app-nested-table',
  imports: [
    MatTableModule,
    MatPaginator,
    MatSort,
    CommonModule,
    // TableVirtualScrollModule,
    // LazyOverflowTooltipDirective,
    // CdkVirtualScrollViewport,
    // ScrollingModule,
    MatFormFieldModule,
    LazyOverflowTooltipDirective,
  ],
  standalone: true,
  template: `
    <div class="table-container">
      <h2>Angular Material Table with Nested Data</h2>
      <input
        (keyup)="search($event)"
        placeholder="Search by name, category, or status..."
      />
      <div class="mat-elevation-8">
        <table mat-table [dataSource]="dataSource" class="nested-table">
          <!-- Name Column with Tree Structure -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td
              mat-cell
              *matCellDef="let element"
              [style.padding-left.px]="element.level * 20 + 16"
              class="name-cell"
            >
              <button
                mat-icon-button
                *ngIf="element.expandable"
                matTreeNodeToggle
                (click)="toggleNode(element)"
                [attr.aria-label]="'Toggle ' + element.name"
              ></button>
              <span *ngIf="!element.expandable" class="spacer"></span>

              <mat-icon
                class="category-icon"
                [ngClass]="{
                  category: element.category === 'Category',
                  subcategory: element.category === 'Subcategory',
                  product: element.category === 'Product',
                }"
              >
                {{ getCategoryIcon(element.category) }}
              </mat-icon>

              <span class="element-name" appLazyOverflowTooltip>{{
                element.name
              }}</span>
            </td>
          </ng-container>

          <!-- Category Column -->
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let element">
              <span
                class="category-badge"
                [ngClass]="element.category.toLowerCase()"
              >
                {{ element.category }}
              </span>
            </td>
          </ng-container>

          <!-- Price Column -->
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let element">
              <span *ngIf="element.price !== null" class="price">
                \${{ element.price | number: '1.2-2' }}
              </span>
              <span *ngIf="element.price === null" class="no-data">-</span>
            </td>
          </ng-container>

          <!-- Quantity Column -->
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Quantity</th>
            <td mat-cell *matCellDef="let element">
              <span
                *ngIf="element.quantity !== null"
                class="quantity"
                [ngClass]="{
                  'low-stock': element.quantity > 0 && element.quantity <= 15,
                  'out-of-stock': element.quantity === 0,
                }"
              >
                {{ element.quantity }}
              </span>
              <span *ngIf="element.quantity === null" class="no-data">-</span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let element">
              <span
                class="status-badge"
                [ngClass]="getStatusClass(element.status)"
              >
                {{ element.status }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            [ngClass]="{
              'category-row': row.category === 'Category',
              'subcategory-row': row.category === 'Subcategory',
              'product-row': row.category === 'Product',
            }"
          ></tr>
        </table>
      </div>

      <div class="table-actions">
        <button mat-raised-button color="primary" (click)="expandAll()">
          Expand All
        </button>
        <button mat-raised-button color="accent" (click)="collapseAll()">
          Collapse All
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .table-container {
        max-width: 1200px;
        margin: 20px;
      }

      .nested-table {
        width: 100%;
      }

      .name-cell {
        display: flex;
        align-items: center;
        min-height: 48px;
      }

      .spacer {
        width: 40px;
      }

      .category-icon {
        margin-right: 8px;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .category-icon.category {
        color: #4caf50;
      }

      .category-icon.subcategory {
        color: #ff9800;
      }

      .category-icon.product {
        color: #2196f3;
      }

      .element-name {
        font-weight: 500;
      }

      .category-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .category-badge.category {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .category-badge.subcategory {
        background-color: #fff3e0;
        color: #ef6c00;
      }

      .category-badge.product {
        background-color: #e3f2fd;
        color: #1565c0;
      }

      .price {
        font-weight: 600;
        color: #2e7d32;
      }

      .quantity {
        font-weight: 500;
      }

      .quantity.low-stock {
        color: #ff9800;
      }

      .quantity.out-of-stock {
        color: #f44336;
      }

      .no-data {
        color: #9e9e9e;
        font-style: italic;
      }

      .status-badge {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-badge.in-stock {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .status-badge.low-stock {
        background-color: #fff8e1;
        color: #f57c00;
      }

      .status-badge.out-of-stock {
        background-color: #ffebee;
        color: #c62828;
      }

      .status-badge.active {
        background-color: #e8f5e8;
        color: #2e7d32;
      }

      .category-row {
        background-color: #f5f5f5;
        font-weight: 600;
      }

      .subcategory-row {
        background-color: #fafafa;
      }

      .product-row {
        background-color: white;
      }

      .mat-row:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .table-actions {
        margin-top: 16px;
        display: flex;
        gap: 12px;
      }

      h2 {
        color: #333;
        margin-bottom: 20px;
      }

      .mat-icon-button {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class NestedTableComponent {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'status',
  ];

  private _transformer = (
    node: NestedTableNode,
    level: number,
  ): FlatTableNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      category: node.category,
      price: node.price || null,
      quantity: node.quantity || null,
      status: node.status || '',
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatTableNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new FlatTableDataSource<
    NestedTableNode,
    FlatTableNode,
    FlatTableNode
  >([], this.treeControl, this.treeFlattener);

  constructor() {
    let data = generate100Categories();
    console.log(data);
    this.dataSource.data = data;
  }

  toggleNode(node: FlatTableNode): void {
    this.treeControl.toggle(node);
  }

  isExpanded(node: FlatTableNode): boolean {
    return this.treeControl.isExpanded(node);
  }

  expandAll(): void {
    this.treeControl.expandAll();
  }

  collapseAll(): void {
    this.treeControl.collapseAll();
  }

  search(event: any) {
    this.dataSource.filter = event.target.value;
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Category':
        return 'folder';
      case 'Subcategory':
        return 'folder_open';
      case 'Product':
        return 'inventory_2';
      default:
        return 'help';
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}
