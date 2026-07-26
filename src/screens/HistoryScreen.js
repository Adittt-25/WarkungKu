import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import COLORS from '../constants/colors';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getTransactions } from '../services/storage';

function formatRupiah(num) {
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]); // state 1
  const [loading, setLoading] = useState(true); // state 2

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        setLoading(true);
        const data = await getTransactions();
        if (active) {
          setTransactions(data);
          setLoading(false);
        }
      }
      load();
      return () => { active = false; };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Riwayat Transaksi</Text>

      {loading ? (
        <LoadingSpinner label="Memuat riwayat..." />
      ) : transactions.length === 0 ? (
        <EmptyState icon="🧾" message="Belum ada transaksi" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View
              style={styles.card}
              onTouchEnd={() => navigation.navigate('TransactionDetail', { transaction: item })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <Text style={styles.itemsCount}>{item.items.length} item</Text>
              </View>
              <Text style={styles.total}>{formatRupiah(item.total)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { fontSize: 20, fontWeight: '700', padding: 16, paddingTop: 20, backgroundColor: COLORS.white, color: COLORS.black },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10,
  },
  date: { fontSize: 14, fontWeight: '600', color: COLORS.black },
  itemsCount: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  total: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
});
