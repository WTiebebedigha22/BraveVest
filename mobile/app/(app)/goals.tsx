import { View, Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

export default function Goals() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 22 }}>Goals</Text>
    </View>
  );
}
