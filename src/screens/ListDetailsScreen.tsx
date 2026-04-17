import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { Trash, Share, AddCircle, TickCircle } from 'iconsax-react-native';

export const ListDetailsScreen = ({ route, navigation }: any) => {
  const { listId, listName } = route.params;
  const { lists, toggleItemChecked, deleteItemFromList, updateItemInList, deleteList, addItemToList } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const list = lists.find(l => l.id === listId);
  const items = list ? list.items : [];

  const handleEditItem = (id: string, newText: string) => {
    updateItemInList(listId, id, { name: newText });
  };

  const handleCreateNewItem = () => {
    setIsEditing(true);
    const newItemId = Date.now().toString();
    addItemToList(listId, { name: '', checked: false, quantity: 1, unit: 'pc' });
    setEditingItemId(newItemId); // Automatically focus the new item
  };

  const renderItem = ({ item }: { item: any }) => {
    const isFocused = editingItemId === item.id;
    const isChecked = item.checked;

    return (
      <View style={[styles.itemRow, isFocused && styles.itemRowFocused]}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => toggleItemChecked(listId, item.id)}
          disabled={isEditing && isFocused} // Prevent toggle when explicitly editing name
        >
          <View style={styles.checkbox}>
            {isChecked && <TickCircle color={Colors.black} size={16} variant="Bold" />}
          </View>
        </TouchableOpacity>

        {isEditing ? (
          <TextInput
            style={[
              styles.itemInput,
              isChecked && styles.itemNameChecked
            ]}
            value={item.name}
            onChangeText={(text) => handleEditItem(item.id, text)}
            onFocus={() => setEditingItemId(item.id)}
            placeholder=""
            selectionColor={Colors.accentRed}
            autoFocus={isFocused}
            onBlur={() => {
              // Optional: remove item if empty on blur
              if (item.name.trim() === '') {
                 // deleteItemFromList(listId, item.id);
              }
            }}
          />
        ) : (
          <TouchableOpacity 
            style={styles.itemTextContainer}
            onPress={() => {
              setIsEditing(true);
              setEditingItemId(item.id);
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.itemName, isChecked && styles.itemNameChecked]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!list) return null; // Fallback if list deleted

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => {
              deleteList(listId);
              navigation.goBack();
            }}
          >
            <Trash color={Colors.accentRed} size={24} variant="Bold" />
          </TouchableOpacity>
          
          <Text style={styles.title} numberOfLines={1}>List</Text>

          {isEditing ? (
            <TouchableOpacity 
              style={styles.headerRightAction}
              onPress={() => {
                setIsEditing(false);
                setEditingItemId(null);
                // Clean up empty items
                items.forEach(i => {
                  if (i.name.trim() === '') deleteItemFromList(listId, i.id);
                });
              }}
            >
              <Text style={styles.actionText}>Done</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.headerRightAction}
              onPress={() => setIsEditing(true)}
            >
              <Share color={Colors.accentRed} size={22} variant="Bold" style={{ marginRight: 6 }} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          contentContainerStyle={styles.listContainer}
          keyboardShouldPersistTaps="handled"
        >
          {items.map(item => (
            <React.Fragment key={item.id}>
              {renderItem({ item })}
            </React.Fragment>
          ))}
          
          {!isEditing && (
            <TouchableOpacity style={styles.addRow} onPress={handleCreateNewItem}>
              <AddCircle color={Colors.black} size={24} variant="Bold" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerIcon: {
    width: 60,
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.black,
    flex: 1,
    textAlign: 'center',
  },
  headerRightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
    justifyContent: 'flex-end',
  },
  actionText: {
    color: Colors.accentRed,
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
  },
  listContainer: {
    paddingBottom: 100,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemRowFocused: {
    backgroundColor: Colors.accentPinkLight,
  },
  checkboxContainer: {
    paddingRight: 16,
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextContainer: {
    flex: 1,
    paddingVertical: 18,
  },
  itemName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    color: '#000000',
  },
  itemInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    color: '#000000',
    paddingVertical: 18,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0', // the greyed out text equivalent
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
  },
});
