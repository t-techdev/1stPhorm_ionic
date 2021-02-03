import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeatureFlagService } from '../../services';

@Directive({
  selector: '[appFeatureFlag]'
})
export class FeatureFlagDirective implements OnInit, OnDestroy {
  @Input() flagValue = true;
  @Input() appFeatureFlag: string;

  private watcher$: Subscription;
  private myView: ViewRef = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private flags: FeatureFlagService,
  ) {
  }

  ngOnInit() {
    this.watcher$ = this.flags.get$(this.appFeatureFlag)
      .subscribe((value) => {
        console.log(this.appFeatureFlag, value, this.flagValue);
        if (value === this.flagValue) {
          if (this.myView) {
            return;
          }
          this.myView = this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          if (this.myView) {
            this.myView.destroy();
          }
        }
      });
  }


  ngOnDestroy() {
    this.watcher$.unsubscribe();
  }
}
