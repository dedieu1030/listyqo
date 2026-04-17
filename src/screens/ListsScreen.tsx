import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Animated, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { User, ChevronUp, CheckCircle, Plus, Trash2, LayoutGrid, LayoutList, Check } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;
const SPACING = 16;
const FULL_SIZE = CARD_WIDTH + SPACING;

const TODAY_ROW_MIN = 52;
const CHECKBOX_SIZE = 22;
const SEPARATOR = Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1;

// A decorative element mimicking the daisy from the reference image
const MockDaisy = ({ size = 40, color = "#FFFFFF" }) => (
  <View style={styles.decorativeWrapper}>
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="15" fill="#FBC02D" />
      <Path 
        d="M50 35 Q55 20 50 5 Q45 20 50 35 
           M65 50 Q80 55 95 50 Q80 45 65 50 
           M50 65 Q55 80 50 95 Q45 80 50 65 
           M35 50 Q20 55 5 50 Q20 45 35 50
           M60 40 Q75 30 85 40 Q75 50 60 40
           M40 40 Q25 30 15 40 Q25 50 40 40
           M60 60 Q75 70 85 60 Q75 50 60 60
           M40 60 Q25 70 15 60 Q25 50 40 60" 
        fill={color} 
      />
    </Svg>
  </View>
);

