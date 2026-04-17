import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { User, ChevronUp, CheckCircle, Plus } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// A decorative element mimicking the daisy from the reference image
const MockDaisy = ({ color = "#FFFFFF" }) => (
  <View style={styles.decorativeWrapper}>
    <Svg width="40" height="40" viewBox="0 0 100 100">
      {/* Petitioner shapes to mimic a daisy */}
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
  const { lists, addList } = useStore();
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('week');

  const [newListMode, setNewListMode] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = () => {
    if (newListName.trim().length > 0) {
      addList(newListName.trim());
      setNewListName('');
      setNewListMode(false);
    }
  };

  const cardColors = ['#A5E3C1', '#36C185', '#57C693', '#F2AE72', '#EED8A1'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Area Area */}
        <View style={styles.headerArea}>
          <View style={styles.topHeaderRow}>
            <Text style={styles.mainTitle}>Hi, Jamie</Text>
            <User size={28} color="#111" strokeWidth={2} />
          </View>

          {/* Tabs Row */}
          <View style={styles.tabsRow}>
            <View>
              <TouchableOpacity 
                style={styles.tabBtn}
                onPress={() => setActiveTab('today')}
              >
                <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
              </TouchableOpacity>
              {activeTab === 'today' && <View style={styles.tabUnderline} />}
            </View>
            
            <View>
              <TouchableOpacity 
                style={styles.tabBtn}
                onPress={() => setActiveTab('week')}
              >
                <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>Learning Plan</Text>
              </TouchableOpacity>
              {activeTab === 'week' && <View style={styles.tabUnderline} />}
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
              lists.map((list, index) => {
                const isFocused = index === 1; // Mimic the exact reference image highlight
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
                          
                          {/* Decorative daisy element as seen in Lesson 2 */}
                          {index % 2 === 1 && <MockDaisy />}

                          <View style={styles.squareBottom}>
                            <Text style={styles.squareSubtitle}>Lesson {index + 1}</Text>
                            {isCompleted && <CheckCircle size={20} color="#111" strokeWidth={2.5} />}
                          </View>
                        </TouchableOpacity>

                        <View style={styles.listDetails}>
                          <Text style={styles.listDesc}>
                            {isFocused 
                              ? "Learn to say which languages you speak" 
                              : "Learn how to greet someone and say goodbye."
                            }
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
            )}

            {/* List Creation Integration */}
            <View style={styles.creatorWrapper}>
               {newListMode ? (
                  <View style={styles.createInputContainer}>
                    <TextInput
                      style={styles.input}
                      value={newListName}
                      onChangeText={setNewListName}
                      placeholder="List name..."
                      autoFocus
                      onSubmitEditing={handleCreateList}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleCreateList}>
                       <Text style={styles.saveButtonText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setNewListMode(false)}>
                       <Text style={styles.cancelButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.bottomCreateButton} onPress={() => setNewListMode(true)}>
                    <Plus size={20} color={Colors.black} strokeWidth={3} style={{marginRight: 8}} />
                    <Text style={styles.bottomCreateButtonText}>Create new list</Text>
                  </TouchableOpacity>
                )}
            </View>

          </View>
        )}

        {activeTab === 'today' && (
          <View style={styles.todaySection}>
             <Text style={styles.emptyText}>You haven't scheduled any specific lists for today.</Text>
             <TouchableOpacity style={styles.btnPrimaryCenter} onPress={() => setActiveTab('week')}>
                <Text style={styles.btnPrimaryText}>Browse Week</Text>
             </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontFamily: 'Lora_700Bold',
    fontSize: 40,
    color: '#111',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 28,
  },
  tabBtn: {
    paddingBottom: 6,
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#111',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  tabText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#8A8A8A',
  },
  tabTextActive: {
    color: '#111',
  },
  contentSection: {
    flex: 1,
  },
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
  listItemRow: {
    width: '100%', // MUST BE FULL WIDTH FOR BACKGROUND
    paddingVertical: 12,
  },
  listItemRowFocused: {
    backgroundColor: '#F5F4EE', // The warm grey selection container
  },
  rowContent: {
    flexDirection: 'row',
    paddingHorizontal: 24, // Content padding moved here
  },
  colorSquare: {
    width: 140,
    height: 130, 
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeWrapper: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    opacity: 0.9,
  },
  squareTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 17,
    color: '#000',
    lineHeight: 22,
  },
  squareBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  squareSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#000', 
  },
  listDetails: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
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
    marginTop: 8,
  },
  btnPrimaryCenter: {
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30, 
  },
  btnPrimaryText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 15,
  },
  btnPlain: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
  },
  btnPlainText: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#111',
    fontSize: 15,
  },
  todaySection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: 'center',
    gap: 20,
  },
  creatorWrapper: {
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  bottomCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F4EE',
    paddingVertical: 16,
    borderRadius: 16,
  },
  bottomCreateButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#111',
  },
  createInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F4EE',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#111',
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 14,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    fontFamily: 'Inter_800ExtraBold',
    color: '#111',
    fontSize: 16,
  }
});
