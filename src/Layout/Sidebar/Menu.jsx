const ADMIN_MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboards,Widgets",
    Items: [
      {
        title: "Dashboard",
        icon: "home",
        badge: "badge badge-light-primary",
        type: "link",
        path: `${process.env.PUBLIC_URL}/dashboard/default`
      },
      {
        title: "Master",
        icon: "user",
        type: "sub",
        badge: "badge badge-light-secondary",
        active: true,
        children: [
          {
            title: "Community",
            type: "sub",
            children: [
              { path: `${process.env.PUBLIC_URL}/categery`, type: "link", title: "Community Category" },
              // { path: `${process.env.PUBLIC_URL}/community`, type: "link", title: "All Communities" },
            ],
          },
          {
            title: "Reminders",
            type: "sub",
            children: [
              { path: `${process.env.PUBLIC_URL}/medicine`, type: "link", title: "Medicine Master" },
              // { path: `${process.env.PUBLIC_URL}/game/category`, type: "link", title: "Game Category" },
            ],
          },{
            title: "Donate",
            type: "sub",
            children: [
              { path: `${process.env.PUBLIC_URL}/Donate`, type: "link", title: "Donate Items" },
              { path: `${process.env.PUBLIC_URL}/DonateCategory`, type: "link", title: "Donate Category" },
            ],
          },
          {
            title: "Health",
            type: "sub",
            children: [
              { path: `${process.env.PUBLIC_URL}/diet_chart`, type: "link", title: "Diet Chart Category" },
              { path: `${process.env.PUBLIC_URL}/videos`, type: "link", title: "Video Category" },
            ],
          },
          {
            title: "Content",
            type: "sub",
            children: [
              { path: `${process.env.PUBLIC_URL}/story`, type: "link", title: "Story" },
              { path: `${process.env.PUBLIC_URL}/badges`, type: "link", title: "Badges" },
            ],
          },
     
            {
              title: "Alzeimer Category",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/AlzheimerCategory`
            },
            {
              title: "Alzeimer Assessment Question",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/AlzheimerQuestion`
            },
            {
              title: "Daily Log Question",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/daily-log-question`
            },
            {
              title: "Caregiver Question",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/caregiver-question`
            },
          {
            title: "Autism lession",
            type: "sub",
            active: true,
            children: [
              { path: `${process.env.PUBLIC_URL}/Lession1`, type: "link", title: "Lession 1" },
              { path: `${process.env.PUBLIC_URL}/Lession2`, type: "link", title: "Lession 2" },
              { path: `${process.env.PUBLIC_URL}/Lession3`, type: "link", title: "Lession 3" },
              { path: `${process.env.PUBLIC_URL}/Lession4`, type: "link", title: "Lession 4" },
              { path: `${process.env.PUBLIC_URL}/Lession5`, type: "link", title: "Lession 5" },
              { path: `${process.env.PUBLIC_URL}/Lession6`, type: "link", title: "Lession 6" },
              { path: `${process.env.PUBLIC_URL}/Lession7`, type: "link", title: "Lession 7" },
              { path: `${process.env.PUBLIC_URL}/Lession8`, type: "link", title: "Lession 8" },
              { path: `${process.env.PUBLIC_URL}/Lession9`, type: "link", title: "Lession 9" },
              { path: `${process.env.PUBLIC_URL}/Lession10`, type: "link", title: "Lession 10" },
              
            ],
          },
        ],
      },
      {
        title: "Events",
        icon: "calendar",
        badge: "badge badge-light-secondary",
        type: "link",
        path: `${process.env.PUBLIC_URL}/event`
      },

      {
        title: "Users",
        icon: "user",
        type: "sub",
        active: false,
        children:[
           { path: `${process.env.PUBLIC_URL}/allUsers`, type: "link", title: "All Users" },
          { path: `${process.env.PUBLIC_URL}/experts`, type: "link", title: "Experts" },
          { path: `${process.env.PUBLIC_URL}/blockUser`, type: "link", title: "Block Users" },
     {
              title: "Alzheimer",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/AllAlzheimer`
            },
             {
              title: "Appointment",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/Appointment`
            },
             {
              title: "Caregiver",
              icon: "home",
              badge: "badge badge-light-primary",
              type: "link",
              path: `${process.env.PUBLIC_URL}/Caregiver`
            },
        ],

        // path: `${process.env.PUBLIC_URL}/allUsers`
      },
      {
        title: "Games",
        icon: "widget",
        type: "sub",
        badge: "badge badge-light-primary",
        active: false,
        children: [
          {
            path: `${process.env.PUBLIC_URL}/autizm-game`,
            type: "link",
            title: "Autism Games",
          },
          {
            path: `${process.env.PUBLIC_URL}/alzheimer-games`,
            type: "link",
            title: "Alzheimer Games",
          },
        ],
      },
      {
        title: "Vendor",
        icon: "bookmark",
        type: "sub",
        badge: "badge badge-light-secondary",
        active: false,
        children: [
          // { path: `${process.env.PUBLIC_URL}/diet_chart`, type: "link", title: "Diet Chart" },
          { path: `${process.env.PUBLIC_URL}/vender_category`, type: "link", title: "Vender Category" },
          { path: `${process.env.PUBLIC_URL}/allVendors`, type: "link", title: "Vendor" },
          // { path: `${process.env.PUBLIC_URL}/chemist`, type: "link", title: "Chemist" },
        ]
      },
      {
        title: "ProductsList",
        icon: "ecommerce",
        type: "sub",
        badge: "badge badge-light-secondary",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/services`, type: "link", title: "Services" },
          { path: `${process.env.PUBLIC_URL}/products`, type: "link", title: "Products" },
          { path: `${process.env.PUBLIC_URL}/services/category`, type: "link", title: "Category" },
          { path: `${process.env.PUBLIC_URL}/products/order-status`, type: "link", title: "Order Status" },
        ]
      },
      {
        title: "SubAdmin",
        icon: "user",
        type: "sub",
        badge: "badge badge-light-secondary",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/allRole`, type: "link", title: "Role" },
          { path: `${process.env.PUBLIC_URL}/subAdmin`, type: "link", title: "User" },
          { path: `${process.env.PUBLIC_URL}/permission`, type: "link", title: "Permission" },
          { path: `${process.env.PUBLIC_URL}/assignPermission`, type: "link", title: "Assign" },
        ]
      },
      // {
      //   title: "Medical Reminder",
      //   icon: "user",
      //   type: "sub",
      //   badge: "badge badge-light-secondary",
      //   active: false,
      //   children: [
      //     { path: `${process.env.PUBLIC_URL}/medicine`, type: "link", title: "Medicine" },
      //     { path: `${process.env.PUBLIC_URL}/doctor`, type: "link", title: "Doctor" },
      //     { path: `${process.env.PUBLIC_URL}/vacination`, type: "link", title: "Vacination" },
      //   ]
      // },
      // {
      //   title: "Community (Social Meet)",
      //   icon: "user",
      //   type: "sub",
      //   badge: "badge badge-light-secondary",
      //   active: false,
      //   children: [
      //     { path: `${process.env.PUBLIC_URL}/community`, type: "link", title: "Community list" },
      //     { path: `${process.env.PUBLIC_URL}/event`, type: "link", title: "Events" },
      //     { path: `${process.env.PUBLIC_URL}/categery`, type: "link", title: "Categery" },
      //     { path: `${process.env.PUBLIC_URL}/distance`, type: "link", title: "Distance" },
      //   ]
      // },

      
      // {
      //   title: "Alzheimer",
      //   icon: "user",
      //   type: "sub",
      //   badge: "badge badge-light-secondary",
      //   active: false,
      // },
      // {
      //   title: "Autism",
      //   icon: "user",
      //   type: "sub",
      //   badge: "badge badge-light-secondary",
      //   active: false,
      // },
    ],
  },
];

const EXPERT_MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Workspace",
    Items: [
      {
        title: "Dashboard",
        icon: "home",
        badge: "badge badge-light-primary",
        type: "link",
        path: `${process.env.PUBLIC_URL}/expert/dashboard`
      },
      {
        title: "My Events",
        icon: "calendar",
        badge: "badge badge-light-secondary",
        type: "link",
        path: `${process.env.PUBLIC_URL}/expert/my-events`
      },
    ],
  },
];

const cloneMenuTree = (items) =>
  items.map((item) => ({
    ...item,
    Items: item.Items.map((menuItem) => ({
      ...menuItem,
      children: menuItem.children
        ? menuItem.children.map((child) => ({
            ...child,
            children: child.children ? child.children.map((subChild) => ({ ...subChild })) : child.children,
          }))
        : menuItem.children,
    })),
  }));

export const getMenuItemsByRole = (role) =>
  cloneMenuTree(String(role || "").toLowerCase() === "expert" ? EXPERT_MENUITEMS : ADMIN_MENUITEMS);

export const MENUITEMS = ADMIN_MENUITEMS;
export const EXPERT_MENU = EXPERT_MENUITEMS;
