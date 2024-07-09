import { RowNode } from "ag-grid-community";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AgGridFooterHelperService {
  generatePinnedBottomData(customGridApi, gridApi, columnName, ...columns) {
    // generate a row-data with null values
    const result = {};

    customGridApi.getAllGridColumns().forEach(item => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(gridApi, result, columnName, ...columns);
  }

  calculatePinnedBottomData(gridAPI, target: any, columnName, ...columns) {

    // **list of columns fo aggregation**
    const columnsWithAggregation = [...columns]
    columnsWithAggregation.forEach(element => {
      gridAPI.forEachNodeAfterFilter(
        (rowNode: RowNode) => {
          if (rowNode.data[element]) {
            target[element] += Number(rowNode.data[element].toFixed(2));
          }
        });
      if (target[element]) {
        target[element] = `${target[element].toFixed(2)}`;
      }
    })
    target[columnName] = 'Total'
    for (var key in target) {
      target[key] = target[key] ? target[key] : ''
    }
    return target;
  }
}
