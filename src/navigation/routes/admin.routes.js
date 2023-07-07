const routes = [
  {
    icon: 'ri:dashboard-fill',
    title: 'Dashboard',
    path: '/dashboard'
  },

  {
    icon: 'mdi:graph-line',
    title: 'Member Management',
    children: [
      {
        title: 'All Member List',
        path: '/member-management/all-member-list'
      },
      {
        title: 'Add New Member',
        path: '/member-management/add-member'
      },
      {
        title: 'All members Genealogy',
        path: '/member-management/all-member-genealogy'
      },
      {
        title: 'Password Tracker',
        path: '/member-management/password-tracker'
      }
    ]
  },

  {
    icon: 'ic:sharp-account-balance-wallet',
    title: 'Vendor Management',
    children: [
      {
        title: 'Add New Vendor',
        path: '/vendor-management/add-new-vendor'
      },
      {
        title: 'Vendor List',
        path: '/vendor-management/vendor-list'
      },
      {
        title: 'Our Vendors',
        path: '/vendor-management/our-vendors'
      },
      {
        title: 'Add New Service',
        path: '/vendor-management/add-new-service'
      },
      {
        title: 'Vendor Invoices',
        path: '/vendor-management/vendor-invoice'
      },
      {
        title: 'Vendor Sales Report',
        path: '/vendor-management/vendor-sales-report'
      },
      {
        title: 'Vendor Payment Request Report',
        path: '/vendor-management/vendor-payment-request'
      }
    ]
  },

  {
    icon: 'mdi:people-group',
    title: 'Admin Revenue Report',
    path: '/admin-revenue-report'
  },

  {
    icon: 'iconamoon:profile-fill',
    title: 'Commission Management',
    children: [
      {
        title: 'Manage',
        path: '/commission-management/manage'
      }
    ]
  },

  {
    icon: 'mdi:report-bell-curve',
    title: 'Reports Management',
    children: [
      {
        title: 'Member Package Report',
        path: '/reports-managemnt/member-package-report'
      },
      {
        title: 'Paid Level Bonus Report',
        path: '/reports-managemnt/paid-level-bonus-report'
      },
      {
        title: 'Unpaid Level Bonus Report',
        path: '/reports-managemnt/unpaid-level-bonus-report'
      },
      {
        title: 'Paid Co-founder Income Report',
        path: '/reports-managemnt/paid-cofounder-income-report'
      },
      {
        title: 'Unpaid Co-founder Income Report',
        path: '/reports-managemnt/unpaid-cofounder-income-report'
      }
    ]
  },

  {
    icon: 'iconamoon:invoice-fill',
    title: 'Wallet Management',
    children: [
      {
        title: 'Manage User Ewallet',
        path: '/wallet-managemnt/manage-user-ewallet'
      }
    ]
  },

  {
    icon: 'material-symbols:lock-person',
    title: 'Payout Management',
    children: [
      {
        title: 'Generate Payout List',
        path: '/payout-managemnt/generate-payout-list'
      },
      {
        title: 'All Payout List',
        path: '/payout-managemnt/all-payout-list'
      },
      {
        title: 'Members Closing Report',
        path: '/payout-managemnt/member-closing-list'
      }
    ]
  },

  {
    icon: 'mdi:comment-help',
    title: 'Withdrawal Management',
    children: [
      {
        title: 'Open Withdrawal Request',
        path: '/withdrawal-management/open-withdrawal-request'
      },
      {
        title: 'Close Withdrawal Request',
        path: '/withdrawal-management/close-withdrawal-request'
      }
    ]
  },

  {
    icon: 'mdi:invoice-check',
    title: 'Query Tickets Management',
    path: '/official-announcements',
    children: [
      {
        title: 'Open Ticket Manage',
        path: '/query-tickets-management/open-ticket-management'
      },
      {
        title: 'Close Ticket Manage',
        path: '/query-tickets-management/close-ticket-managemnt'
      }
    ]
  },
  {
    icon: 'ic:baseline-business-center',
    title: 'Settings Management',
    children: [
      {
        title: 'Change Password',
        path: '/setting-management/change-password'
      },
      {
        title: 'Change Profile Photo',
        path: '/setting-management/change-portfolio-photo'
      },
      {
        title: 'Policy Content Update',
        path: '/setting-management/policy-content-update'
      },
      {
        title: 'User Block Managemen',
        path: '/setting-management/user-block-management'
      },
      {
        title: 'Withdrawal Request Block Management',
        path: '/setting-management/withdrawal-request'
      }
    ]
  },

  {
    icon: 'ph:video-fill',
    title: 'Manage Video',
    children: [
      {
        title: 'Manage Video',
        path: '/manage-video'
      }
    ]
  },
  {
    icon: 'material-symbols:add-circle',
    title: 'official announcement',
    path: '/official-announcement'
  }
]

export default routes
