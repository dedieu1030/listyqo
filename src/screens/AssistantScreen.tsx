import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Mic, Volume2 } from 'lucide-react-native';

export const AssistantScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Assistant</Text>
        <Text style={styles.subtitle}>Tap the microphone, then speak your grocery items out loud.</Text>

        <View style={styles.voiceCard}>
          <Volume2 color={Colors.textHeading} size={28} style={styles.voiceIcon} />
          <Text style={styles.voiceText}>"Add milk and eggs to the list"</Text>
        </View>

        <View style={styles.responseArea}>
          <Text style={styles.responseText}>I'm listening...</Text>
        </View>

        <TouchableOpacity style={styles.micButton}>
          <Mic size={36} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    color: Colors.textHeading,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceActive,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 40,
  },
  voiceIcon: {
    marginRight: 16,
  },
  voiceText: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: Colors.textHeading,
  },
  responseArea: {
    flex: 1,
    justifyContent: 'center',
  },
  responseText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: Colors.textLight,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  }
});
