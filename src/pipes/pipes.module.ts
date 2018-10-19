import { NgModule } from '@angular/core';
import { MomentFromNowPipe } from './moment-from-now/moment-from-now';
import { ToDatePipe } from './to-date/to-date';
@NgModule({
	declarations: [MomentFromNowPipe,
    ToDatePipe],
	imports: [],
	exports: [MomentFromNowPipe,
    ToDatePipe]
})
export class PipesModule {}
