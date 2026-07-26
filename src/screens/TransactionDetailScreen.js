import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

function formatRupiah(num) {
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

export default function TransactionDetailScreen({ route }) {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detail Transaksi</Text>
      <Text style={styles.date}>{new Date(transaction.date).toLocaleString('id-ID')}</Text>

      <FlatList
        data={transaction.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.itemName}>{item.name} x{item.qty}</Text>
            <Text style={styles.itemPrice}>{formatRupiah(item.price * item.qty)}</Text>
          </View>
        )}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatRupiah(transaction.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: 20 },
  header: { fontSize: 20, fontWeight: '700', color: COLORS.black },
  date: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  itemName: { fontSize: 14, color: COLORS.black },
  itemPrice: { fontSize: 14, fontWeight: '600', color: COLORS.black },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 2, borderTopColor: COLORS.primary },
  totalLabel: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
});
