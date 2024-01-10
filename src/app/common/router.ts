import { Routes } from '@angular/router';
import { AuthComponent } from '../themes/auth/auth.component';
import { UserComponent } from '../themes/user/user.component';
import { AuthGuard } from '../guards/auth.guard';

export let ROUTES_ROOT: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('../modules/auth/auth.module').then((m) => m.AuthModule)
      },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ]
  },
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/user/user.module').then((m) => m.UserModule)
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]
  },
];

export let ROUTES_AUTH: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
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
      }
    ]
  },
];

export let ROUTES_USER: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('../modules/user/home/home.component').then((m) => m.HomeComponent),
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