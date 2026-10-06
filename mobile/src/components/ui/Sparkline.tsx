import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function Sparkline({ points, height = 60, color }: { points: number[]; height?: number; color?: string }) {
  const { colors } = useTheme();
  if (!points.length) return null;
  const c = color ?? colors.lime;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height }}>
      {points.map((v, i) => {
        const h = ((v - min) / range) * (height - 8) + 4;
        return <View key={i} style={{ flex: 1, borderRadius: 2, opacity: 0.9, height: h, backgroundColor: c }} />;
      })}
    </View>
  );
}
