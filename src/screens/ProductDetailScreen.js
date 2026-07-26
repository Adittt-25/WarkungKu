import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';
import { useCart } from '../navigation/CartContext';

function formatRupiah(num) {
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params; // parameter passed between screens
  const { addToCart } = useCart();

  return (
    <View style={styles.container}>
      {product.photo ? (
        <Image source={{ uri: product.photo }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <Text style={styles.stock}>Stok tersedia: {product.stock}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addToCart(product);
            navigation.navigate('Keranjang');
          }}
        >
          <Text style={styles.buttonText}>Tambah ke Keranjang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  image: { width: '100%', height: 260 },
  placeholder: { backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' },
  body: { padding: 20 },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.black },
  price: { fontSize: 20, color: COLORS.primary, fontWeight: '700', marginTop: 8 },
  stock: { fontSize: 14, color: COLORS.gray, marginTop: 6 },
  button: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
