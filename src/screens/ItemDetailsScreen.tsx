import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useStore } from '../store';
import { ArrowLeft2, MinusCirlce, AddCircle } from 'iconsax-react-native';

export const ItemDetailsScreen = ({ route, navigation }: any) => {
  const { listId, item } = route.params;
  const { updateItemInList, deleteItemFromList } = useStore();
  
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity?.toString() || '1');
  const [unit, setUnit] = useState(item.unit || '');

  const handleSave = () => {
    updateItemInList(listId, item.id, {
      name,
      quantity: parseInt(quantity) || 1,
      unit
    });
    navigation.goBack();
  };

  const incrementQty = () => setQuantity((parseInt(quantity) + 1).toString());
  const decrementQty = () => {
    const val = parseInt(quantity);
    if (val > 1) setQuantity((val - 1).toString());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={28} color={Colors.black} variant="Bold" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Item</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyBtn} onPress={decrementQty}>
                <MinusCirlce size={20} color={Colors.black} variant="Bold" />
              </TouchableOpacity>
              <TextInput 
                style={styles.qtyInput} 
                value={quantity} 
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.qtyBtn} onPress={incrementQty}>
                <AddCircle size={20} color={Colors.black} variant="Bold" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Unit (Optional)</Text>
            <TextInput 
              style={styles.input} 
              value={unit} 
              onChangeText={setUnit}
              placeholder="e.g. kg, lbs"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => {
            deleteItemFromList(listId, item.id);
            navigation.goBack();
          }}
        >
          <Text style={styles.deleteBtnText}>Delete Item</Text>
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
  backButton: { padding: 4 },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
    color: Colors.textHeading,
  },
  saveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 24,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textHeading,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  half: {
    flex: 1,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    height: 52,
  },
  qtyBtn: {
    padding: 14,
  },
  qtyInput: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.textHeading,
  },
  deleteBtn: {
    marginTop: 40,
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FF3B30',
    fontSize: 16,
  }
});
