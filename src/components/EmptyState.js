import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function EmptyState({ icon = '📦', message = 'Belum ada data' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  icon: { fontSize: 48, marginBottom: 8 },
  message: { color: COLORS.gray, fontSize: 15 },
});
