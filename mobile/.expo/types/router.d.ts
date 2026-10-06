/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/goals` | `/(app)/marketplace` | `/(app)/portfolio` | `/(app)/profile` | `/(auth)` | `/(auth)/login` | `/_sitemap` | `/goals` | `/login` | `/marketplace` | `/onboarding` | `/portfolio` | `/profile`;
      DynamicRoutes: `/(app)/project/${Router.SingleRoutePart<T>}` | `/project/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/project/[slug]` | `/project/[slug]`;
    }
  }
}
