import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { BehaviorSubject, of } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';

export class FlatTableDataSource<T, F>
  extends MatTableDataSource<F>
  implements FlatTableDataSource<T, F>
{
  private _treeControl;
  private _treeFlattener;
  private readonly _flattenedData;
  private readonly _expandedData;
  constructor(
    public treeControl: FlatTreeControl<F, F>,
    public treeFlattener: MatTreeFlattener<T, F, F>,
    initialData: F[],
  ) {
    super(initialData);
    this._treeControl = treeControl;
    this._treeFlattener = treeFlattener;
  }

  expand(node: F) {
    this._treeControl.expand(node);
  }

  collapse(node: F) {
    this._treeControl.collapse(node);
  }
}
