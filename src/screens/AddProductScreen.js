import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../constants/colors';
import { getProducts, saveProducts } from '../services/storage';

export default function AddProductScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', price: '', stock: '' }); // state 1
  const [photo, setPhoto] = useState(null); // state 2
  const [errors, setErrors] = useState({}); // state 3
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [saving, setSaving] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      Alert.alert(
        'Izin Kamera Ditolak',
        'WarungKu memerlukan akses kamera untuk memfoto produk. Aktifkan izin di pengaturan HP.'
      );
      return;
    }
    setPermissionDenied(false);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Nama produk minimal 2 karakter';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      e.price = 'Harga harus berupa angka lebih dari 0';
    }
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      e.stock = 'Stok harus berupa angka';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const products = await getProducts();
    const newProduct = {
      id: Date.now().toString(),
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      photo,
    };
    const updated = [newProduct, ...products];
    await saveProducts(updated);
    setSaving(false);
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tambah Produk Baru</Text>

      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Text style={styles.photoPlaceholder}>📷 Ambil Foto Produk</Text>
        )}
      </TouchableOpacity>
      {permissionDenied && (
        <Text style={styles.error}>Izin kamera ditolak. Produk tetap bisa disimpan tanpa foto.</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nama produk"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Harga (Rp)"
        keyboardType="numeric"
        value={form.price}
        onChangeText={(t) => setForm({ ...form, price: t })}
      />
      {errors.price ? <Text style={styles.error}>{errors.price}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Stok"
        keyboardType="numeric"
        value={form.stock}
        onChangeText={(t) => setForm({ ...form, stock: t })}
      />
      {errors.stock ? <Text style={styles.error}>{errors.stock}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Menyimpan...' : 'Simpan Produk'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.white, flexGrow: 1 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, color: COLORS.black },
  photoBox: {
    height: 160, borderRadius: 12, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.lightGray, borderStyle: 'dashed',
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { color: COLORS.gray, fontSize: 14 },
  input: {
    borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 6, fontSize: 15,
  },
  error: { color: COLORS.danger, fontSize: 12, marginBottom: 8 },
  button: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
