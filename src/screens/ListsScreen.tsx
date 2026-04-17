import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { X, ChevronRight, ListTodo, Plus } from 'lucide-react-native';

export const ListsScreen = ({ navigation }: any) => {
  const { lists, addList } = useStore();
  const [newListMode, setNewListMode] = useState(false);
  const [newListName, setNewListName] = useState('');
  
  const handleCreateList = () => {
    if (newListName.trim().length > 0) {
      addList(newListName.trim());
      setNewListName('');
      setNewListMode(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('ListDetails', { listId: item.id, listName: item.name })
        }}
        style={[
          styles.card,
          styles.cardInactive
        ]}
      >
        <ListTodo size={24} color={Colors.primary} strokeWidth={2} style={styles.cardIconLeft} />
        <Text style={styles.listName}>{item.name}</Text>
        <ChevronRight size={24} color={Colors.black} strokeWidth={2.5} style={styles.cardIconRight} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.closeButton}>
            <X size={28} color={Colors.black} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Which list would{"\n"}you like to open?</Text>
      </View>

      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lists yet.</Text>
          </View>
        )}
      />

      {newListMode ? (
        <View style={styles.createInputContainer}>
          <TextInput
            style={styles.input}
            value={newListName}
            onChangeText={setNewListName}
            placeholder="New list name..."
            autoFocus
            onSubmitEditing={handleCreateList}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleCreateList}>
             <Text style={styles.saveButtonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setNewListMode(false)}>
             <Text style={styles.cancelButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.bottomCreateButton} onPress={() => setNewListMode(true)}>
          <Plus size={20} color={Colors.black} strokeWidth={3} style={{marginRight: 8}} />
          <Text style={styles.bottomCreateButtonText}>Add New List</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSpacer: {
    width: 28,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28, // Matches the massive bold text
    lineHeight: 34,
    color: Colors.textHeading,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 120, // Space for bottom button
    alignItems: 'center', // Center items to allow width overhang
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80, // Substantial height like in the mockup
    borderRadius: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  cardInactive: {
    backgroundColor: Colors.surfaceInactive,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '88%', // Maintains wide horizontal margins
  },
  cardActive: {
    backgroundColor: Colors.surfaceActive,
    width: '94%', // Overhangs the inactive margins!
    // Very soft, high spread shadow giving that floating effect over white bg
  },
  cardIconLeft: {
    marginRight: 20,
  },
  listName: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.textHeading,
  },
  cardIconRight: {
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textLight,
  },
  bottomCreateButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceInactive,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
  },
  bottomCreateButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.textHeading,
  },
  createInputContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: Colors.surfaceActive,
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
    backgroundColor: Colors.primary,
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
    fontFamily: 'Inter_700Bold',
    color: Colors.textLight,
    fontSize: 16,
  }
});
