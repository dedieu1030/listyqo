import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react-native';
import { SCREEN_EDGE, tabRootHeaderRow, tabRootTitleText } from '../theme/layout';

/** Couleurs calibrées sur la maquette « Streak » (juin, flammes, pastilles). */
const streakPeachBg = '#FFF0EB';
const todayBlueBg = '#E3F4FC';
const todayBlueText = '#1E4A8C';
const todayFlameBlue = '#2563C2';
const streakFlameOrange = '#FF5A22';
const futureFlameGrey = '#C8C8C8';

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
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

type CellKind = 'empty' | 'streak' | 'today' | 'future' | 'pastNeutral';

function cellKind(cellDate: Date, today: Date): CellKind {
  const c = startOfDay(cellDate);
  const t = startOfDay(today);
  if (c.getTime() === t.getTime()) return 'today';
  if (c > t) return 'future';
  const diffDays = Math.round((t.getTime() - c.getTime()) / 86400000);
  if (diffDays >= 1 && diffDays <= 10) return 'streak';
  return 'pastNeutral';
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export const PlanScreen = () => {
  const [view, setView] = useState(() => new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleString('en-US', { month: 'long' });
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const today = useMemo(() => startOfDay(new Date()), []);

  const goPrev = () => setView(new Date(year, month - 1, 1));
  const goNext = () => setView(new Date(year, month + 1, 1));

  const renderFlame = (kind: CellKind) => {
    if (kind === 'streak') {
      return (
        <Flame
          size={15}
          color={streakFlameOrange}
          fill={streakFlameOrange}
          strokeWidth={0}
        />
      );
    }
    if (kind === 'today') {
      return (
        <Flame
          size={15}
          color={todayFlameBlue}
          strokeWidth={2}
          fill="transparent"
        />
      );
    }
    /* future + pastNeutral : flamme contour gris, comme la maquette */
    return (
      <Flame
        size={15}
        color={futureFlameGrey}
        strokeWidth={1.6}
        fill="transparent"
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={tabRootHeaderRow} accessibilityRole="header">
        <Text style={tabRootTitleText}>Streak</Text>
        <View style={styles.headerRightSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>{monthLabel}</Text>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goPrev} hitSlop={10} accessibilityLabel="Previous month">
              <ChevronLeft size={22} color="#111" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={goNext}
              hitSlop={10}
              accessibilityLabel="Next month"
              style={styles.monthNavNext}
            >
              <ChevronRight size={22} color="#111" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.weekHeader}>
          {WEEKDAYS.map((d, i) => (
            <Text key={`w-${i}`} style={styles.weekday}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {grid.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map((day, ci) => {
                if (day === null) {
                  return <View key={`e-${ri}-${ci}`} style={styles.cellSlot} />;
                }
                const cellDate = new Date(year, month, day);
                const kind = cellKind(cellDate, today);

                return (
                  <View key={`d-${day}`} style={styles.cellSlot}>
                    <View
                      style={[
                        styles.cell,
                        kind === 'streak' && styles.cellStreak,
                        kind === 'today' && styles.cellToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNum,
                          kind === 'today' && styles.dayNumToday,
                        ]}
                      >
                        {day}
                      </Text>
                      {renderFlame(kind)}
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.bottomPanel} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SCREEN_EDGE,
    paddingBottom: 32,
  },
  headerRightSpacer: { width: 28 },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  monthText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#111',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNavNext: {
    marginLeft: 8,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#8A8A8A',
  },
  grid: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cellSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 58,
  },
  cell: {
    width: '100%',
    maxWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  cellStreak: {
    backgroundColor: streakPeachBg,
  },
  cellToday: {
    backgroundColor: todayBlueBg,
  },
  dayNum: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#111',
    marginBottom: 4,
  },
  dayNumToday: {
    color: todayBlueText,
  },
  bottomPanel: {
    marginTop: 28,
    minHeight: 200,
    borderRadius: 20,
    backgroundColor: '#E8F4FC',
  },
});
