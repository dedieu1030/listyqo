import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ListItem {
  id: string;
  name: string;
  checked: boolean;
  quantity: number;
  unit: string;
}

export interface GroceryList {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: number;
}

interface StoreState {
  lists: GroceryList[];
  addList: (name: string) => void;
  deleteList: (id: string) => void;
  renameList: (id: string, newName: string) => void;
  addItemToList: (listId: string, item: Omit<ListItem, 'id'>) => void;
  updateItemInList: (listId: string, itemId: string, itemUpdates: Partial<ListItem>) => void;
  deleteItemFromList: (listId: string, itemId: string) => void;
  toggleItemChecked: (listId: string, itemId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      lists: [],
      
      addList: (name) => set((state) => ({
        lists: [
          ...state.lists,
          { id: Date.now().toString(), name, items: [], createdAt: Date.now() }
        ]
      })),
      
      deleteList: (id) => set((state) => ({
        lists: state.lists.filter(list => list.id !== id)
      })),
      
      renameList: (id, newName) => set((state) => ({
        lists: state.lists.map(list => list.id === id ? { ...list, name: newName } : list)
      })),
      
      addItemToList: (listId, item) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
          ? { ...list, items: [...list.items, { ...item, id: Date.now().toString() + Math.random().toString() }] }
          : list
        )
      })),
      
      updateItemInList: (listId, itemId, itemUpdates) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
          ? {
              ...list,
              items: list.items.map(item => item.id === itemId ? { ...item, ...itemUpdates } : item)
            }
          : list
        )
      })),
      
      deleteItemFromList: (listId, itemId) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
        )
      })),

      toggleItemChecked: (listId, itemId) => set((state) => ({
        lists: state.lists.map(list => 
          list.id === listId 
          ? {
              ...list,
              items: list.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
            }
          : list
        )
      })),
    }),
    {
      name: 'listyqo-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
