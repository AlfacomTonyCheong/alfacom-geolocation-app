import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ToDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'toDate',
})
export class ToDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: firebase.firestore.Timestamp, ...args) {
    return value.toDate();
  }
}
