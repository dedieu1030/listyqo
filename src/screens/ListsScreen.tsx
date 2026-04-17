import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Colors } from '../theme/colors';
import { SCREEN_EDGE, tabRootTitleText } from '../theme/layout';
import { useStore } from '../store';
import type { ListItem } from '../store';
import { User, ChevronUp, CheckCircle, Plus, Check, Minus } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

/** Case à cocher et zone texte : même hauteur pour rester centrés sur l’axe vertical. */
const TODAY_LINE_H = 22;

const DELETE_SLOT_W = 40;
const GRIP_SLOT_W = 32;
const EDIT_ANIM_MS = 280;

function DragHandleGrey() {
  return (
    <View style={styles.dragHandle} accessibilityLabel="Reorder">
      <View style={styles.dragBar} />
      <View style={styles.dragBar} />
      <View style={styles.dragBar} />
    </View>
  );
}

// A decorative element mimicking the daisy from the reference image
const MockDaisy = ({ size = 40, color = '#FFFFFF' }) => (
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
    lists,
    addList,
    todayItems,
    addTodayItem,
    toggleTodayItem,
    deleteTodayItem,
    setTodayItems,
  } = useStore();
  const [activeTab, setActiveTab] = useState<'today' | 'saved'>('saved');

  const [newListMode, setNewListMode] = useState(false);
  const [newListName, setNewListName] = useState('');

  const [newTodayItemMode, setNewTodayItemMode] = useState(false);
  const [newTodayItemName, setNewTodayItemName] = useState('');
  const [todayListEditMode, setTodayListEditMode] = useState(false);

  const todayDraftCommitLock = useRef(false);
  const editProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(editProgress, {
      toValue: todayListEditMode ? 1 : 0,
      duration: EDIT_ANIM_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [todayListEditMode, editProgress]);

  /** Largeur 0 → plein : révèle suppression (gauche) et poignée (droite) sans réserver d’espace hors édition. */
  const deleteSlotW = editProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DELETE_SLOT_W],
  });
  const gripSlotW = editProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, GRIP_SLOT_W],
  });

  const handleCreateList = () => {
    if (newListName.trim().length > 0) {
      addList(newListName.trim());
      setNewListName('');
      setNewListMode(false);
    }
  };

  const handleAddTodayItem = () => {
    if (todayDraftCommitLock.current) return;
    todayDraftCommitLock.current = true;
    const t = newTodayItemName.trim();
    if (t.length > 0) {
      addTodayItem(t);
      setNewTodayItemName('');
    }
    setNewTodayItemMode(false);
    queueMicrotask(() => {
      todayDraftCommitLock.current = false;
    });
  };

  const toggleTodayEditMode = () => {
    if (!todayListEditMode) {
      if (newTodayItemMode) {
        handleAddTodayItem();
      }
      setTodayListEditMode(true);
    } else {
      setTodayListEditMode(false);
    }
  };

  const setActiveTabSafe = (tab: 'today' | 'saved') => {
    if (tab === 'saved') {
      setTodayListEditMode(false);
    }
    setActiveTab(tab);
  };

  const renderTodayItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<ListItem>) => {
      const rowInner = (
        <View style={[styles.todayItemRowInner, isActive && styles.todayItemRowDragging]}>
          <Animated.View style={[styles.deleteSlot, { width: deleteSlotW }]}>
            <View style={styles.deleteSlideWrap}>
              <Pressable
                hitSlop={8}
                disabled={!todayListEditMode}
                onPress={() => deleteTodayItem(item.id)}
                style={({ pressed }) => [
                  styles.deleteCircle,
                  pressed && todayListEditMode && styles.deleteCirclePressed,
                ]}
                accessibilityLabel="Delete item"
              >
                <Minus size={16} color="#FFFFFF" strokeWidth={2.5} />
              </Pressable>
            </View>
          </Animated.View>

          {todayListEditMode ? (
            <TouchableOpacity
              style={styles.todayCheckbox}
              onPress={() => toggleTodayItem(item.id)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
            >
              <View
                style={[
                  styles.todayCheckboxBox,
                  item.checked && styles.todayCheckboxChecked,
                ]}
              >
                {item.checked ? (
                  <Check size={14} color={Colors.white} strokeWidth={3} />
                ) : null}
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={styles.todayCheckbox}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.checked }}
            >
              <View
                style={[
                  styles.todayCheckboxBox,
                  item.checked && styles.todayCheckboxChecked,
                ]}
              >
                {item.checked ? (
                  <Check size={14} color={Colors.white} strokeWidth={3} />
                ) : null}
              </View>
            </View>
          )}

          <View style={styles.todayItemTextWrap}>
            <TextInput
              editable={false}
              pointerEvents="none"
              value={item.name}
              scrollEnabled={false}
              caretHidden
              selectTextOnFocus={false}
              numberOfLines={1}
              style={[styles.todayItemInput, item.checked && styles.todayItemLabelDone]}
              underlineColorAndroid="transparent"
            />
          </View>

          <Animated.View style={[styles.gripSlot, { width: gripSlotW }]}>
            <View style={styles.gripSlideWrap}>
              <Pressable
                onLongPress={() => todayListEditMode && drag()}
                delayLongPress={180}
                disabled={!todayListEditMode}
                style={styles.gripHit}
                accessibilityLabel="Drag to reorder"
              >
                <DragHandleGrey />
              </Pressable>
            </View>
          </Animated.View>
        </View>
      );

      if (todayListEditMode) {
        return (
          <View style={styles.todayItemCell}>
            {rowInner}
            <View style={styles.todayItemHairline} />
          </View>
        );
      }

      return (
        <View style={styles.todayItemCell}>
          <TouchableOpacity
            onPress={() => toggleTodayItem(item.id)}
            activeOpacity={0.65}
          >
            {rowInner}
          </TouchableOpacity>
          <View style={styles.todayItemHairline} />
        </View>
      );
    },
    [todayListEditMode, deleteSlotW, gripSlotW, toggleTodayItem, deleteTodayItem]
  );

  const todayListFooter = () => {
    if (todayListEditMode) {
      return <View style={styles.todayFooterSpacer} />;
    }
    if (newTodayItemMode) {
      return (
        <View style={styles.todayItemCell}>
          <View style={styles.todayItemRow}>
            <View style={styles.todayCheckbox}>
              <View style={styles.todayCheckboxBox} />
            </View>
            <View style={styles.todayItemTextWrap}>
              <TextInput
                style={styles.todayItemInput}
                value={newTodayItemName}
                onChangeText={setNewTodayItemName}
                placeholder=""
                onSubmitEditing={handleAddTodayItem}
                onBlur={handleAddTodayItem}
                returnKeyType="done"
                blurOnSubmit
                autoFocus
                multiline={false}
                numberOfLines={1}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.todayItemCell, styles.todayAddRow]}
        onPress={() => setNewTodayItemMode(true)}
        activeOpacity={0.65}
      >
        <View style={styles.todayCheckboxSlot}>
          <Plus size={20} color={Colors.textHeading} strokeWidth={2} />
        </View>
      </TouchableOpacity>
    );
  };

  const cardColors = ['#A5E3C1', '#36C185', '#57C693', '#F2AE72', '#EED8A1'];

  const headerBlock = (
    <View style={styles.headerArea}>
      <View style={styles.topHeaderRow}>
        <Text style={tabRootTitleText}>Hi, Jamie</Text>
        <User size={28} color="#111" strokeWidth={2} />
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          <View>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTabSafe('today')}>
              <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>
                Today
              </Text>
            </TouchableOpacity>
            {activeTab === 'today' && <View style={styles.tabUnderline} />}
          </View>

          <View>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTabSafe('saved')}>
              <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
                Saved list
              </Text>
            </TouchableOpacity>
            {activeTab === 'saved' && <View style={styles.tabUnderline} />}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {headerBlock}

      {activeTab === 'saved' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.flexOne}
        >
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Greet people and{'\n'}say goodbye
              </Text>
              <ChevronUp size={24} color="#111" strokeWidth={2.5} />
            </View>

            {lists.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No saved lists yet.</Text>
              </View>
            ) : (
              lists.map((list, index) => {
                const isFocused = index === 1;
                const isCompleted = index === 0;

                return (
                  <View
                    key={list.id}
                    style={[styles.listItemRow, isFocused && styles.listItemRowFocused]}
                  >
                    <View style={styles.rowContent}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          navigation.navigate('ListDetails', {
                            listId: list.id,
                            listName: list.name,
                          })
                        }
                        style={[
                          styles.colorSquare,
                          { backgroundColor: cardColors[index % cardColors.length] },
                        ]}
                      >
                        <Text style={styles.squareTitle}>{list.name}</Text>
                        {index % 2 === 1 && <MockDaisy />}
                        <View style={styles.squareBottom}>
                          <Text style={styles.squareSubtitle}>Lesson {index + 1}</Text>
                          {isCompleted && (
                            <CheckCircle size={20} color="#111" strokeWidth={2.5} />
                          )}
                        </View>
                      </TouchableOpacity>

                      <View style={styles.listDetails}>
                        <Text style={styles.listDesc}>
                          {isFocused
                            ? 'Learn to say which languages you speak'
                            : 'Learn how to greet someone.'}
                        </Text>
                        <TouchableOpacity
                          style={isFocused ? styles.btnPrimary : styles.btnPlain}
                          onPress={() =>
                            navigation.navigate('ListDetails', {
                              listId: list.id,
                              listName: list.name,
                            })
                          }
                        >
                          <Text style={isFocused ? styles.btnPrimaryText : styles.btnPlainText}>
                            {isFocused ? 'Start now' : isCompleted ? 'Repeat' : 'Start'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}

            <View style={styles.creatorWrapper}>
              {newListMode ? (
                <View style={styles.createInputContainer}>
                  <TextInput
                    style={styles.input}
                    value={newListName}
                    onChangeText={setNewListName}
                    placeholder="List name..."
                    autoFocus
                  />
                  <TouchableOpacity style={styles.saveButton} onPress={handleCreateList}>
                    <Text style={styles.saveButtonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setNewListMode(false)}>
                    <Text style={styles.cancelButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.bottomCreateButton} onPress={() => setNewListMode(true)}>
                  <Plus size={20} color="#111" strokeWidth={2} style={{ marginRight: 8 }} />
                  <Text style={styles.bottomCreateButtonText}>Create new list</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {activeTab === 'today' && (
        <View style={styles.todayTabWrap}>
          <View style={styles.todayEditBar}>
            <Text style={styles.todayEditBarLabel}>Today</Text>
            <TouchableOpacity onPress={toggleTodayEditMode} hitSlop={12}>
              <Text style={styles.todayEditBarAction}>
                {todayListEditMode ? 'Done' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <DraggableFlatList
            style={styles.flexOne}
            data={todayItems}
            extraData={{ todayListEditMode, newTodayItemMode }}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => setTodayItems(data)}
            renderItem={({ item, drag, isActive }) => (
              <ScaleDecorator>
                {renderTodayItem({ item, drag, isActive })}
              </ScaleDecorator>
            )}
            ListFooterComponent={todayListFooter}
            containerStyle={styles.draggableContainer}
            activationDistance={todayListEditMode ? 10 : 1000}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  flexOne: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  draggableContainer: { flex: 1 },
  todayTabWrap: { flex: 1 },
  headerArea: { paddingHorizontal: SCREEN_EDGE, paddingTop: 20, paddingBottom: 20 },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabsContainer: { flexDirection: 'row', alignItems: 'center' },
  tabsRow: { flexDirection: 'row', gap: 28 },
  tabBtn: { paddingBottom: 6 },
  tabUnderline: {
    height: 2,
    backgroundColor: '#111',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  tabText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#8A8A8A' },
  tabTextActive: { color: '#111' },
  contentSection: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 26,
    lineHeight: 32,
    color: '#111',
  },
  todayEditBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_EDGE,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(17, 17, 17, 0.08)',
  },
  todayEditBarLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#111',
  },
  todayEditBarAction: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  todayItemCell: {
    width: '100%',
  },
  todayItemHairline: {
    height: 1,
    marginHorizontal: SCREEN_EDGE,
    backgroundColor: 'rgba(17, 17, 17, 0.07)',
  },
  todayItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: SCREEN_EDGE,
  },
  todayItemRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: SCREEN_EDGE,
  },
  todayItemRowDragging: {
    opacity: 0.95,
  },
  deleteSlot: {
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  deleteSlideWrap: {
    width: DELETE_SLOT_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCirclePressed: {
    opacity: 0.85,
  },
  todayCheckbox: {
    marginRight: 14,
  },
  todayCheckboxBox: {
    width: TODAY_LINE_H,
    height: TODAY_LINE_H,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D8D6D0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.background,
  },
  todayCheckboxChecked: {
    borderColor: Colors.black,
    backgroundColor: Colors.black,
  },
  todayItemLabelDone: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  todayItemTextWrap: {
    flex: 1,
    height: TODAY_LINE_H,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  todayItemInput: {
    width: '100%',
    height: TODAY_LINE_H,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textHeading,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      android: {
        lineHeight: TODAY_LINE_H,
        paddingVertical: 0,
        textAlignVertical: 'center',
        includeFontPadding: false,
      },
    }),
  },
  todayCheckboxSlot: {
    width: TODAY_LINE_H,
    height: TODAY_LINE_H,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  gripSlot: {
    overflow: 'hidden',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  gripSlideWrap: {
    width: GRIP_SLOT_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gripHit: {
    paddingVertical: 8,
    paddingLeft: 8,
  },
  dragHandle: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dragBar: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#9E9E9E',
  },
  todayFooterSpacer: {
    height: 24,
  },
  todayAddRow: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: SCREEN_EDGE,
  },

  // Saved lists (list layout)
  listItemRow: { width: '100%', paddingVertical: 12 },
  listItemRowFocused: { backgroundColor: '#F5F4EE' },
  rowContent: { flexDirection: 'row', paddingHorizontal: 24 },
  colorSquare: {
    width: 140,
    height: 130,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeWrapper: { position: 'absolute' },
  squareTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 17, color: '#000', lineHeight: 22 },
  squareBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  squareSubtitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#000' },
  listDetails: { flex: 1, marginLeft: 20, justifyContent: 'space-between', paddingVertical: 4 },
  listDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
    paddingRight: 10,
  },
  btnPrimary: {
    backgroundColor: '#111',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  btnPrimaryText: { fontFamily: 'Inter_700Bold', color: '#FFF', fontSize: 15 },
  btnPlain: { alignSelf: 'flex-end', paddingVertical: 12 },
  btnPlainText: { fontFamily: 'Inter_800ExtraBold', color: '#111', fontSize: 15 },
  emptyContainer: { padding: 24, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#8A8A8A', textAlign: 'center' },
  creatorWrapper: { paddingVertical: 30, paddingHorizontal: 24 },
  bottomCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F4EE',
    paddingVertical: 16,
    borderRadius: 16,
  },
  bottomCreateButtonText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#111' },
  createInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F4EE',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },
  input: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 16, color: '#111', padding: 8 },
  saveButton: { backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  saveButtonText: { fontFamily: 'Inter_700Bold', color: '#FFF', fontSize: 14 },
  cancelButtonText: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#111',
    fontSize: 16,
    marginLeft: 10,
  },
});
