import AsyncStorage from '@react-native-async-storage/async-storage';

const BADGE_COUNT_KEY = 'badgeCount';

export const saveBadgeCount = async (count: number) => {
  await AsyncStorage.setItem(BADGE_COUNT_KEY, count.toString());
};

export const getBadgeCount = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(BADGE_COUNT_KEY);
  return value ? parseInt(value, 10) : 0;
};

export const clearBadgeCount = async () => {
  await AsyncStorage.removeItem(BADGE_COUNT_KEY);
};
