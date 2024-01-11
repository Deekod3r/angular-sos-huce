import { Routes } from '@angular/router';
import { AuthComponent } from '../themes/auth/auth.component';
import { UserComponent } from '../themes/user/user.component';
import { AuthGuard } from '../guards/auth.guard';

export let ROUTES_ROOT: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/user/user.module').then((m) => m.UserModule)
      },
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('../modules/auth/auth.module').then((m) => m.AuthModule)
      },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

export let ROUTES_AUTH: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('../modules/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('../modules/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'verify/:id',
        loadComponent: () => import('../modules/auth/verify/verify.component').then((m) => m.VerifyComponent),
      },
    ]
  },
];

export let ROUTES_USER: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('../modules/user/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'adopt',
        loadComponent: () => import('../modules/user/adopt/adopt.component').then((m) => m.AdoptComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('../modules/user/blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'donate',
        loadComponent: () => import('../modules/user/donate/donate.component').then((m) => m.DonateComponent),
      },
      {
        path: 'intro',
        loadComponent: () => import('../modules/user/intro/intro.component').then((m) => m.IntroComponent),
      },
      {
        path: 'support',
        loadComponent: () => import('../modules/user/support/support.component').then((m) => m.SupportComponent),
      }
    ]
  },
];

export function getAllRoutes(routeName: string, commonRoute: any, isPublic: boolean): Routes {
  if (!isPublic) {
    if (commonRoute && routeName) {
      let lstModulePublic = commonRoute.filter((route: { canActivate: any; }) => {
        if (!route.canActivate) {
          return true;
        }
        return false;
      });
      // const json = localStorage.getItem(routeName);
      // if (json) {
      //   let menus = JSON.parse(json);
      //   if (menus && menus.length > 0) {
      //     let lstModulePrivate = commonRoute.filter((route: { canActivate: any; }) => {
      //       if (route.canActivate) {
      //         return true;
      //       }
      //       return false;
      //     });
      //     if (lstModulePrivate && lstModulePrivate.length > 0) {
      //       const defaultRoute = menus.find((obj: { default: any; }) => obj.default) ?? findMinValueObject(menus, 'order');
      //       lstModulePrivate.map((map: { [x: string]: any; children: any[]; }) => {
      //         const lstComponentPrivate = map?.children.filter((route: { path: string; }) => {
      //           if (route.path == '' || route.path == '**') {
      //             return true;
      //           }
      //           return menus.find((obj: { path: any; }) => obj.path == route.path);
      //         }).map((item: { path: string; }) => {
      //           if (item.path == '' || item.path == '**') {
      //             return { ...item, ['redirectTo']: defaultRoute.path };
      //           }
      //           return item;
      //         });
      //         map['children'] = lstComponentPrivate;
      //         return map;
      //       });
      //       return [...lstModulePrivate, ...lstModulePublic]
      //     }
      //   }
      // }
      return lstModulePublic
    }
    return [];
  } else {
    return commonRoute;
  }
}

// function findMinValueObject(list: any[], fieldName: string) {
//   if (list.length === 0) {
//     return null;
//   }

//   return list.reduce((minObj: { [x: string]: any; }, currentObj: { [x: string]: any; }) => {
//     const minValue = minObj[fieldName];
//     const currentValue = currentObj[fieldName];

//     if (currentValue === null || (currentValue !== null && currentValue < minValue)) {
//       return currentObj;
//     }

//     return minObj;
//   }, list[0]);
// }