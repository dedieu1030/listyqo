import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { SCREEN_EDGE, stackHeaderBar, stackHeaderTitleText } from '../theme/layout';
import { ChevronLeft } from 'lucide-react-native';

export const SettingsScreen = ({ navigation }: any) => {
  const [openLastList, setOpenLastList] = useState(false);
  const [keepScreenOn, setKeepScreenOn] = useState(true);
  const [showPrices, setShowPrices] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={stackHeaderBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={Colors.black} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[stackHeaderTitleText, styles.headerTitle]}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Manage your grocery {"\n"}preferences</Text>
        
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Open Last List automatically</Text>
            <Switch 
              value={openLastList} 
              onValueChange={setOpenLastList}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Keep Screen On</Text>
            <Switch 
              value={keepScreenOn} 
              onValueChange={setKeepScreenOn}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Price behavior</Text>
            <Switch 
              value={showPrices} 
              onValueChange={setShowPrices}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>
        
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Confirm settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.primary },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: SCREEN_EDGE,
  },
  subtitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 36,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textHeading,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
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
