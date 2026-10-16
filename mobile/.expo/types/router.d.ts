/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/credit` | `/(app)/funding` | `/(app)/marketplace` | `/(app)/portfolio` | `/(app)/profile` | `/(auth)` | `/(auth)/login` | `/_sitemap` | `/credit` | `/funding` | `/login` | `/marketplace` | `/onboarding` | `/portfolio` | `/profile`;
      DynamicRoutes: `/(app)/funding/${Router.SingleRoutePart<T>}` | `/(app)/project/${Router.SingleRoutePart<T>}` | `/funding/${Router.SingleRoutePart<T>}` | `/project/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/funding/[id]` | `/(app)/project/[slug]` | `/funding/[id]` | `/project/[slug]`;
    }
  }
}
