import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Profile, Settings, Star, Heart } from 'iconsax-react-native';

export const ProfileScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Profile color={Colors.white} size={32} variant="Bold" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Guest User</Text>
            <TouchableOpacity><Text style={styles.loginText}>Log in or Sign up</Text></TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#F0F0F0' }]}>
            <Settings size={20} color={Colors.textHeading} variant="Bold" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF0E5' }]}>
            <Star size={20} color={Colors.primary} variant="Bold" />
          </View>
          <Text style={styles.menuText}>Appearance</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFE5E5' }]}>
            <Heart size={20} color="#FF3B30" variant="Bold" />
          </View>
          <Text style={styles.menuText}>Feedback & Rating</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    color: Colors.textHeading,
  },
  content: {
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: Colors.textHeading,
    marginBottom: 4,
  },
  loginText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.textHeading,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textHeading,
  }
});
