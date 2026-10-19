/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/credit` | `/(app)/deposit` | `/(app)/funding` | `/(app)/funding/marketplace` | `/(app)/marketplace` | `/(app)/notifications` | `/(app)/portfolio` | `/(app)/profile` | `/(app)/reinvest` | `/(app)/request-funding` | `/(app)/rewards` | `/(app)/settings` | `/(app)/statements` | `/(app)/support` | `/(app)/withdraw` | `/(auth)` | `/(auth)/forgot-password` | `/(auth)/login` | `/(auth)/register` | `/(auth)/reset-password` | `/(auth)/verify-email` | `/_sitemap` | `/credit` | `/deposit` | `/forgot-password` | `/funding` | `/funding/marketplace` | `/login` | `/marketplace` | `/notifications` | `/onboarding` | `/portfolio` | `/profile` | `/register` | `/reinvest` | `/request-funding` | `/reset-password` | `/rewards` | `/settings` | `/statements` | `/support` | `/verify-email` | `/withdraw`;
      DynamicRoutes: `/(app)/funding/${Router.SingleRoutePart<T>}` | `/(app)/project/${Router.SingleRoutePart<T>}` | `/funding/${Router.SingleRoutePart<T>}` | `/project/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/funding/[id]` | `/(app)/project/[slug]` | `/funding/[id]` | `/project/[slug]`;
    }
  }
}
