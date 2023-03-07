import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { ComponentsModule } from "./components/components.module";

const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./pages/pages/auth/login/login.module").then(
        (m) => m.LoginModule
      ),
  },
  {
    path: '',
    redirectTo: 'components/home',
    pathMatch: 'full'
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/pages/auth/register/register.module").then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./pages/pages/auth/forgot-password/forgot-password.module").then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: "coming-soon",
    loadChildren: () =>
      import("./pages/pages/coming-soon/coming-soon.module").then(
        (m) => m.ComingSoonModule
      ),
  },
  {
    path: "",
    component: CustomLayoutComponent,
    children: [
      {
        path: "components",
        loadChildren: () =>
          import("./components/components.module").then(
            (m) => m.ComponentsModule
          )
      },
      {
        path: "apps",
        children: [
          {
            path: "aio-table",
            loadChildren: () =>
              import("./pages/apps/aio-table/aio-table.module").then(
                (m) => m.AioTableModule
              ),
          },
        ],
      },
      {
        path: "ui",
        children: [
          {
            path: "components",
            loadChildren: () =>
              import("./pages/ui/components/components.module").then(
                (m) => m.ComponentsModule
              ),
          },
          {
            path: "forms/form-elements",
            loadChildren: () =>
              import(
                "./pages/ui/forms/form-elements/form-elements.module"
              ).then((m) => m.FormElementsModule),
            data: {
              containerEnabled: true,
            },
          },
          {
            path: "forms/form-wizard",
            loadChildren: () =>
              import("./pages/ui/forms/form-wizard/form-wizard.module").then(
                (m) => m.FormWizardModule
              ),
            data: {
              containerEnabled: true,
            },
          },
          {
            path: "icons",
            loadChildren: () =>
              import("./pages/ui/icons/icons.module").then(
                (m) => m.IconsModule
              ),
          },
          {
            path: "page-layouts",
            loadChildren: () =>
              import("./pages/ui/page-layouts/page-layouts.module").then(
                (m) => m.PageLayoutsModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      useHash: true,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
