import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { Search } from 'lucide-react-native';

const FOOD_FACTS = [
  { id: '1', name: 'Avocado', fact: 'Avocados are a fruit, not a vegetable. They are technically considered a single-seeded berry.', category: 'Produce' },
  { id: '2', name: 'Honey', fact: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.', category: 'Pantry' },
  { id: '3', name: 'Almonds', fact: 'Almonds are members of the peach family. They are seeds of the fruit of the almond tree.', category: 'Nuts' },
  { id: '4', name: 'Carrots', fact: 'Carrots were originally purple or yellow. The orange carrot was cultivated in the Netherlands in the 17th century.', category: 'Produce' },
];

export const FoodFactsScreen = () => {
  const [search, setSearch] = useState('');

  const filtered = FOOD_FACTS.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Facts</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search for ingredients..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.pill}><Text style={styles.pillText}>{item.category}</Text></View>
            </View>
            <Text style={styles.cardBody}>{item.fact}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    color: Colors.textHeading,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceInactive,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textHeading,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.surfaceActive,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.textHeading,
  },
  pill: {
    backgroundColor: Colors.highlightPill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    color: Colors.highlightIcon,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  cardBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  }
});
