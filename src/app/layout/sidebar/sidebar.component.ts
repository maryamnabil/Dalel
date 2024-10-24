import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    MatListModule,
    NgFor,
    NgIf,
    RouterLinkActive,
    RouterLink,
    MatExpansionModule,
  ],
})
export class SidebarComponent {
  panelOpened(): void {
    //console.log('Panel opened');
  }

  panelClosed(): void {
    // console.log('Panel closed');
  }

  constructor(private translate: TranslateService) {}

  translateLabel(label: string): string {
    return this.translate.instant(label);
  }
  menuItems = [
    {
      label: 'ADMIN_LOG_TITLE',
      link: '/admin/activity-log',
      icon: 'fas fa-clipboard-list', // Font Awesome icon class
    },
    {
      label: 'DASHBOARD',
      link: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
    },
    {
      label: 'PROJECTS',
      icon: 'fas fa-briefcase',
      subMenu: [
        { label: 'OPEN_CONTACTS', link: '/admin/projects/open-contacts' },
        { label: 'UNDER_PROCESS', link: '/admin/projects/under-process' },
        {
          label: 'SUSPENDED_PROJECTS',
          link: '/admin/projects/suspended-projects',
        },
        {
          label: 'CANCELLED_PROJECTS',
          link: '/admin/projects/cancelled-projects',
        },
        {
          label: 'INCOMPLETE_PROJECTS',
          link: '/admin/projects/incomplete-projects',
        },
        {
          label: 'COMPLETE_PROJECTS',
          link: '/admin/projects/complete-projects',
        },
      ],
    },
    {
      label: 'COMPANY_CR',
      icon: 'fas fa-building',
      subMenu: [
        { label: 'CR_PENDING', link: '/admin/company-list/cr-pending' },
        { label: 'CR_APPROVALS', link: '/admin/company-list/cr-approvlas' },
        { label: 'CR_REJECTED', link: '/admin/company-list/cr-rejected' },
        { label: 'CR_EXPIRATIONS', link: '/admin/company-list/cr-expirations' },
      ],
    },
    {
      label: 'COMPANY_LIST',
      icon: 'fas fa-building',
      subMenu: [
        { label: 'PEDNING', link: '/admin/company-list/pending' },
        { label: 'APPROVED', link: '/admin/company-list/approved' },
        { label: 'BLOCKED', link: '/admin/company-list/blocked' },
        { label: 'REJECTIONS', link: '/admin/company-list/rejections' },
      ],
    },
    {
      label: 'COMPANY_RATINGS',
      link: '/admin/companies-rating',
      icon: 'fas fa-chart-line',
    },
    {
      label: 'COMPANIES_CATEGORIES',
      icon: 'fas fa-building',
      subMenu: [
        { label: 'ADD_BUSINESS_INDUSTRY', link: '/admin/business-industry' },
        {
          label: 'ADD_SUB_BUSINESS_INDUSTRY',
          link: '/admin/sub-business-industry',
        },
        { label: 'ADD_SKILSS', link: '/admin/skills' },
      ],
    },
    {
      label: 'ACCOUNTING',
      icon: 'fas fa-wallet',
      subMenu: [
        { label: 'PAY_SLIP', link: '/admin/accounting/payslip' },
        { label: 'PENDING', link: '/admin/accounting/pendingGroup' },
        { label: 'PAYMENT_ISSUE', link: '/admin/accounting/paymentissue' },
        { label: 'FIXED_PAYMENTS', link: '/admin/accounting/paymentFixed' },
        {
          label: 'PaymentsByMonths',
          link: '/admin/accounting/PaymentsByMonths',
        },
      ],
    },
    {
      label: 'MARKETING_REPORTS',
      icon: 'fas fa-chart-line',
      subMenu: [
        { label: 'REPORTS', link: '/admin/reports/marketing-reports' },
        {
          label: 'TOP_VENDORS',
          link: '/admin/reports/top-vendors',
        },
        {
          label: 'TOP_RATED_VENDORS',
          link: '/admin/reports/top-rated-vendors',
        },
        {
          label: 'TOP_COMPANIES',
          link: '/admin/reports/top-companies',
        },
      ],
    },
    {
      label: 'SETTINGS',
      icon: 'fas fa-cog',
      subMenu: [
        {
          label: 'AREAMANAGEMENT',
          link: '/admin/settings/area-management',
        },
        {
          label: 'Questionaire',
          link: '/admin/settings/questionaire',
          icon: 'fas fa-coins',
        },
        {
          label: 'NEWS_CATEGORY',
          link: '/admin/settings/news-category/news-category-list',
        },
        { label: 'NEWS', link: '/admin/settings/news/news-list' },
        { label: 'TAX_MANAGEMENT', link: '/admin/settings/taxes' },
        {
          label: 'COMISSION_FEE_MANAGEMENT',
          link: '/admin/settings/commission-fee',
        },
        { label: 'SUBSCRIPTION_PACKAGE', link: '/admin/settings/subscription' },
        { label: 'TERMS_CONDITIONS', link: '/admin/settings/terms' },
        { label: 'PRIVACY_POLICY', link: '/admin/settings/privacypolicy' },
        { label: 'FAQ', link: '/admin/settings/faq/faqs' },
        { label: 'ROLES_PERMISSIONS', link: '/admin/settings/departments' },
      ],
    },

    { label: 'WALLET', link: '/admin/wallet', icon: 'fas fa-coins' },
    { label: 'COUPONS', link: '/admin/coupon/coupons', icon: 'fas fa-tags' },
    {
      label: 'NOTIFICATION_INBOX',
      link: '/admin/inbox/inbox-list',
      icon: 'fas fa-bell',
    },
    {
      label: 'ANNOUNCEMENTS',
      link: '/admin/announcement/announcements',
      icon: 'fas fa-bullhorn',
    },
    {
      label: 'CLAIMS',
      link: '/admin/claims',
      icon: 'fas fa-handshake',
    },
    {
      label: 'CLAIMS_SUBJECT',
      link: '/admin/claim-subject/claim-list',
      icon: 'fas fa-file-alt',
    },
    { label: 'MANUAL', link: 'manual/manuals', icon: 'fas fa-wrench' },
  ];
}
