import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, formatPrice } from '@/constants/theme';

type Props = {
  subtotal: number;
  shippingCost: number;
  total: number;
};

export function OrderSummary({ subtotal, shippingCost, total }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ringkasan Pesanan</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatPrice(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Ongkos Kirim</Text>
        {shippingCost === 0 ? (
          <View style={styles.freeRow}>
            <Text style={styles.freeText}>GRATIS</Text>
          </View>
        ) : (
          <Text style={styles.value}>{formatPrice(shippingCost)}</Text>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total Pembayaran</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>

      {shippingCost === 0 && subtotal > 0 && (
        <View style={styles.freeShippingBanner}>
          <Text style={styles.freeShippingText}>
            🎉 Kamu mendapat gratis ongkir!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  value: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  freeRow: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freeText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  freeShippingBanner: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    marginTop: 4,
  },
  freeShippingText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
