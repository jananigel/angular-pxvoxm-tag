import { Pipe, PipeTransform, Input } from '@angular/core';

@Pipe({
  name: 'autoComplete'
})
export class AutoCompletePipe implements PipeTransform {

  transform(
    data: any[],
    searchText = '',
    fields: string[] = [],
    keywordLength: number = 0,
  ): any {

    if (searchText.length < keywordLength) {
      return null;
    }

    if (!data || !searchText || !fields.length) {
      return data;
    }
    
    const response = data.filter(item => {
      if (this.analysisDataField(item, fields)
            .toUpperCase()
            .indexOf(searchText.toUpperCase()) !== -1
      ) {
        return item.firstName;
      }
    });

    return response.length > 0 ? response : null;
  }

  private analysisDataField(item: any, fields: string[]) {
    return fields.filter(field => !!item[field]).map(field => item[field]).join('');
  }


}
