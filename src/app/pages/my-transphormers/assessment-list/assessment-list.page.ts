import { AdvisorService, AssessmentData } from './../../../services/advisor/advisor.service';
import { NavController, Events } from '@ionic/angular';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'advisor-assessment-list',
  templateUrl: './assessment-list.page.html',
  styleUrls: ['./assessment-list.page.scss'],
})
export class AssessmentListPage implements OnDestroy {

  public assessmentsData: AssessmentData[] = [];
  public assessment: any;
  public viewUnreviewedItemsOnly: boolean;
  public tabState = 'unreviewed';
  public pageLoaded: boolean;
  private end = 50;
  private updates$: Subscription;

  constructor(
    public advisorService: AdvisorService,
    public navCtrl: NavController,
    public router: Router,
    public events: Events
  ) {

    this.viewUnreviewedItemsOnly = true;

    this.assessmentsData = [];
    this.pageLoaded = false;
    this.loadAllSinceLastUpdate()
      .then(() => {
        this.updates$ = this.advisorService.advisorAssessmentUpdates().subscribe(
          (update) => {
            const updateable = this.assessmentsData.findIndex((sc) => {
              return sc.id === update.id;
            });
            if (updateable !== -1) {
              this.assessmentsData.splice(updateable, 1, update);
            } else {
              this.assessmentsData.splice(0, 0, update);
            }
          });
      });

    this.events.subscribe('filter:changed', (lastTabState) => {
      this.tabState = lastTabState;
      this.viewUnreviewedItemsOnly = this.tabState === 'unreviewed';

    });

    this.events.subscribe('assessment-list:update', (assessmentId: number, reviewed: boolean) => {
      const assessmentIndex = this.assessmentsData
        .findIndex(a => a.id === assessmentId);
      const assessment = this.assessmentsData[assessmentIndex];
      assessment.reviewed = reviewed ? 1 : 0;
      this.assessmentsData.splice(assessmentIndex, 1, assessment);
    });

  }

  /**
   * ion-refresher callback event (on page swipe down).
   * @param event the event object
   */
  reloadFeed(event: any) {
    this.loadAllSinceLastUpdate().then(() => {
      event.target.complete();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('filter:changed');
    this.events.unsubscribe('assessment-list:update');
    this.updates$.unsubscribe();
  }

  /**
   * segmentChanged callback function
   * @param event the event
   */
  segmentChanged(event: any) {
    if (event !== undefined && event.detail.value === 'unreviewed') {
      this.viewUnreviewedItemsOnly = true;
      this.tabState = 'unreviewed';
    } else {
      this.viewUnreviewedItemsOnly = false;
      this.tabState = 'all';
    }
    this.end = 50;
  }

  public async loadAllSinceLastUpdate() {
    return this.advisorService.transphormerAssessments()
      .then((results) => {
        this.assessmentsData = results;
        this.pageLoaded = true;
      });
  }

  get visibleAssessments(): AssessmentData[] {
    return this.assessmentsData.filter((item) => {
      return this.viewUnreviewedItemsOnly ? item.reviewed === 0 : true;
    })
      .sort((a, b) => a.created_at > b.created_at ? 1 : -1)
      .slice(0, this.end);
  }

  get unreviewedItemsQty() {
    return this.assessmentsData.filter(item => item.reviewed === 0).length;
  }

  /**
   * Redirects the app to the individual assessment detail view
   * @param assmt the assessment object
   */
  public openAssessmentDetail(assmt: any) {

    this.router.navigate([`advisor-assessment-detail/${assmt.id}`], {
      queryParams: {
        displayName: assmt.transphormer.display_name,
        weekStart: assmt.week_start,
        weekEnd: assmt.week_end,
        transphormerId: assmt.transphormer.id,
        listFilter: this.tabState
      },
    });

  }

  public loadMoreAssessments(event) {
    if (this.pageLoaded && (this.end + 50) > this.assessmentsData.length) {
      this.end = this.assessmentsData.length;
    } else {
      this.end += 50;
    }
    event.target.complete();
  }

}
