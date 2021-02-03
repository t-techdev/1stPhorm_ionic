import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ProfileCompleteGuard } from './guards/profile-complete.guard';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { Unauthenticated } from './guards/unauthenticated.guard';
import { FeatureFlagGuard } from './guards/feature-flag.guard';

export const routes: Routes = [
  // Unauthenticated Routes
  { path: '', canActivate: [Unauthenticated], loadChildren: './pages/login/login.module#LoginPageModule', pathMatch: 'full' },
  { path: 'login', canActivate: [Unauthenticated], loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', canActivate: [Unauthenticated], loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'forgot-password', canActivate: [Unauthenticated], loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'reset-password/:token', canActivate: [Unauthenticated], loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },

  // Authenticated Routes - Allowed if onboarding.
  { path: 'onboarding', canActivate: [IsLoggedInGuard], loadChildren: './pages/onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'choose-advisor', canActivate: [IsLoggedInGuard], loadChildren: './pages/choose-advisor/choose-advisor.module#ChooseAdvisorPageModule' },

  // Authenticated Routes, profile completed.
  { path: 'dashboard', canActivate: [ProfileCompleteGuard], loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'camera', canActivate: [ProfileCompleteGuard], loadChildren: './pages/camera/camera.module#CameraPageModule' },
  { path: 'exercises/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/exercise-view/exercise-view.module#ExerciseViewPageModule' },
  { path: 'workouts', canActivate: [ProfileCompleteGuard], loadChildren: './pages/workouts/workouts.module#WorkoutsPageModule' },
  { path: 'trainer-registration', canActivate: [ProfileCompleteGuard], loadChildren: './pages/trainer-registration/trainer-registration.module#TrainerRegistrationPageModule' },
  { path: 'account-settings', canActivate: [ProfileCompleteGuard], loadChildren: './pages/account-settings/account-settings.module#AccountSettingsPageModule' },
  { path: 'invite', canActivate: [ProfileCompleteGuard], loadChildren: './pages/invite/invite.module#InvitePageModule' },
  { path: 'messages', canActivate: [ProfileCompleteGuard], loadChildren: './pages/messages/messages.module#MessagesPageModule' },
  { path: 'my-transphormers', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/my-transphormers.module#MyTransphormersPageModule' },
  { path: 'body-metrics', canActivate: [ProfileCompleteGuard], loadChildren: './pages/body-metrics/body-metrics.module#BodyMetricsPageModule' },
  { path: 'trainer-messages', canActivate: [ProfileCompleteGuard], loadChildren: './pages/trainer-messages/trainer-messages.module#TrainerMessagesPageModule' },
  { path: 'details/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/details/details.module#DetailsPageModule' },
  { path: 'photos/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/photos/photos.module#PhotosPageModule' },
  { path: 'metrics/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/metrics/metrics.module#MetricsPageModule' },
  { path: 'my-transphormers/:id/nutrition-detail', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/nutrition-detail/nutrition-detail.module#NutritionDetailPageModule' },
  { path: 'live-streaming', canActivate: [ProfileCompleteGuard], loadChildren: './pages/live-streaming/live-streaming.module#LiveStreamingPageModule' },
  { path: 'photo-listing', canActivate: [ProfileCompleteGuard], loadChildren: './pages/photo-listing/photo-listing.module#PhotoListingPageModule' },
  { path: 'trainer-applications', canActivate: [ProfileCompleteGuard], loadChildren: './pages/trainer-applications/trainer-applications.module#TrainerApplicationsPageModule' },
  { path: 'chat-messages/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/chat-messages/chat-messages.module#ChatMessagesPageModule' },
  { path: 'group-messages/:groupName', canActivate: [ProfileCompleteGuard], loadChildren: './pages/chat-messages/chat-messages.module#ChatMessagesPageModule' },
  { path: 'announcements', canActivate: [ProfileCompleteGuard], loadChildren: './pages/announcements/announcements.module#AnnouncementsPageModule' },
  { path: 'trainer-announcements', canActivate: [ProfileCompleteGuard], loadChildren: './pages/trainer-announcements/trainer-announcements.module#TrainerAnnouncementsPageModule' },
  { path: 'info-workout', canActivate: [ProfileCompleteGuard], loadChildren: './pages/info-workout/info-workout.module#InfoWorkoutPageModule' },
  { path: 'info-contact', canActivate: [ProfileCompleteGuard], loadChildren: './pages/info-contact/info-contact.module#InfoContactPageModule' },
  { path: 'info-nutrition', canActivate: [ProfileCompleteGuard], loadChildren: './pages/info-nutrition/info-nutrition.module#InfoNutritionPageModule' },
  { path: 'info-personal', canActivate: [ProfileCompleteGuard], loadChildren: './pages/info-personal/info-personal.module#InfoPersonalPageModule' },
  { path: 'reminders', canActivate: [ProfileCompleteGuard], loadChildren: './pages/reminders/reminders.module#RemindersPageModule' },
  { path: 'notifications', canActivate: [ProfileCompleteGuard], loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },

  // Authenticated Routes - Allowed if onboarding.
  { path: 'password-change', canActivate: [IsLoggedInGuard], loadChildren: './pages/password-change/password-change.module#PasswordChangePageModule' },

  // Macro routes.
  { path: 'macro', canActivate: [ProfileCompleteGuard, FeatureFlagGuard], data: { flag: 'nutrition', value: false, other: 'macro-v2' }, loadChildren: './pages/macro/macro.module#MacroPageModule' },
  { path: 'macro-v2', canActivate: [ProfileCompleteGuard, FeatureFlagGuard], data: { flag: 'nutrition', value: true, other: 'macro' }, loadChildren: './pages/macrov2/macro.module#MacroV2PageModule' },

  { path: 'nutrition', canActivate: [ProfileCompleteGuard], loadChildren: './pages/nutrition/nutrition.module#NutritionPageModule' },
  { path: 'trainer-requests', canActivate: [ProfileCompleteGuard], loadChildren: './pages/trainer-requests/trainer-requests.module#TrainerRequestsPageModule' },
  { path: 'custom-food', canActivate: [ProfileCompleteGuard, FeatureFlagGuard], data: { flag: 'nutrition', value: false, other: 'custom-food-v2' }, loadChildren: './pages/custom-food-template/custom-food-template.module#CustomFoodTemplatePageModule' },
  { path: 'custom-food-v2', canActivate: [ProfileCompleteGuard, FeatureFlagGuard], data: { flag: 'nutrition', value: true, other: 'custom-food' }, loadChildren: './pages/custom-food-template-v2/custom-food-template.module#CustomFoodTemplateV2PageModule' },
  { path: 'help-support', canActivate: [ProfileCompleteGuard], loadChildren: './pages/help-support/help-support.module#HelpSupportPageModule' },
  { path: 'create-announcement', canActivate: [ProfileCompleteGuard], loadChildren: './pages/create-announcement/create-announcement.module#CreateAnnouncementPageModule' },
  { path: 'live-stream', canActivate: [ProfileCompleteGuard], loadChildren: './pages/live-stream/live-stream.module#LiveStreamPageModule' },
  { path: 'live-stream/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/video-player/video-player.module#VideoPlayerPageModule' },
  { path: 'take-assessment', canActivate: [ProfileCompleteGuard], loadChildren: './pages/take-assessment/take-assessment.module#TakeAssessmentPageModule' },
  { path: 'my-transphormers/:id/transphormer-workout', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/transphormer-workout/transphormer-workout.module#TransphormerWorkoutPageModule' },
  { path: 'advisor-assessment-list', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/assessment-list/assessment-list.module#AssessmentListPageModule' },
  { path: 'advisor-assessment-detail/:id', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/assessment-detail/assessment-detail.module#AssessmentDetailPageModule' },
  { path: 'my-transphormers/:id/assessments', canActivate: [ProfileCompleteGuard], loadChildren: './pages/my-transphormers/assessments/assessments.module#AssessmentsPageModule' },
  { path: 'walkthru', canActivate: [ProfileCompleteGuard], loadChildren: './page/walkthru/walkthru.module#WalkthruPageModule' },
  { path: 'subscribe', canActivate: [ProfileCompleteGuard], loadChildren: './pages/subscribe/subscribe.module#SubscribePageModule' },
  { path: 'help', canActivate: [ProfileCompleteGuard], loadChildren: './pages/help/help.module#HelpPageModule' },
  { path: 'test', loadChildren: './pages/test/test.module#TestPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
