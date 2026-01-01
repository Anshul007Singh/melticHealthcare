import { Redirect } from 'expo-router';

export default function DrawerIndex() {
  // Redirect to the tabs layout which contains the home screen
  return <Redirect href="/(drawer)/(tabs)/home" />;
}
