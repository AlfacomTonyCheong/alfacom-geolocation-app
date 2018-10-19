import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
/**
 * Generated class for the MomentFromNowPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'momentFromNow',
})
export class MomentFromNowPipe implements PipeTransform {
  transform(value: string, ...args) {
    return moment(value).fromNow();
  }
}

