import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';

function formatRupiah(num) {
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

export default function ItemCard({ product, onPress, onAdd, onDelete }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {product.photo ? (
        <Image source={{ uri: product.photo }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ fontSize: 24 }}>🛒</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <Text style={styles.stock}>Stok: {product.stock}</Text>
      </View>
      <View style={styles.actions}>
        {onAdd && (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>+ Keranjang</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteBtnText}>Hapus</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  placeholder: { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.black },
  price: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginTop: 2 },
  stock: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  actions: { alignItems: 'flex-end' },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  deleteBtn: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 6 },
  deleteBtnText: { color: COLORS.danger, fontSize: 12, fontWeight: '600' },
});
