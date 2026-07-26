import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import COLORS from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSession, logout } from '../services/storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null); // state 1
  const [loading, setLoading] = useState(true); // state 2

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoading(true);
        const session = await getSession();
        if (active) {
          setUser(session);
          setLoading(false);
        }
      }
      load();
      return () => { active = false; };
    }, [])
  );

  function handleLogout() {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }

  if (loading) return <LoadingSpinner label="Memuat profil..." />;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.name ? user.name[0].toUpperCase() : '?'}</Text>
      </View>
      {user ? (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </>
      ) : (
        <Text style={styles.name}>Pengguna</Text>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', paddingTop: 60 },
  avatar: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarText: { color: COLORS.white, fontSize: 36, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.black },
  email: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  logoutBtn: { marginTop: 32, backgroundColor: COLORS.danger, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 10 },
  logoutText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
