import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { OrderSummary } from '@/components/OrderSummary';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { COLORS, formatPrice } from '@/constants/theme';

const SHIPPING_OPTIONS = [
  { id: 'reguler', label: 'Reguler', subLabel: '3-5 hari kerja', price: 15000 },
  { id: 'express', label: 'Express', subLabel: '1-2 hari kerja', price: 30000 },
  { id: 'same_day', label: 'Same Day', subLabel: 'Hari ini tiba', price: 50000 },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const { setPendingOrder } = useOrderStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [selectedShipping, setSelectedShipping] = useState('reguler');

  const shippingCost =
    subtotal() >= 500000
      ? 0
      : SHIPPING_OPTIONS.find((s) => s.id === selectedShipping)?.price ?? 15000;
  const total = subtotal() + shippingCost;

  const validate = () => {
    if (!form.name.trim()) return 'Nama penerima wajib diisi';
    if (!form.phone.trim()) return 'Nomor telepon wajib diisi';
    if (!form.street.trim()) return 'Alamat wajib diisi';
    if (!form.city.trim()) return 'Kota wajib diisi';
    if (!form.province.trim()) return 'Provinsi wajib diisi';
    if (!form.postalCode.trim()) return 'Kode pos wajib diisi';
    return null;
  };

  const handleProceed = () => {
    const error = validate();
    if (error) {
      Alert.alert('Lengkapi Data', error);
      return;
    }

    setPendingOrder({
      items,
      subtotal: subtotal(),
      shippingCost,
      total,
      address: form,
    });

    router.push('/payment/qris');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 36 }} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Alamat Pengiriman */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama Penerima *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama lengkap"
              placeholderTextColor={COLORS.textMuted}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nomor Telepon *</Text>
            <TextInput
              style={styles.input}
              placeholder="08xxxxxxxxxx"
              placeholderTextColor={COLORS.textMuted}
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Alamat Lengkap *</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Jalan, RT/RW, No. Rumah, Kelurahan"
              placeholderTextColor={COLORS.textMuted}
              value={form.street}
              onChangeText={(v) => setForm({ ...form, street: v })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Kota *</Text>
              <TextInput
                style={styles.input}
                placeholder="Kota"
                placeholderTextColor={COLORS.textMuted}
                value={form.city}
                onChangeText={(v) => setForm({ ...form, city: v })}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Provinsi *</Text>
              <TextInput
                style={styles.input}
                placeholder="Provinsi"
                placeholderTextColor={COLORS.textMuted}
                value={form.province}
                onChangeText={(v) => setForm({ ...form, province: v })}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Kode Pos *</Text>
            <TextInput
              style={styles.input}
              placeholder="12345"
              placeholderTextColor={COLORS.textMuted}
              value={form.postalCode}
              onChangeText={(v) => setForm({ ...form, postalCode: v })}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        {/* Metode Pengiriman */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube-outline" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Metode Pengiriman</Text>
          </View>

          {subtotal() >= 500000 && (
            <View style={styles.freeShippingBanner}>
              <Text style={styles.freeShippingText}>🎉 Gratis ongkir untuk pembelian di atas {formatPrice(500000)}!</Text>
            </View>
          )}

          {SHIPPING_OPTIONS.map((opt) => {
            const isSelected = selectedShipping === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.shippingOption, isSelected && styles.shippingOptionActive]}
                onPress={() => setSelectedShipping(opt.id)}
              >
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <View style={styles.shippingInfo}>
                  <Text style={styles.shippingLabel}>{opt.label}</Text>
                  <Text style={styles.shippingSubLabel}>{opt.subLabel}</Text>
                </View>
                <Text style={styles.shippingPrice}>
                  {subtotal() >= 500000 ? (
                    <Text style={styles.freeText}>GRATIS</Text>
                  ) : (
                    formatPrice(opt.price)
                  )}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>
          </View>
          <OrderSummary
            subtotal={subtotal()}
            shippingCost={shippingCost}
            total={total}
          />
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="qr-code-outline" size={18} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          </View>
          <View style={styles.paymentMethod}>
            <View style={styles.qrisLabel}>
              <Text style={styles.qrisLabelText}>QRIS</Text>
            </View>
            <View>
              <Text style={styles.paymentName}>QRIS (Semua e-wallet & bank)</Text>
              <Text style={styles.paymentSub}>GoPay, OVO, Dana, ShopeePay, BCA, dll</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handleProceed} activeOpacity={0.85}>
          <LinearGradient
            colors={[COLORS.accentDark, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payBtnGradient}
          >
            <Ionicons name="qr-code" size={20} color="#fff" />
            <Text style={styles.payBtnText}>Bayar dengan QRIS</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  scroll: { padding: 16, gap: 16 },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  formGroup: { gap: 6 },
  formRow: { flexDirection: 'row', gap: 12 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputMultiline: { height: 80, paddingTop: 12 },
  freeShippingBanner: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  freeShippingText: { color: COLORS.success, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  shippingOptionActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(255,107,43,0.05)' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accent },
  shippingInfo: { flex: 1 },
  shippingLabel: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  shippingSubLabel: { color: COLORS.textMuted, fontSize: 12, marginTop: 1 },
  shippingPrice: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  freeText: { color: COLORS.success, fontWeight: '700' },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  qrisLabel: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qrisLabelText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  paymentName: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  paymentSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  bottomCTA: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: COLORS.textSecondary, fontSize: 14 },
  totalValue: { color: COLORS.accent, fontSize: 20, fontWeight: '800' },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
