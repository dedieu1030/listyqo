import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { ChevronLeft, Plus } from 'lucide-react-native';

const POPULAR_ITEMS = ['Milk', 'Eggs', 'Bread', 'Bananas', 'Apples', 'Chicken', 'Rice', 'Pasta', 'Coffee', 'Cheese'];

export const AddItemScreen = ({ route, navigation }: any) => {
  const { listId } = route.params;
  const { addItemToList } = useStore();
  const [itemName, setItemName] = useState('');

  const handleAddItem = (name: string) => {
    if (name.trim()) {
      addItemToList(listId, { name, checked: false, quantity: 1, unit: '' });
      setItemName('');
      // Could give feedback here (e.g. Toast)
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Item</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What do you need?"
          value={itemName}
          onChangeText={setItemName}
          autoFocus
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddItem(itemName)}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Popular Items</Text>
        <ScrollView contentContainerStyle={styles.tagsContainer}>
          {POPULAR_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.tag}
              onPress={() => handleAddItem(item)}
            >
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    color: Colors.textHeading,
  },
  headerRight: {
    width: 40,
  },
  inputContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: Colors.textHeading,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
  },
  suggestionsTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.textHeading,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagText: {
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    fontSize: 14,
  }
});
