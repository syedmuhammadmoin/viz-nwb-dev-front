import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
  name: 'treeFilter',
  pure: false
})
@Injectable()
export class TreeFilter implements PipeTransform {

  /**
     * @param items object from array
     * @param term term's search
     */
  transform(items: any, term: string): any {
    if (!term || !items) return items;
    return TreeFilter.filter(items['data'], term);
  }

  /**
   *
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   *
   */
  static filter(items: Array<{ [key: string]: any }>, term: string): Array<{ [key: string]: any }> {

    const toCompare = term.toLowerCase();

    function checkInside(item: any, term: string) {
      
      if (typeof item === "string" && item.toString().toLowerCase().includes(toCompare)) {
        return true;
      }

      for (let property in item) {
        if (item[property] === null || item[property] == undefined) {
          continue;
        }
        if (typeof item[property] === 'object') {
          if (checkInside(item[property], term)) {
            return true;
          }
        }
        else if (item[property].toString().toLowerCase().includes(toCompare)) {
          return true;
        }
      }
      return false;
    }

    return items.filter(function (item) {
      return checkInside(item, term);
    });
  }
}