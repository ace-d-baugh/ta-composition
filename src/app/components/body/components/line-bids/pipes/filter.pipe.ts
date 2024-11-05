// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    const searchTerms = searchTerm.toLowerCase().split(' ');
    return items.filter(item => {
      const pattern = item.Pattern.toLowerCase();
      return searchTerms.every(term => pattern.includes(term));
    });
  }

}