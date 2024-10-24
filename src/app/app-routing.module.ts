import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './authentication/auth.guard';
import { CountriesComponent } from './views/settings/area-management/countries/countries.component';
// import { CitiesComponent } from './views/settings/area-management/cities/cities.component';
// import { DistrictsComponent } from './views/settings/area-management/districts/districts.component';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./layout/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./views/dashboard/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'activity-log',
        loadComponent: () =>
          import(
            './views/activity-log/activity-container/activity-container.component'
          ).then((m) => m.ActivityContainerComponent),
      },
      {
        path: 'settings',
        children: [
          {
            path: 'news-category',
            children: [
              {
                path: 'news-category-list',
                loadComponent: () =>
                  import(
                    './views/settings/news-category/news-category-list/news-category-list.component'
                  ).then((m) => m.NewsCategoryListComponent),
              },
              {
                path: 'news-category-add',
                loadComponent: () =>
                  import(
                    './views/settings/news-category/news-category-add/news-category-add.component'
                  ).then((m) => m.NewsCategoryAddComponent),
              },
              {
                path: 'news-category-edit/:id',
                loadComponent: () =>
                  import(
                    './views/settings/news-category/news-category-edit/news-category-edit.component'
                  ).then((m) => m.NewsCategoryEditComponent),
              },
            ],
          },
          {
            path: 'news',
            children: [
              {
                path: 'news-list',
                loadComponent: () =>
                  import(
                    './views/settings/news/news-list/news-list.component'
                  ).then((m) => m.NewsListComponent),
              },
              {
                path: 'news-list/:id',
                loadComponent: () =>
                  import(
                    './views/settings/news/news-list/news-list.component'
                  ).then((m) => m.NewsListComponent),
              },
              {
                path: 'news-add',
                loadComponent: () =>
                  import(
                    './views/settings/news/news-add/news-add.component'
                  ).then((m) => m.NewsAddComponent),
              },
              {
                path: 'news-detail/:id',
                loadComponent: () =>
                  import(
                    './views/settings/news/news-details/news-details.component'
                  ).then((m) => m.NewsDetailsComponent),
              },
              {
                path: 'news-edit/:id',
                loadComponent: () =>
                  import(
                    './views/settings/news/news-edit/news-edit.component'
                  ).then((m) => m.NewsEditComponent),
              },
            ],
          },
          {
            path: 'area-management',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/countries/countries.component'
                  ).then((m) => m.CountriesComponent),
              },
              {
                path: 'add-country',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/countries/add-country/add-country.component'
                  ).then((m) => m.AddCountryComponent),
              },
              {
                path: 'edit-country/:id',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/countries/update-country/update-country.component'
                  ).then((m) => m.UpdateCountryComponent),
              },
              {
                path: 'cities/:countryId',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/cities/cities.component'
                  ).then((m) => m.CitiesComponent),
              },
              {
                path: 'add-city/:countryId',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/cities/add-city/add-city.component'
                  ).then((m) => m.AddCityComponent),
              },
              {
                path: 'edit-city/:countryId/:cityId',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/cities/update-city/update-city.component'
                  ).then((m) => m.UpdateCityComponent),
              },
              {
                path: 'districts/:cityId',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/districts/districts.component'
                  ).then((m) => m.DistrictsComponent),
              },
              {
                path: 'add-district/:cityId',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/districts/add-district/add-district.component'
                  ).then((m) => m.AddDistrictComponent),
              },
              {
                path: 'edit-district/:cityId/:districtId',
                loadComponent: () =>
                  import(
                    './views/settings/area-management/districts/update-district/update-district.component'
                  ).then((m) => m.UpdateDistrictComponent),
              },
            ],
          },
          {
            path: 'questionaire',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './views/settings/questionaire/questionaire.component'
                  ).then((m) => m.QuestionaireComponent),
              },
              {
                path: 'add-question',
                loadComponent: () =>
                  import(
                    './views/settings/questionaire/add-question/add-question.component'
                  ).then((m) => m.AddQuestionComponent),
              },
              {
                path: 'edit-question/:id',
                loadComponent: () =>
                  import(
                    './views/settings/questionaire/update-question/update-question.component'
                  ).then((m) => m.UpdateQuestionComponent),
              },
            ],
          },
          {
            path: 'departments',
            loadComponent: () =>
              import(
                './views/settings/roles-permissions/departments/departments.component'
              ).then((m) => m.DepartmentsComponent),
          },
          {
            path: 'department-add',
            loadComponent: () =>
              import(
                './views/settings/roles-permissions/department-add/department-add.component'
              ).then((m) => m.DepartmentAddComponent),
          },
          {
            path: 'department-edit/:id',
            loadComponent: () =>
              import(
                './views/settings/roles-permissions/department-edit/department-edit.component'
              ).then((m) => m.DepartmentEditComponent),
          },
          {
            path: 'roles/:departmentId',
            loadComponent: () =>
              import(
                './views/settings/roles-permissions/roles/roles.component'
              ).then((m) => m.RolesComponent),
          },
          {
            path: 'role-add/:departmentId',
            loadComponent: () =>
              import(
                './views/settings/roles-permissions/role-add/role-add.component'
              ).then((m) => m.RoleAddComponent),
          },
          {
            path: 'role-edit/:departmentId/:roleId',
            loadComponent: () =>
              import(
                './views/settings/roles-permissions/role-edit/role-edit.component'
              ).then((m) => m.RoleEditComponent),
          },
          {
            path: 'taxes',
            loadComponent: () =>
              import(
                './views/settings/taxes/taxes-list/taxes-list.component'
              ).then((m) => m.TaxesListComponent),
          },
          {
            path: 'taxes/taxes-edit/:value',
            loadComponent: () =>
              import('./views/settings/taxes/tax-edit/tax-edit.component').then(
                (m) => m.TaxEditComponent
              ),
          },
          {
            path: 'subscription',
            loadComponent: () =>
              import(
                './views/settings/subscription/subscription-list/subscription-list.component'
              ).then((m) => m.SubscriptionListComponent),
          },
          {
            path: 'subscription/subscription-edit',
            loadComponent: () =>
              import(
                './views/settings/subscription/subscription-edit/subscription-edit.component'
              ).then((m) => m.SubscriptionEditComponent),
          },
          {
            path: 'subscription/subscription-add',
            loadComponent: () =>
              import(
                './views/settings/subscription/subscription-add/subscription-add.component'
              ).then((m) => m.SubscriptionAddComponent),
          },
          {
            path: 'commission-fee',
            loadComponent: () =>
              import(
                './views/settings/commission-fee/commission-fee-list/commission-fee-list.component'
              ).then((m) => m.CommissionFeeComponent),
          },
          {
            path: 'commission-fee/edit/:value',
            loadComponent: () =>
              import(
                './views/settings/commission-fee/commission-fee-edit/commission-fee-edit.component'
              ).then((m) => m.CommissionFeeEditComponent),
          },
        ],
      },
      {
        path: 'reports',
        children: [
          {
            path: 'marketing-reports',
            loadComponent: () =>
              import(
                './views/marketing-reports/main-reports/main-reports.component'
              ).then((m) => m.MainReportsComponent),
          },
          {
            path: 'top-vendors',
            loadComponent: () =>
              import(
                './views/marketing-reports/top-vendors/top-vendors.component'
              ).then((m) => m.TopVendorsComponent),
          },
          {
            path: 'top-rated-vendors',
            loadComponent: () =>
              import(
                './views/marketing-reports/top-rated-vendors/top-rated-vendors.component'
              ).then((m) => m.TopRatedVendorsComponent),
          },
          {
            path: 'top-companies',
            loadComponent: () =>
              import(
                './views/marketing-reports/top-companies/top-companies.component'
              ).then((m) => m.TopCompaniesComponent),
          },
        ],
      },
      {
        path: 'settings/faq/faqs',
        loadComponent: () =>
          import('./views/fqa/fqas/fqas.component').then(
            (m) => m.FqasComponent
          ),
      },
      {
        path: 'settings/faq-add',
        loadComponent: () =>
          import('./views/fqa/fqa-add/fqa-add.component').then(
            (m) => m.FqaAddComponent
          ),
      },
      {
        path: 'settings/faq-edit/:id',
        loadComponent: () =>
          import('./views/fqa/fqa-edit/fqa-edit.component').then(
            (m) => m.FqaEditComponent
          ),
      },
      {
        path: 'settings/privacypolicy',
        loadComponent: () =>
          import(
            './views/settings/privacy-policy/privacy-policy.component'
          ).then((m) => m.PrivacyPolicyComponent),
      },
      {
        path: 'settings/terms',
        loadComponent: () =>
          import(
            './views/settings/terms-and-condition/terms-and-condition.component'
          ).then((m) => m.TermsAndConditionComponent),
      },
      {
        path: 'coupon/coupons',
        loadComponent: () =>
          import('./views/coupon/coupons/coupons.component').then(
            (m) => m.CouponsComponent
          ),
      },
      {
        path: 'coupon/coupon-add',
        loadComponent: () =>
          import('./views/coupon/coupon-add/coupon-add.component').then(
            (m) => m.CouponAddComponent
          ),
      },
      {
        path: 'coupon/coupon-edit/:id',
        loadComponent: () =>
          import('./views/coupon/coupon-edit/coupon-edit.component').then(
            (m) => m.CouponEditComponent
          ),
      },
      {
        path: 'coupon/coupon-count',
        loadComponent: () =>
          import(
            './views/coupon/get-promos-useage-count/get-promos-useage-count.component'
          ).then((m) => m.GetPromosUseageCountComponent),
      },
      {
        path: 'business-industry',
        loadComponent: () =>
          import(
            './views/companies-category/business-industry/business-industry.component'
          ).then((m) => m.BusinessIndustryComponent),
      },
      {
        path: 'business-industry/add',
        loadComponent: () =>
          import(
            './views/companies-category/business-industry-add/business-industry-add.component'
          ).then((m) => m.BusinessIndustryAddComponent),
      },
      {
        path: 'business-industry/edit/:id',
        loadComponent: () =>
          import(
            './views/companies-category/business-industry-edit/business-industry-edit.component'
          ).then((m) => m.BusinessIndustryEditComponent),
      },
      {
        path: 'sub-business-industry',
        loadComponent: () =>
          import(
            './views/companies-category/sub-business-industry/sub-business-industry.component'
          ).then((m) => m.SubBusinessIndustryComponent),
      },
      {
        path: 'sub-business-industry/add',
        loadComponent: () =>
          import(
            './views/companies-category/sub-business-industry-add/sub-business-industry-add.component'
          ).then((m) => m.SubBusinessIndustryAddComponent),
      },
      {
        path: 'sub-business-industry/edit/:id',
        loadComponent: () =>
          import(
            './views/companies-category/sub-business-industry-edit/sub-business-industry-edit.component'
          ).then((m) => m.SubBusinessIndustryEditComponent),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./views/companies-category/skills/skills.component').then(
            (m) => m.SkillsComponent
          ),
      },
      {
        path: 'skills/add',
        loadComponent: () =>
          import(
            './views/companies-category/skills-add/skills-add.component'
          ).then((m) => m.SkillsAddComponent),
      },
      {
        path: 'skills/edit/:id',
        loadComponent: () =>
          import(
            './views/companies-category/skills-edit/skills-edit.component'
          ).then((m) => m.SkillsEditComponent),
      },
      {
        path: 'projects',
        children: [
          {
            path: 'open-contacts',
            loadComponent: () =>
              import(
                './views/projects/open-contacts/open-contacts.component'
              ).then((m) => m.OpenContactsComponent),
          },
          {
            path: 'under-process',
            loadComponent: () =>
              import(
                './views/projects/under-process/under-process.component'
              ).then((m) => m.UnderProcessComponent),
          },
          {
            path: 'suspended-projects',
            loadComponent: () =>
              import(
                './views/projects/suspended-projects/suspended-projects.component'
              ).then((m) => m.SuspendedProjectsComponent),
          },
          {
            path: 'cancelled-projects',
            loadComponent: () =>
              import(
                './views/projects/cancelled-projects/cancelled-projects.component'
              ).then((m) => m.CancelledProjectsComponent),
          },
          {
            path: 'incomplete-projects',
            loadComponent: () =>
              import(
                './views/projects/incomplete-projects/incomplete-projects.component'
              ).then((m) => m.IncompleteProjectsComponent),
          },
          {
            path: 'complete-projects',
            loadComponent: () =>
              import(
                './views/projects/complete-projects/complete-projects.component'
              ).then((m) => m.CompleteProjectsComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import(
                './views/projects/project-details/project-details.component'
              ).then((m) => m.ProjectDetailsComponent),
          },
        ],
      },
      {
        path: 'company-list',
        children: [
          {
            path: 'pending',
            loadComponent: () =>
              import('./views/company-list/pending/pending.component').then(
                (m) => m.PendingComponent
              ),
          },
          {
            path: 'pending-details/:id',
            loadComponent: () =>
              import(
                './views/company-list/pending-details/pending-details.component'
              ).then((m) => m.PendingDetailsComponent),
          },
          {
            path: 'approved',
            loadComponent: () =>
              import('./views/company-list/approved/approved.component').then(
                (m) => m.ApprovedComponent
              ),
          },
          {
            path: 'approved-details/:id',
            loadComponent: () =>
              import(
                './views/company-list/approved-details/approved-details.component'
              ).then((m) => m.ApprovedDetailsComponent),
          },
          {
            path: 'cr-approvlas',
            loadComponent: () =>
              import(
                './views/company-cr/cr-approvals/cr-approvals.component'
              ).then((m) => m.CrApprovalsComponent),
          },
          {
            path: 'cr-expirations',
            loadComponent: () =>
              import(
                './views/company-cr/cr-expirations/cr-expirations.component'
              ).then((m) => m.CrExpirationsComponent),
          },
          {
            path: 'cr-pending',
            loadComponent: () =>
              import('./views/company-cr/cr-pending/cr-pending.component').then(
                (m) => m.CrPendingComponent
              ),
          },
          {
            path: 'cr-rejected',
            loadComponent: () =>
              import(
                './views/company-cr/cr-rejected/cr-rejected.component'
              ).then((m) => m.CrRejectedComponent),
          },
          {
            path: 'blocked',
            loadComponent: () =>
              import('./views/company-list/blocked/blocked.component').then(
                (m) => m.BlockedComponent
              ),
          },
          {
            path: 'rejections',
            loadComponent: () =>
              import(
                './views/company-list/rejections/rejections.component'
              ).then((m) => m.RejectionsComponent),
          },
        ],
      },
      {
        path: 'companies-rating',
        loadComponent: () =>
          import('./views/companies-rating/companies-rating.component').then(
            (m) => m.CompaniesRatingComponent
          ),
      },
      {
        path: 'wallet',
        loadComponent: () =>
          import('./views/wallet/wallet.component').then(
            (m) => m.WalletComponent
          ),
      },
      {
        path: 'inbox',
        children: [
          {
            path: '',
            redirectTo: 'inbox-list',
            pathMatch: 'full',
          },
          {
            path: 'inbox-list',
            loadComponent: () =>
              import('./views/inbox/inbox-list/inbox-list.component').then(
                (m) => m.InboxListComponent
              ),
          },
          {
            path: 'inbox-add',
            loadComponent: () =>
              import('./views/inbox/inbox-add/inbox-add.component').then(
                (m) => m.InboxAddComponent
              ),
          },
          {
            path: 'inbox-detail/:id',
            loadComponent: () =>
              import(
                './views/inbox/inbox-details/inbox-details.component'
              ).then((m) => m.InboxDetailsComponent),
          },
        ],
      },
      {
        path: 'announcement',
        children: [
          {
            path: 'announcements',
            loadComponent: () =>
              import(
                './views/announcement/announcements/announcements.component'
              ).then((m) => m.AnnouncementsComponent),
          },
          {
            path: 'announcement-add',
            loadComponent: () =>
              import(
                './views/announcement/announcement-add/announcement-add.component'
              ).then((m) => m.AnnouncementAddComponent),
          },
          {
            path: 'announcement-detail/:id',
            loadComponent: () =>
              import(
                './views/announcement/announcement-detail/announcement-detail.component'
              ).then((m) => m.AnnouncementDetailComponent),
          },
        ],
      },
      {
        path: 'claims',
        loadComponent: () =>
          import('./views/claims/claims.component').then(
            (m) => m.ClaimsComponent
          ),
      },
      {
        path: 'claim-subject',
        children: [
          {
            path: 'claim-list',
            loadComponent: () =>
              import(
                './views/clam-subject/clam-subject-list/clam-subject-list.component'
              ).then((m) => m.ClamSubjectListComponent),
          },
          {
            path: 'claim-add',
            loadComponent: () =>
              import(
                './views/clam-subject/clam-subject-add/clam-subject-add.component'
              ).then((m) => m.ClamSubjectAddComponent),
          },
          {
            path: 'claim-edit/:id',
            loadComponent: () =>
              import(
                './views/clam-subject/clam-subject-edit/clam-subject-edit.component'
              ).then((m) => m.ClamSubjectEditComponent),
          },
        ],
      },
      {
        path: 'manual',
        children: [
          {
            path: '',
            redirectTo: 'manuals',
            pathMatch: 'full',
          },
          {
            path: 'manuals',
            loadComponent: () =>
              import('./views/manual/manuals/manuals.component').then(
                (m) => m.ManualsComponent
              ),
          },
          {
            path: 'manual-add',
            loadComponent: () =>
              import('./views/manual/manual-add/manual-add.component').then(
                (m) => m.ManualAddComponent
              ),
          },
          {
            path: 'manual-edit/:id',
            loadComponent: () =>
              import('./views/manual/manual-edit/manual-edit.component').then(
                (m) => m.ManualEditComponent
              ),
          },
        ],
      },
      {
        path: 'accounting',
        children: [
          {
            path: 'payslip',
            loadComponent: () =>
              import('./views/Accounting/pay-slip/pay-slip.component').then(
                (m) => m.PaySlipComponent
              ),
          },
          {
            path: 'pendingGroup',
            loadComponent: () =>
              import(
                './views/Accounting/pending-acoounting/pending-acoounting.component'
              ).then((m) => m.PendingAcoountingComponent),
          },
          {
            path: 'orderInGroup/:id/:groupName',
            loadComponent: () =>
              import(
                './views/Accounting/order-in-group/order-in-group.component'
              ).then((m) => m.OrderInGroupComponent),
          },
          {
            path: 'paymentissue',
            loadComponent: () =>
              import(
                './views/Accounting/payment-issues/payment-issues.component'
              ).then((m) => m.PaymentIssuesComponent),
          },
          {
            path: 'paymentFixed',
            loadComponent: () =>
              import(
                './views/Accounting/fixed-payment/fixed-payment.component'
              ).then((m) => m.FixedPaymentComponent),
          },
          {
            path: 'PaymentsByMonths',
            loadComponent: () =>
              import(
                './views/Accounting/payments-by-months/payments-by-months.component'
              ).then((m) => m.PaymentsByMonthsComponent),
          },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
