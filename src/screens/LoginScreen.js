import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import COLORS from '../constants/colors';
import { getUsers, registerUser, setSession } from '../services/storage';

export default function LoginScreen({ navigation }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false); // state 1
  const [form, setForm] = useState({ name: '', email: '', password: '' }); // state 2
  const [errors, setErrors] = useState({}); // state 3
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (isRegisterMode && form.name.trim().length < 3) {
      e.name = 'Nama minimal 3 karakter';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      e.email = 'Format email tidak valid';
    }
    if (form.password.length < 6) {
      e.password = 'Password minimal 6 karakter';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isRegisterMode) {
        const users = await getUsers();
        const exists = users.find((u) => u.email === form.email.trim());
        if (exists) {
          setErrors({ email: 'Email sudah terdaftar' });
          setSubmitting(false);
          return;
        }
        const newUser = { name: form.name.trim(), email: form.email.trim(), password: form.password };
        await registerUser(newUser);
        await setSession(newUser);
        Alert.alert('Berhasil', 'Registrasi berhasil!');
      } else {
        const users = await getUsers();
        const found = users.find(
          (u) => u.email === form.email.trim() && u.password === form.password
        );
        if (!found) {
          setErrors({ password: 'Email atau password salah' });
          setSubmitting(false);
          return;
        }
        await setSession(found);
      }
      setSubmitting(false);
      navigation.replace('MainTabs');
    } catch (err) {
      setSubmitting(false);
      Alert.alert('Error', 'Terjadi kesalahan, coba lagi.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>🛒 WarungKu</Text>
        <Text style={styles.tagline}>Kasir & Katalog Digital UMKM</Text>

        <View style={styles.card}>
          <Text style={styles.title}>{isRegisterMode ? 'Daftar Akun' : 'Masuk'}</Text>

          {isRegisterMode && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nama pemilik warung"
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
              />
              {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
          {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
          {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.buttonText}>
              {submitting ? 'Memproses...' : isRegisterMode ? 'Daftar' : 'Masuk'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
            <Text style={styles.switchText}>
              {isRegisterMode ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  tagline: { color: COLORS.white, opacity: 0.9, marginBottom: 24 },
  card: { backgroundColor: COLORS.white, width: '100%', borderRadius: 16, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: COLORS.black },
  input: {
    borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 6, fontSize: 15,
  },
  error: { color: COLORS.danger, fontSize: 12, marginBottom: 8 },
  button: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  switchText: { textAlign: 'center', color: COLORS.secondary, marginTop: 16, fontSize: 13 },
});
