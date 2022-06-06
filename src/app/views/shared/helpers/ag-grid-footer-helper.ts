import { RowNode } from "ag-grid-community";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AgGridFooterHelperService {
  generatePinnedBottomData(customGridApi, gridApi, columnName, ...columns) {
    console.log('customGridApi: ', customGridApi);
    console.log('gridApi: ', gridApi);
    // generate a row-data with null values
    const result = {};

    customGridApi.getAllGridColumns().forEach(item => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(gridApi, result, columnName, ...columns);
  }

  calculatePinnedBottomData(gridAPI, target: any, columnName, ...columns) {

    // console.log(target);
    // **list of columns fo aggregation**
    const columnsWithAggregation = [...columns]
    columnsWithAggregation.forEach(element => {
      console.log('element', element);
      gridAPI.forEachNodeAfterFilter(
        (rowNode: RowNode) => {
          console.log('RowNode: ', rowNode);
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
    console.log(target);
    return target;
  }
}
