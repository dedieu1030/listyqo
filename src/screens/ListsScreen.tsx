import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { SCREEN_EDGE, tabRootTitleText } from '../theme/layout';
import { useStore } from '../store';
import { User, ChevronUp, CheckCircle, Plus, Check, Minus } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

/** Case à cocher et zone texte : même hauteur pour rester centrés sur l’axe vertical. */
const TODAY_LINE_H = 22;
/** Même `marginRight` que `styles.todayCheckbox` : espace case → texte. */
const TODAY_CHECKBOX_GAP = 14;
/** Décalage du bloc case + texte = place laissée au − à la place de la case (22 + 14). */
const TODAY_DELETE_CONTENT_SHIFT = TODAY_LINE_H + TODAY_CHECKBOX_GAP;
/** Ouverture / fermeture : même durée et easing pour une fermeture aussi fluide que l’ouverture. */
const TODAY_ANIM_MS = 280;
const TODAY_ANIM_EASING = Easing.inOut(Easing.cubic);
/** Espace réservé à droite pour la poignée drag (même ordre de grandeur que la colonne −). */
const TODAY_DRAG_EXTRA_PAD = TODAY_LINE_H + 8;

/** Même barre pour item saisi / item affiché : évite le saut au passage TextInput → Text. */
function TodayFoodRow({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.todayItemRow}
        onPress={onPress}
        activeOpacity={0.65}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={styles.todayItemRow}>{children}</View>;
}

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
    lists,
    addList,
    todayItems,
    addTodayItem,
    toggleTodayItem,
    deleteTodayItem,
    updateTodayItem,
  } = useStore();
  const [activeTab, setActiveTab] = useState<'today' | 'saved'>('saved');
  /** Lignes en mode édition (reste true pendant la fermeture animée). */
  const [isTodayEditActive, setIsTodayEditActive] = useState(false);
  /** Libellé du bouton : « Done » dès le tap, sans attendre la fin de l’anim de fermeture. */
  const [todayEditButtonShowsDone, setTodayEditButtonShowsDone] = useState(false);

  const [newListMode, setNewListMode] = useState(false);
  const [newListName, setNewListName] = useState('');

  const [newTodayItemMode, setNewTodayItemMode] = useState(false);
  const [newTodayItemName, setNewTodayItemName] = useState('');

  const todayDraftCommitLock = useRef(false);
  const todayDeleteAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeTab !== 'today') {
      setIsTodayEditActive(false);
      setTodayEditButtonShowsDone(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isTodayEditActive) return;

    todayDeleteAnim.stopAnimation();
    todayDeleteAnim.setValue(0);
    const frame = requestAnimationFrame(() => {
      Animated.timing(todayDeleteAnim, {
        toValue: 1,
        duration: TODAY_ANIM_MS,
        easing: TODAY_ANIM_EASING,
        useNativeDriver: true,
      }).start();
    });
    return () => cancelAnimationFrame(frame);
  }, [isTodayEditActive, todayDeleteAnim]);

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

  const handleTodayEditPress = () => {
    if (isTodayEditActive && !todayEditButtonShowsDone) {
      setTodayEditButtonShowsDone(true);
      todayDeleteAnim.stopAnimation();
      Animated.timing(todayDeleteAnim, {
        toValue: 1,
        duration: TODAY_ANIM_MS,
        easing: TODAY_ANIM_EASING,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (todayEditButtonShowsDone) {
      setTodayEditButtonShowsDone(false);
      todayDeleteAnim.stopAnimation();
      Animated.timing(todayDeleteAnim, {
        toValue: 0,
        duration: TODAY_ANIM_MS,
        easing: TODAY_ANIM_EASING,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        const { todayItems: items, deleteTodayItem: del } = useStore.getState();
        items.forEach((item) => {
          if (!item.name.trim()) del(item.id);
        });
        setIsTodayEditActive(false);
      });
      return;
    }
    if (newTodayItemMode) handleAddTodayItem();
    setTodayEditButtonShowsDone(true);
    setIsTodayEditActive(true);
  };

  const cardColors = ['#A5E3C1', '#36C185', '#57C693', '#F2AE72', '#EED8A1'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* En-tête : salutation + onglets (référence actuelle conservée). */}
        <View style={styles.headerArea}>
          <View style={styles.topHeaderRow}>
            <Text style={tabRootTitleText}>Hi, Jamie</Text>
            <User size={28} color="#111" strokeWidth={2} />
          </View>

          <View style={styles.tabsContainer}>
            <View style={styles.tabsRow}>
              <View>
                <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('today')}>
                  <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
                </TouchableOpacity>
                {activeTab === 'today' && <View style={styles.tabUnderline} />}
              </View>

              <View>
                <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('saved')}>
                  <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>Saved list</Text>
                </TouchableOpacity>
                {activeTab === 'saved' && <View style={styles.tabUnderline} />}
              </View>
            </View>
          </View>
        </View>

        {activeTab === 'saved' && (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Greet people and{"\n"}say goodbye</Text>
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
                          {isFocused ? 'Learn to say which languages you speak' : 'Learn how to greet someone.'}
                        </Text>
                        <TouchableOpacity
                          style={isFocused ? styles.btnPrimary : styles.btnPlain}
                          onPress={() => navigation.navigate('ListDetails', { listId: list.id, listName: list.name })}
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
                    <TextInput style={styles.input} value={newListName} onChangeText={setNewListName} placeholder="List name..." autoFocus />
                    <TouchableOpacity style={styles.saveButton} onPress={handleCreateList}>
                       <Text style={styles.saveButtonText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setNewListMode(false)}><Text style={styles.cancelButtonText}>X</Text></TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.bottomCreateButton} onPress={() => setNewListMode(true)}>
                    <Plus size={20} color="#111" strokeWidth={2} style={{ marginRight: 8 }} />
                    <Text style={styles.bottomCreateButtonText}>Create new list</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}

        {activeTab === 'today' && (
          <View style={styles.contentSection}>
            <View style={styles.todaySectionBar}>
              <Text style={styles.todaySectionLabel}>Today</Text>
              <TouchableOpacity
                onPress={handleTodayEditPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={todayEditButtonShowsDone ? 'Done' : 'Edit'}
              >
                <Text style={styles.todayEditButton}>
                  {todayEditButtonShowsDone ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.todayFoodList}>
              {todayItems.map((item) => (
                <View key={item.id} style={styles.todayItemCell}>
                  {isTodayEditActive ? (
                    <View style={styles.todayItemRowHost}>
                      <Animated.View
                        style={[
                          styles.todayItemRow,
                          styles.todayItemRowEditPad,
                          {
                            transform: [
                              {
                                translateX: todayDeleteAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, TODAY_DELETE_CONTENT_SHIFT],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => toggleTodayItem(item.id)}
                          activeOpacity={0.65}
                          accessibilityRole="button"
                          accessibilityLabel="Toggle done"
                        >
                          <View
                            style={[
                              styles.todayCheckbox,
                              item.checked && styles.todayCheckboxChecked,
                            ]}
                          >
                            {item.checked ? (
                              <Check size={14} color={Colors.white} strokeWidth={3} />
                            ) : null}
                          </View>
                        </TouchableOpacity>
                        <View style={styles.todayItemTextWrap}>
                          <TextInput
                            value={item.name}
                            onChangeText={(text) =>
                              updateTodayItem(item.id, { name: text })
                            }
                            scrollEnabled={false}
                            numberOfLines={1}
                            style={[
                              styles.todayItemInput,
                              item.checked && styles.todayItemLabelDone,
                            ]}
                            underlineColorAndroid="transparent"
                            selectionColor={Colors.primary}
                            returnKeyType="done"
                          />
                        </View>
                      </Animated.View>
                      <Animated.View
                        style={[
                          styles.todayDeleteSlot,
                          {
                            opacity: todayDeleteAnim,
                            transform: [
                              {
                                translateX: todayDeleteAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [-TODAY_DELETE_CONTENT_SHIFT, 0],
                                }),
                              },
                            ],
                          },
                        ]}
                        pointerEvents={isTodayEditActive ? 'auto' : 'none'}
                      >
                        <TouchableOpacity
                          onPress={() => deleteTodayItem(item.id)}
                          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
                          accessibilityLabel="Delete item"
                          accessibilityRole="button"
                        >
                          <View style={styles.todayDeleteCircle}>
                            <Minus size={12} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                      <Animated.View
                        style={[
                          styles.todayDragSlot,
                          {
                            opacity: todayDeleteAnim,
                            transform: [
                              {
                                translateX: todayDeleteAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [TODAY_DELETE_CONTENT_SHIFT, 0],
                                }),
                              },
                            ],
                          },
                        ]}
                        pointerEvents={isTodayEditActive ? 'box-none' : 'none'}
                      >
                        <View
                          style={styles.todayDragGrip}
                          accessibilityRole="button"
                          accessibilityLabel="Reorder"
                        >
                          <View style={styles.todayDragLine} />
                          <View style={styles.todayDragLine} />
                          <View style={styles.todayDragLine} />
                        </View>
                      </Animated.View>
                    </View>
                  ) : (
                    <TodayFoodRow onPress={() => toggleTodayItem(item.id)}>
                      <View
                        style={[
                          styles.todayCheckbox,
                          item.checked && styles.todayCheckboxChecked,
                        ]}
                      >
                        {item.checked ? (
                          <Check size={14} color={Colors.white} strokeWidth={3} />
                        ) : null}
                      </View>
                      <View style={styles.todayItemTextWrap}>
                        <TextInput
                          editable={false}
                          pointerEvents="none"
                          value={item.name}
                          scrollEnabled={false}
                          caretHidden
                          selectTextOnFocus={false}
                          numberOfLines={1}
                          style={[
                            styles.todayItemInput,
                            item.checked && styles.todayItemLabelDone,
                          ]}
                          underlineColorAndroid="transparent"
                        />
                      </View>
                    </TodayFoodRow>
                  )}
                  <View style={styles.todayItemHairline} />
                </View>
              ))}

              {!isTodayEditActive && newTodayItemMode ? (
                <View style={styles.todayItemCell}>
                  <TodayFoodRow>
                    <View style={styles.todayCheckbox} />
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
                  </TodayFoodRow>
                </View>
              ) : !isTodayEditActive ? (
                <TodayFoodRow onPress={() => setNewTodayItemMode(true)}>
                  <View style={styles.todayCheckboxSlot}>
                    <Plus size={20} color={Colors.textHeading} strokeWidth={2} />
                  </View>
                </TodayFoodRow>
              ) : null}
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
  headerArea: { paddingHorizontal: SCREEN_EDGE, paddingTop: 20, paddingBottom: 20 },
  topHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tabsContainer: { flexDirection: 'row', alignItems: 'center' },
  tabsRow: { flexDirection: 'row', gap: 28 },
  tabBtn: { paddingBottom: 6 },
  tabUnderline: { height: 2, backgroundColor: '#111', width: '100%', position: 'absolute', bottom: 0 },
  tabText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#8A8A8A' },
  tabTextActive: { color: '#111' },
  contentSection: { flex: 1 },
  todaySectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_EDGE,
    paddingTop: 4,
    paddingBottom: 12,
  },
  todaySectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#111',
  },
  todayEditButton: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: Colors.accentRed,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  sectionTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 26, lineHeight: 32, color: '#111' },
  todayFoodList: {
    marginTop: 0,
  },
  todayItemCell: {
    width: '100%',
  },
  /** Aligné sur le même axe horizontal que la case (padding item = SCREEN_EDGE). */
  todayItemRowHost: {
    position: 'relative',
  },
  todayDeleteSlot: {
    position: 'absolute',
    left: SCREEN_EDGE,
    top: 0,
    bottom: 0,
    width: TODAY_LINE_H,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  todayDeleteCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** À droite de la ligne, même logique d’anim que le − (entre depuis le bord droit). */
  todayDragSlot: {
    position: 'absolute',
    right: SCREEN_EDGE,
    top: 0,
    bottom: 0,
    width: TODAY_LINE_H,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  todayDragGrip: {
    width: TODAY_LINE_H,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  todayDragLine: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#C8C8C8',
  },
  /** Évite que le texte passe sous la poignée (réserve l’aire à droite). */
  todayItemRowEditPad: {
    paddingRight: SCREEN_EDGE + TODAY_DRAG_EXTRA_PAD,
  },
  /** Même largeur que le contenu (padding 24) : pas d’arête à bord d’écran. */
  todayItemHairline: {
    height: 1,
    marginHorizontal: 24,
    backgroundColor: 'rgba(17, 17, 17, 0.07)',
  },
  todayItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  todayCheckbox: {
    width: TODAY_LINE_H,
    height: TODAY_LINE_H,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D8D6D0',
    marginRight: 14,
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
  /** Colonne texte : hauteur = case à cocher, pas d’étirement vertical sur la ligne. */
  todayItemTextWrap: {
    flex: 1,
    height: TODAY_LINE_H,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  /**
   * iOS : ne pas mettre `lineHeight` sur TextInput monoligne — le moteur RN répartit mal l’espace
   * (texte qui « saute » au 1er caractère). Voir github.com/facebook/react-native/issues/39145
   * Android : lineHeight + textAlignVertical pour centrer comme la case.
   */
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

  // Saved lists (list layout)
  listItemRow: { width: '100%', paddingVertical: 12 },
  listItemRowFocused: { backgroundColor: '#F5F4EE' },
  rowContent: { flexDirection: 'row', paddingHorizontal: 24 },
  colorSquare: { width: 140, height: 130, borderRadius: 20, padding: 16, justifyContent: 'space-between', position: 'relative', overflow: 'hidden' },
  decorativeWrapper: { position: 'absolute' },
  squareTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 17, color: '#000', lineHeight: 22 },
  squareBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  squareSubtitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#000' },
  listDetails: { flex: 1, marginLeft: 20, justifyContent: 'space-between', paddingVertical: 4 },
  listDesc: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#666', lineHeight: 20, paddingRight: 10 },
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
