import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import COLORS from '../constants/colors';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getProducts, saveProducts } from '../services/storage';
import { useCart } from '../navigation/CartContext';

export default function CatalogScreen({ navigation }) {
  const [products, setProducts] = useState([]); // state 1
  const [loading, setLoading] = useState(true); // state 2
  const { cart, addToCart } = useCart(); // state 3 (from context)

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function handleDelete(id) {
    Alert.alert('Hapus Produk', 'Yakin ingin menghapus produk ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updated = products.filter((p) => p.id !== id);
          setProducts(updated);
          await saveProducts(updated);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Katalog Produk</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.addBtnText}>+ Produk</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingSpinner label="Memuat katalog..." />
      ) : products.length === 0 ? (
        <EmptyState icon="🛍️" message="Belum ada produk. Tambahkan produk pertamamu!" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <ItemCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onAdd={() => addToCart(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingTop: 20, backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
});
