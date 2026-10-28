import { Redirect } from 'expo-router';
const DEV_BYPASS = process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS !== '0';
export default function Index() {
  return <Redirect href={DEV_BYPASS ? '/(app)' : '/(auth)/login'} />;
}
