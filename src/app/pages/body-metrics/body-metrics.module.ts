import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BodyMetricsPage } from './body-metrics.page';
import { ChartModule } from '../../components/chart/chart.module';
import { CustomizeMetricsComponent } from './components/customize-metrics/customize-metrics.component';
import { InfoCustomizeComponent } from './popovers/info-customize/info-customize.component';
import { MetricRecordComponent } from './components/metric-record/metric-record.component';
import { MetricListComponent } from './components/metric-list/metric-list.component';
import { WeighInListComponent } from './components/weigh-in-list/weigh-in-list.component';
import { CheckMetricTypeGuard } from './guards/check-metric-type/check-metric-type.guard';
import { CommonHelperService } from './services/common-helper/common-helper.service';
import { TimelineFilterComponent } from './components/timeline-filter/timeline-filter.component';
import { InfoBodyMetricComponent } from './popovers/info-body-metric/info-body-metric/info-body-metric.component';
import { ConvertUnitModule } from '../../pipes/convert-unit/convert-unit.module';

const routes: Routes = [
  {path: '', component: BodyMetricsPage},
  {path: 'customize', component: CustomizeMetricsComponent},
  {path: 'list/weigh-ins', component: WeighInListComponent},
  {path: 'list/:metricType', component: MetricListComponent, canActivate: [CheckMetricTypeGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChartModule,
    ConvertUnitModule
  ],
  declarations: [
    BodyMetricsPage,
    CustomizeMetricsComponent,
    InfoCustomizeComponent,
    MetricRecordComponent,
    MetricListComponent,
    WeighInListComponent,
    TimelineFilterComponent,
    InfoBodyMetricComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [InfoCustomizeComponent, InfoBodyMetricComponent],
  providers: [CommonHelperService]
})
export class BodyMetricsPageModule {
}
