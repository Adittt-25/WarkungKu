import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import COLORS from '../constants/colors';
import EmptyState from '../components/EmptyState';
import { useCart } from '../navigation/CartContext';
import { addTransaction, getProducts, saveProducts } from '../services/storage';

function formatRupiah(num) {
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

export default function CartScreen({ navigation }) {
  const { cart, updateQty, removeFromCart, clearCart, total } = useCart();
  const [checkingOut, setCheckingOut] = useState(false); // state for conditional rendering

  async function handleCheckout() {
    if (cart.length === 0) return;
    setCheckingOut(true);
    try {
      const trx = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cart,
        total,
      };
      await addTransaction(trx);

      // reduce stock
      const products = await getProducts();
      const updatedProducts = products.map((p) => {
        const bought = cart.find((c) => c.id === p.id);
        if (bought) {
          return { ...p, stock: Math.max(0, p.stock - bought.qty) };
        }
        return p;
      });
      await saveProducts(updatedProducts);

      clearCart();
      Alert.alert('Transaksi Berhasil', `Total: ${formatRupiah(trx.total)}`);
      navigation.navigate('Katalog');
    } catch (e) {
      Alert.alert('Error', 'Checkout gagal, coba lagi.');
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Keranjang Belanja</Text>

      {cart.length === 0 ? (
        <EmptyState icon="🛒" message="Keranjang masih kosong" />
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatRupiah(item.price)} x {item.qty}</Text>
              </View>
              <View style={styles.qtyControls}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.remove}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatRupiah(total)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={checkingOut}>
            <Text style={styles.checkoutText}>
              {checkingOut ? 'Memproses...' : 'Checkout'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { fontSize: 20, fontWeight: '700', padding: 16, paddingTop: 20, backgroundColor: COLORS.white, color: COLORS.black },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 12, padding: 12, marginBottom: 10,
  },
  itemName: { fontSize: 14, fontWeight: '600', color: COLORS.black },
  itemPrice: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  qtyBtn: { backgroundColor: COLORS.lightGray, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  qtyValue: { marginHorizontal: 10, fontSize: 14, fontWeight: '600' },
  remove: { color: COLORS.danger, fontSize: 16, paddingHorizontal: 6 },
  footer: { padding: 16, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightGray },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: COLORS.black },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  checkoutBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  checkoutText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
