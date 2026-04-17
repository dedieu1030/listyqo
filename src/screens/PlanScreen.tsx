import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { User, ChevronLeft, ChevronRight, Flame } from 'lucide-react-native';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

const streakPeach = '#FFE8E0';
const todayBlue = '#E3F4FC';
const todayBlueText = '#1E6BB8';
const flameBlue = '#2196F3';
const flameGrey = '#C8C8C8';
const bottomPlanBg = '#E8F4FC';

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dateKey(y: number, m: number, day: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }
  return rows;
}

type DayVisual = 'empty' | 'streak' | 'today' | 'future' | 'planned' | 'pastOld';

function getDayVisual(
  cellDate: Date,
  today: Date,
  plannedKeys: Set<string>
): DayVisual {
  const c = startOfDay(cellDate);
  const t = startOfDay(today);
  const key = dateKey(c.getFullYear(), c.getMonth(), c.getDate());

  if (c.getTime() === t.getTime()) return 'today';
  if (c > t) {
    return plannedKeys.has(key) ? 'planned' : 'future';
  }
  const diffDays = Math.round((t.getTime() - c.getTime()) / 86400000);
  if (diffDays >= 1 && diffDays <= 10) return 'streak';
  return 'pastOld';
}

export const PlanScreen = ({ navigation }: { navigation?: any }) => {
  const [view, setView] = useState(() => new Date());
  const [plannedKeys, setPlannedKeys] = useState<Set<string>>(() => new Set());
  const [cellWidth, setCellWidth] = useState(0);

  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleString('en-US', { month: 'long' });
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const today = useMemo(() => startOfDay(new Date()), []);

  const onGridLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setCellWidth(Math.floor(w / 7));
  }, []);

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  const togglePlan = (day: number) => {
    const key = dateKey(year, month, day);
    const d = new Date(year, month, day);
    if (startOfDay(d) <= today) return;
    setPlannedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Plan</Text>
        <TouchableOpacity
          onPress={() => navigation?.navigate?.('ProfileTab')}
          hitSlop={12}
          accessibilityLabel="Profile"
        >
          <User size={28} color="#111" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>{monthLabel}</Text>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goPrev} hitSlop={8}>
              <ChevronLeft size={22} color={Colors.textHeading} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goNext} hitSlop={8} style={styles.monthNavNext}>
              <ChevronRight size={22} color={Colors.textHeading} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.weekHeader}>
          {WEEKDAYS.map((d, i) => (
            <Text key={`${d}-${i}`} style={styles.weekday}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.grid} onLayout={onGridLayout}>
          {grid.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map((day, ci) => {
                if (day === null) {
                  return (
                    <View
                      key={`e-${ri}-${ci}`}
                      style={[styles.cell, cellWidth ? { width: cellWidth } : undefined]}
                    />
                  );
                }
                const cellDate = new Date(year, month, day);
                const v = getDayVisual(cellDate, today, plannedKeys);
                const isPressable = v === 'future' || v === 'planned';

                const inner = (
                  <>
                    <Text
                      style={[
                        styles.dayNum,
                        v === 'today' && styles.dayNumToday,
                        v === 'pastOld' && styles.dayNumMuted,
                      ]}
                    >
                      {day}
                    </Text>
                    {v === 'streak' && (
                      <Flame size={14} color={Colors.tabBarActive} strokeWidth={2.2} />
                    )}
                    {v === 'today' && (
                      <Flame size={14} color={flameBlue} strokeWidth={2} />
                    )}
                    {(v === 'future' || v === 'planned') && (
                      <Flame size={14} color={flameGrey} strokeWidth={1.5} />
                    )}
                  </>
                );

                return (
                  <TouchableOpacity
                    key={`${day}-${ci}`}
                    style={[
                      styles.cell,
                      cellWidth ? { width: cellWidth } : undefined,
                      v === 'streak' && styles.cellStreak,
                      v === 'today' && styles.cellToday,
                      v === 'planned' && styles.cellPlanned,
                      v === 'pastOld' && styles.cellPastOld,
                    ]}
                    onPress={() => isPressable && togglePlan(day)}
                    activeOpacity={isPressable ? 0.7 : 1}
                    disabled={!isPressable}
                  >
                    {inner}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={styles.hint}>
          Tap a future day to plan ahead (toggle). Streak shows your last 10 completed days.
        </Text>

        <View style={styles.bottomPanel}>
          <Text style={styles.bottomTitle}>Upcoming</Text>
          <Text style={styles.bottomPlaceholder}>
            Planned days appear here — connect lists and reminders next.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Lora_700Bold',
    fontSize: 36,
    color: Colors.textHeading,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.textHeading,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNavNext: {
    marginLeft: 4,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textLight,
  },
  grid: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  cellStreak: {
    backgroundColor: streakPeach,
  },
  cellToday: {
    backgroundColor: todayBlue,
  },
  cellPlanned: {
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.35)',
  },
  dayNum: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textHeading,
    marginBottom: 2,
  },
  dayNumToday: {
    color: todayBlueText,
  },
  dayNumMuted: {
    color: '#B0B0B0',
  },
  cellPastOld: {
    opacity: 0.85,
  },
  hint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textLight,
    marginBottom: 20,
  },
  bottomPanel: {
    backgroundColor: bottomPlanBg,
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
  },
  bottomTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: todayBlueText,
    marginBottom: 8,
  },
  bottomPlaceholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textLight,
  },
});
