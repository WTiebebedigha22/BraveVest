import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function ProgressBar({ percent, height = 6 }: { percent: number; height?: number }) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <View style={{ height, backgroundColor: colors.surfaceMuted, borderRadius: height / 2, overflow: 'hidden' }}>
      <View style={{ height, width: `${pct}%`, backgroundColor: colors.lime, borderRadius: height / 2 }} />
    </View>
  );
}
