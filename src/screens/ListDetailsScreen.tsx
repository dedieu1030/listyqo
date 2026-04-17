import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { ChevronLeft, Plus, MoreHorizontal, CheckCircle2, Circle, Search } from 'lucide-react-native';

export const ListDetailsScreen = ({ route, navigation }: any) => {
  const { listId, listName } = route.params;
  const { lists, toggleItemChecked, deleteItemFromList } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const list = lists.find(l => l.id === listId);
  const items = list ? list.items : [];

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.itemRow} 
      onPress={() => toggleItemChecked(listId, item.id)}
    >
      <View style={styles.itemCheck}>
        {item.checked ? (
          <CheckCircle2 color={Colors.primary} size={24} fill={Colors.highlightPill} />
        ) : (
          <Circle color={Colors.border} size={24} />
        )}
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
          {item.name}
        </Text>
        {(item.quantity || item.unit) && (
          <Text style={styles.itemMeta}>
            {item.quantity} {item.unit}
          </Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.itemOptions}
        onPress={() => navigation.navigate('ItemDetails', { listId, item })}
      >
        <MoreHorizontal color={Colors.textLight} size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{listName}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreHorizontal size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
           <TouchableOpacity style={[styles.pill, styles.pillActive]}><Text style={styles.pillTextActive}>All</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>Produce</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>Dairy</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pill}><Text style={styles.pillText}>Meat</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
           <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>No items here yet.</Text>
           </View>
        )}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AddItem', { listId })}
        >
          <Text style={styles.primaryButtonText}>Add item</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    color: Colors.textHeading,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textHeading,
  },
  filterTabs: {
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    backgroundColor: Colors.highlightPill,
  },
  pillText: {
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  pillTextActive: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.highlightIcon,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemCheck: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textHeading,
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  itemMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textLight,
  },
  itemOptions: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: Colors.textLight,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  primaryButton: {
    backgroundColor: Colors.black,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  }
});
