import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QRISDisplay } from '@/components/QRISDisplay';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { COLORS, formatPrice } from '@/constants/theme';

// Simulasi QRIS string format EMV (untuk demo)
function generateQRISString(amount: number, merchantId: string): string {
  const amountStr = amount.toString();
  return [
    '000201',                          // Payload Format Indicator
    '010212',                          // Point of Initiation (12 = Dynamic)
    '26580014com.pricommerce.qris',       // Merchant Account Info
    `0118${merchantId}`,               // Merchant ID
    '5204581655020360540' + amountStr.length.toString().padStart(2, '0') + amountStr, // Amount
    '5303360',                         // Transaction Currency (IDR)
    '5802ID',                          // Country Code
    '5908PriCommerce',                    // Merchant Name
    '6013Jakarta',                     // Merchant City
    '61054{12345',                     // Postal Code
    '6304ABCD',                        // CRC (dummy)
  ].join('');
}

const TOTAL_SECONDS = 15 * 60; // 15 menit

export default function QRISPaymentScreen() {
  const router = useRouter();
  const { pendingOrder, confirmOrder, clearPendingOrder } = useOrderStore();
  const clearCart = useCartStore((s) => s.clearCart);

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isPaid, setIsPaid] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = pendingOrder?.total ?? 0;
  const merchantId = 'PRICOMMERCE001BIZ';
  const qrisString = generateQRISString(total, merchantId);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Simulasi pembayaran otomatis setelah 5 detik (untuk demo)
  useEffect(() => {
    autoPayRef.current = setTimeout(() => {
      handlePaymentSuccess();
    }, 5000);
    return () => {
      if (autoPayRef.current) clearTimeout(autoPayRef.current);
    };
  }, []);

  const handlePaymentSuccess = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoPayRef.current) clearTimeout(autoPayRef.current);
    setIsPaid(true);
    const orderId = confirmOrder();
    clearCart();
    setTimeout(() => {
      router.replace({ pathname: '/payment/success', params: { orderId } } as any);
    }, 2000);
  };

  const handleExpired = () => {
    if (autoPayRef.current) clearTimeout(autoPayRef.current);
    clearPendingOrder();
    Alert.alert(
      'Waktu Habis',
      'Batas waktu pembayaran telah habis. Silakan ulangi checkout.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/cart') }]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Batalkan Pembayaran?',
      'Pesanan akan dibatalkan dan kamu kembali ke keranjang.',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (autoPayRef.current) clearTimeout(autoPayRef.current);
            clearPendingOrder();
            router.replace('/(tabs)/cart');
          },
        },
      ]
    );
  };

  if (!pendingOrder) {
    return (
      <View style={styles.container}>
        <Text style={{ color: COLORS.text, textAlign: 'center', marginTop: 80 }}>
          Tidak ada pesanan aktif
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/cart')}
          style={styles.backToCartBtn}
        >
          <Text style={styles.backToCartText}>Kembali ke Keranjang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pembayaran QRIS</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Progress */}
        <View style={styles.steps}>
          {['Keranjang', 'Checkout', 'QRIS'].map((step, i) => (
            <React.Fragment key={step}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, i <= 2 && styles.stepDotActive]}>
                  {i < 2 ? (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  ) : (
                    <Text style={styles.stepDotText}>{i + 1}</Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, i === 2 && styles.stepLabelActive]}>
                  {step}
                </Text>
              </View>
              {i < 2 && <View style={styles.stepLine} />}
            </React.Fragment>
          ))}
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Demo Notice */}
        <View style={styles.demoNotice}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
          <Text style={styles.demoText}>
            Mode Demo: Pembayaran akan otomatis terkonfirmasi dalam 5 detik
          </Text>
        </View>

        {/* Order Brief */}
        <View style={styles.orderBrief}>
          <Text style={styles.orderBriefLabel}>No. Invoice</Text>
          <Text style={styles.orderBriefValue}>INV-{Date.now().toString().slice(-8)}</Text>
        </View>

        <QRISDisplay
          qrisString={qrisString}
          total={total}
          timeLeft={timeLeft}
          isPaid={isPaid}
        />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  stepDotText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  stepLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '500' },
  stepLabelActive: { color: COLORS.accent, fontWeight: '700' },
  stepLine: { width: 40, height: 2, backgroundColor: COLORS.accent, marginBottom: 16 },
  scroll: { padding: 16, gap: 16 },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,107,43,0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,107,43,0.25)',
  },
  demoText: { color: COLORS.accent, fontSize: 12, fontWeight: '500', flex: 1 },
  orderBrief: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderBriefLabel: { color: COLORS.textMuted, fontSize: 13 },
  orderBriefValue: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  backToCartBtn: {
    margin: 24,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  backToCartText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
