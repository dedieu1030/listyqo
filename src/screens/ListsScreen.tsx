import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { User, ChevronUp, CheckCircle, Plus } from 'lucide-react-native';

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
        
        {/* Header Area */}
        <View style={styles.headerArea}>
          <View style={styles.topHeaderRow}>
            <Text style={styles.mainTitle}>Hi, Jamie</Text>
            <User size={28} color="#111" strokeWidth={2} />
          </View>

          {/* Tabs Row */}
          <View style={styles.tabsRow}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'today' && styles.tabBtnActive]}
              onPress={() => setActiveTab('today')}
            >
              <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'week' && styles.tabBtnActive]}
              onPress={() => setActiveTab('week')}
            >
              <Text style={[styles.tabText, activeTab === 'week' && styles.tabTextActive]}>This Week</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'week' && (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your saved lists{"\n"}for the week</Text>
              <ChevronUp size={24} color="#111" strokeWidth={3} />
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
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('ListDetails', { listId: list.id, listName: list.name })}
                      style={[styles.colorSquare, { backgroundColor: cardColors[index % cardColors.length] }]}
                    >
                      <Text style={styles.squareTitle}>{list.name}</Text>
                      <View style={styles.squareBottom}>
                        <Text style={styles.squareSubtitle}>List {index + 1}</Text>
                        {isCompleted && <CheckCircle size={22} color="#111" strokeWidth={2.5} />}
                      </View>
                    </TouchableOpacity>

                    <View style={styles.listDetails}>
                      <Text style={styles.listDesc}>
                        {isFocused 
                          ? "View the items you added and easily manage your grocery list" 
                          : "Review your saved items and get ready for the trip"
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
             <TouchableOpacity style={styles.btnPrimary} onPress={() => setActiveTab('week')}>
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
    backgroundColor: Colors.background 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: 30, // Brought down slightly
    paddingBottom: 10,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontFamily: 'Lora_700Bold',
    fontSize: 42, // Massive beautiful Serif font
    color: '#111',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  tabBtn: {
    paddingBottom: 8,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#111',
  },
  tabText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.textLight,
  },
  tabTextActive: {
    color: '#111',
  },
  contentSection: {
    // 
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
    fontSize: 24,
    lineHeight: 30,
    color: '#111',
  },
  listItemRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    // Extremely flat, no borders/shadows!
  },
  listItemRowFocused: {
    backgroundColor: Colors.surface, // Matches the warm #F5F4EE backdrop
  },
  colorSquare: {
    width: 150,
    height: 130, // Large square like the image
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  squareTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
    color: '#111',
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
    color: '#111', 
  },
  listDetails: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  listDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    paddingRight: 10,
  },
  btnPrimary: {
    backgroundColor: '#111',
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30, // pill button style
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
    paddingVertical: 40,
    alignItems: 'center',
    gap: 20,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  creatorWrapper: {
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  bottomCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 16,
  },
  bottomCreateButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.textHeading,
  },
  createInputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textHeading,
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
    color: Colors.white,
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