export const ListsScreen = ({ navigation }: any) => {
  const { 
    lists, addList, 
    todayItems, addTodayItem, toggleTodayItem, deleteTodayItem 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('week');
  const [viewMode, setViewMode] = useState<'list' | 'carousel'>('carousel');

  const [newListMode, setNewListMode] = useState(false);
  const [newListName, setNewListName] = useState('');

  const [newTodayItemMode, setNewTodayItemMode] = useState(false);
  const [newTodayItemName, setNewTodayItemName] = useState('');

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleCreateList = () => {
    if (newListName.trim().length > 0) {
      addList(newListName.trim());
      setNewListName('');
      setNewListMode(false);
    }
  };

  const handleAddTodayItem = () => {
    if (newTodayItemName.trim().length > 0) {
      addTodayItem(newTodayItemName.trim());
      setNewTodayItemName('');
      setNewTodayItemMode(false);
    }
  };

  const cardColors = ['#A5E3C1', '#36C185', '#57C693', '#F2AE72', '#EED8A1'];

  // Static Lists
  const itemCount = lists.length;
  const isInfinite = itemCount >= 3;
  const BUFFER_SETS = 100;

  const virtualLists = React.useMemo(() => {
    if (itemCount === 0) return [];
    if (!isInfinite) {
      return lists.map((list: any, idx: number) => ({
        ...list,
        virtualId: `${list.id}-single`,
        realIndex: idx
      }));
    }
    return Array(BUFFER_SETS).fill(0).flatMap((_, setIdx) => 
      lists.map((list: any, idx: number) => ({
        ...list,
        virtualId: `${list.id}-${setIdx}-${idx}`,
        realIndex: idx
      }))
    );
  }, [lists, itemCount, isInfinite]);

  const initialIndex = isInfinite ? Math.floor(BUFFER_SETS / 2) * itemCount : 0;

  const renderCarouselItem = (item: any, _index: number) => {
    const realIdx = item.realIndex;
    const isCompleted = realIdx === 0;
    
    const ITEM_WIDTH = width * 0.75;
    const CARD_WIDTH = ITEM_WIDTH - 16;
    
    // We use a safe index for interpolation relative to the scroll offset
    // In an infinite list, each item has a unique position (index * ITEM_WIDTH)
    const inputRange = [
      (_index - 1) * ITEM_WIDTH,
      _index * ITEM_WIDTH,
      (_index + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' });
    const translateY = scrollX.interpolate({ inputRange, outputRange: [25, 0, 25], extrapolate: 'clamp' });
    const rotateY = scrollX.interpolate({ inputRange, outputRange: ['-15deg', '0deg', '15deg'], extrapolate: 'clamp' });
    const rotateX = scrollX.interpolate({ inputRange, outputRange: ['15deg', '0deg', '15deg'], extrapolate: 'clamp' });

    return (
      <View style={{ width: ITEM_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={[
          styles.carouselPhysicalCard, 
          { 
            width: CARD_WIDTH,
            // STABLE COLOR & TEXT: use realIdx, not _index
            backgroundColor: cardColors[realIdx % cardColors.length], 
            transform: [
              { perspective: 850 }, 
              { scale }, 
              { translateY },
              { rotateX },
              { rotateY }
            ]
          }
        ]}>
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.carouselCardInner}
            onPress={() => navigation.navigate('ListDetails', { listId: item.id, listName: item.name })}
          >
            <View style={styles.carouselImageTop}>
               <MockDaisy size={65} />
            </View>
            
            <View style={styles.carouselBody}>
              <View>
                <Text style={styles.carouselListTitle} numberOfLines={1}>{item.name}</Text>
                <View style={styles.carouselMeta}>
                  <Text style={styles.carouselLessonText}>Lesson {realIdx + 1}</Text>
                  {isCompleted && <CheckCircle size={20} color="#111" strokeWidth={2.5} />}
                </View>
                <Text style={styles.carouselDesc} numberOfLines={2}>Learn how to manage this list.</Text>
              </View>

              <View style={styles.carouselActionRow}>
                <View style={styles.btnPrimaryCarousel}>
                  <Text style={styles.btnPrimaryText}>Start now</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Area */}
        <View style={styles.headerArea}>
          <View style={styles.topHeaderRow}>
            <Text style={styles.mainTitle}>Hi, Jamie</Text>
            <User size={28} color="#111" strokeWidth={2} />
          </View>

          {/* Tabs Row + Toggle View */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              onPress={() => setViewMode(viewMode === 'list' ? 'carousel' : 'list')}
              style={styles.viewToggle}
            >
              {viewMode === 'list' ? <LayoutGrid size={22} color="#111" /> : <LayoutList size={22} color="#111" />}
            </TouchableOpacity>

            <View style={styles.tabsRow}>
              <View>
                <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('today')}>
                  <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
                </TouchableOpacity>
                {activeTab === 'today' && <View style={styles.tabUnderline} />}
              </View>
              
              <View>
                <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('week')}>
                  <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>Learning Plan</Text>
                </TouchableOpacity>
                {activeTab === 'week' && <View style={styles.tabUnderline} />}
              </View>
            </View>
          </View>
        </View>

        {activeTab === 'week' && (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Greet people and{"\n"}say goodbye</Text>
              <ChevronUp size={24} color="#111" strokeWidth={2.5} />
            </View>

            {lists.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No lists saved for this week.</Text>
              </View>
            ) : (
              viewMode === 'carousel' ? (
                <View>
                  <Animated.FlatList
                    data={virtualLists}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.virtualId}
                    contentContainerStyle={{ paddingHorizontal: (width - (width * 0.75)) / 2, paddingTop: 20, paddingBottom: 80 }}
                    snapToInterval={width * 0.75}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    initialScrollIndex={itemCount > 0 ? initialIndex : 0}
                    getItemLayout={(_, index) => ({
                      length: width * 0.75,
                      offset: (width * 0.75) * index,
                      index,
                    })}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                      { useNativeDriver: false } // Required false for animating width
                    )}
                    renderItem={({ item, index }) => renderCarouselItem(item, index)}
                  />
                  <View style={styles.carouselFooter}>
                    <View style={styles.paginationRow}>
                      {lists.map((_, i) => {
                        const ITEM_WIDTH = width * 0.75;
                        const len = lists.length;
                        
                        // "Effet Cercle" Indicator logic matching Icchub's modulo-sync
                        // We map the active state over a range of scroll positions
                        const inputRange = [];
                        const outputRangeWidth = [];
                        const outputRangeOpacity = [];
                        
                        // We map enough range to handle infinite scroll wrapping
                        // In standard Animated, we map specifically the visible virtual indices
                        // but a more generic approach is mapping the fractional current position.
                        
                        const rawInputRange = virtualLists.map((_, j) => j * ITEM_WIDTH);
                        const rawOutputWidth = virtualLists.map((_, j) => (j % len) === i ? 24 : 8);
                        const rawOutputOpacity = virtualLists.map((_, j) => (j % len) === i ? 0.9 : 0.2);

                        const safeInputRange = rawInputRange.length > 1 ? rawInputRange : [0, ITEM_WIDTH];
                        const safeOutputWidth = rawOutputWidth.length > 1 ? rawOutputWidth : [(i === 0 ? 24 : 8), (i === 0 ? 24 : 8)];
                        const safeOutputOpacity = rawOutputOpacity.length > 1 ? rawOutputOpacity : [(i === 0 ? 0.9 : 0.2), (i === 0 ? 0.9 : 0.2)];

                        const dotWidth = scrollX.interpolate({
                          inputRange: safeInputRange,
                          outputRange: safeOutputWidth,
                          extrapolate: 'clamp'
                        });
                        
                        const dotOpacity = scrollX.interpolate({
                          inputRange: safeInputRange,
                          outputRange: safeOutputOpacity,
                          extrapolate: 'clamp'
                        });

                        return (
                          <Animated.View 
                            key={i} 
                            style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]} 
                          />
                        );
                      })}
                    </View>
                    <Text style={styles.swipeText}>Swipe To Next List</Text>
                  </View>
                </View>
              ) : (
                lists.map((list, index) => {
                  const isFocused = index === 1;
                  const isCompleted = index === 0;

                  return (
                    <View key={list.id} style={[styles.listItemRow, isFocused && styles.listItemRowFocused]}>
                      <View style={styles.rowContent}>
                          <TouchableOpacity 
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('ListDetails', { listId: list.id, listName: list.name })}
                            style={[styles.colorSquare, { backgroundColor: cardColors[index % cardColors.length] }]}
                          >
                            <Text style={styles.squareTitle}>{list.name}</Text>
                            {index % 2 === 1 && <MockDaisy />}
                            <View style={styles.squareBottom}>
                              <Text style={styles.squareSubtitle}>Lesson {index + 1}</Text>
                              {isCompleted && <CheckCircle size={20} color="#111" strokeWidth={2.5} />}
                            </View>
                          </TouchableOpacity>

                          <View style={styles.listDetails}>
                            <Text style={styles.listDesc}>
                              {isFocused ? "Learn to say which languages you speak" : "Learn how to greet someone."}
                            </Text>
                            <TouchableOpacity 
                              style={isFocused ? styles.btnPrimary : styles.btnPlain}
                              onPress={() => navigation.navigate('ListDetails', { listId: list.id, listName: list.name })}
                            >
                              <Text style={isFocused ? styles.btnPrimaryText : styles.btnPlainText}>
                                {isFocused ? 'Start now' : (isCompleted ? 'Repeat' : 'Start')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                    </View>
                  );
                })
              )
            )}

            <View style={styles.creatorWrapper}>
               {newListMode ? (
                  <View style={styles.createInputContainer}>
                    <TextInput style={styles.input} value={newListName} onChangeText={setNewListName} placeholder="List name..." autoFocus />
                    <TouchableOpacity style={styles.saveButton} onPress={handleCreateList}>
                       <Text style={styles.saveButtonText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setNewListMode(false)}><Text style={styles.cancelButtonText}>X</Text></TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.bottomCreateButton} onPress={() => setNewListMode(true)}>
                    <Plus size={20} color="#111" strokeWidth={3} style={{marginRight: 8}} />
                    <Text style={styles.bottomCreateButtonText}>Create new list</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}

        {activeTab === 'today' && (
          <View style={styles.contentSection}>
            <View style={styles.todayFoodList}>
              {todayItems.map((item) => (
                <View key={item.id} style={styles.todayRow}>
                  <Pressable
                    style={styles.todayRowMain}
                    onPress={() => toggleTodayItem(item.id)}
                    android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                  >
                    <View style={styles.todayCheckboxSlot}>
                      <View
                        style={[
                          styles.todayCheckboxBox,
                          item.checked && styles.todayCheckboxBoxChecked,
                        ]}
                      >
                        {item.checked ? (
                          <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        ) : null}
                      </View>
                    </View>
                    <Text
                      style={[styles.todayItemLabel, item.checked && styles.todayItemLabelDone]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                  <TouchableOpacity
                    style={styles.todayDeleteBtn}
                    onPress={() => deleteTodayItem(item.id)}
                    hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                    accessibilityLabel="Delete item"
                  >
                    <Trash2 size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}

              {newTodayItemMode ? (
                <View style={[styles.todayRow, styles.todayAddRow]}>
                  <View style={styles.todayCheckboxSlot} />
                  <TextInput
                    style={styles.todayAddInput}
                    value={newTodayItemName}
                    onChangeText={setNewTodayItemName}
                    placeholder="New item"
                    placeholderTextColor={Colors.textLight}
                    onSubmitEditing={handleAddTodayItem}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    autoFocus
                  />
                  <TouchableOpacity onPress={() => { setNewTodayItemName(''); setNewTodayItemMode(false); }}>
                    <Text style={styles.todayAddCancel}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.todayRow, pressed && styles.todayRowPressed]}
                  onPress={() => setNewTodayItemMode(true)}
                  android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                >
                  <View style={styles.todayCheckboxSlot}>
                    <Plus size={22} color={Colors.textHeading} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.todayAddHint}>Add item</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },
  headerArea: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 },
  topHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontFamily: 'Lora_700Bold', fontSize: 40, color: '#111' },
  tabsContainer: { flexDirection: 'row', alignItems: 'center' },
  viewToggle: { marginRight: 24, backgroundColor: '#F5F4EE', padding: 8, borderRadius: 12 },
  tabsRow: { flexDirection: 'row', gap: 28 },
  tabBtn: { paddingBottom: 6 },
  tabUnderline: { height: 2, backgroundColor: '#111', width: '100%', position: 'absolute', bottom: 0 },
  tabText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#8A8A8A' },
  tabTextActive: { color: '#111' },
  contentSection: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  sectionTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, lineHeight: 32, color: '#111' },
  todayFoodList: {
    marginHorizontal: 24,
    borderTopWidth: SEPARATOR,
    borderTopColor: Colors.listDivider,
    backgroundColor: Colors.background,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TODAY_ROW_MIN,
    borderBottomWidth: SEPARATOR,
    borderBottomColor: Colors.listDivider,
    backgroundColor: Colors.background,
  },
  todayRowPressed: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  todayRowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TODAY_ROW_MIN,
    paddingLeft: 0,
  },
  todayCheckboxSlot: {
    width: 40,
    minHeight: TODAY_ROW_MIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCheckboxBox: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  todayCheckboxBoxChecked: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  todayItemLabel: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    lineHeight: 22,
    color: Colors.textHeading,
    paddingVertical: 14,
    paddingRight: 8,
  },
  todayItemLabelDone: {
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },
  todayDeleteBtn: {
    width: 44,
    minHeight: TODAY_ROW_MIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayAddRow: {
    paddingRight: 12,
  },
  todayAddInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    lineHeight: 22,
    color: Colors.textHeading,
    paddingVertical: 12,
    marginRight: 8,
    minHeight: 44,
  },
  todayAddCancel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#FF3B30',
  },
  todayAddHint: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    lineHeight: 22,
    color: Colors.textLight,
    paddingVertical: 14,
  },
  
  // Carousel Specific
  carouselPhysicalCard: {
    borderRadius: 36,
    padding: 24,
    height: 440,
    justifyContent: 'space-between'
  },
  carouselCardInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carouselImageTop: { 
    height: 120, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 24 
  },
  carouselBody: {
    paddingTop: 16,
  },
  carouselListTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, color: '#111', marginBottom: 4 },
  carouselMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  carouselLessonText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#111' },
  carouselDesc: { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#444', lineHeight: 22, marginTop: 12, marginBottom: 24 },
  carouselActionRow: { alignItems: 'center' },
  btnPrimaryCarousel: { backgroundColor: '#111', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center' },
  carouselFooter: { 
    position: 'absolute',
    bottom: 25, // Sits precisely inside the flatlist's paddingBottom space, just below the central card
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none'
  },
  paginationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#111', marginHorizontal: 4 },
  swipeText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#8A8A8A' },

  // Original List Styles
  listItemRow: { width: '100%', paddingVertical: 12 },
  listItemRowFocused: { backgroundColor: '#F5F4EE' },
  rowContent: { flexDirection: 'row', paddingHorizontal: 24 },
  rowContentCompact: { flexDirection: 'row', paddingHorizontal: 24, alignItems: 'center' },
  colorSquare: { width: 140, height: 130, borderRadius: 20, padding: 16, justifyContent: 'space-between', position: 'relative', overflow: 'hidden' },
  colorSquareSmall: { width: 80, height: 80, borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  decorativeWrapper: { position: 'absolute' },
  squareTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 17, color: '#000', lineHeight: 22 },
  squareBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  squareSubtitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#000' },
  listDetails: { flex: 1, marginLeft: 20, justifyContent: 'space-between', paddingVertical: 4 },
  listDetailsCompact: { flex: 1, marginLeft: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listDesc: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#666', lineHeight: 20, paddingRight: 10 },
  itemText: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#111' },
  btnPrimary: { backgroundColor: '#111', alignSelf: 'flex-start', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30 },
  btnPrimaryText: { fontFamily: 'Inter_700Bold', color: '#FFF', fontSize: 15 },
  btnPlain: { alignSelf: 'flex-end', paddingVertical: 12 },
  btnPlainText: { fontFamily: 'Inter_800ExtraBold', color: '#111', fontSize: 15 },
  emptyContainer: { padding: 24, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#8A8A8A', textAlign: 'center' },
  creatorWrapper: { paddingVertical: 30, paddingHorizontal: 24 },
  bottomCreateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F4EE', paddingVertical: 16, borderRadius: 16 },
  bottomCreateButtonText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111' },
  createInputContainer: { flexDirection: 'row', backgroundColor: '#F5F4EE', borderRadius: 16, padding: 12, alignItems: 'center', gap: 10 },
  input: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 16, color: '#111', padding: 8 },
  saveButton: { backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  saveButtonText: { fontFamily: 'Inter_700Bold', color: '#FFF', fontSize: 14 },
  cancelButtonText: { fontFamily: 'Inter_800ExtraBold', color: '#111', fontSize: 16 , marginLeft: 10}
});
