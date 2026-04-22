import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, formatPrice } from '@/constants/theme';

type Props = {
  qrisString: string;
  total: number;
  timeLeft: number;
  isPaid: boolean;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function QRISDisplay({ qrisString, total, timeLeft, isPaid }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isPaid) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.03,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isPaid]);

  return (
    <View style={styles.container}>
      {/* Header QRIS */}
      <View style={styles.header}>
        <View style={styles.qrisLabelRow}>
          <View style={styles.qrisLabelBox}>
            <Text style={styles.qrisLabelText}>QRIS</Text>
          </View>
          <Text style={styles.headerSub}>Quick Response Code Indonesian Standard</Text>
        </View>
      </View>

      {/* QR Code Box */}
      <Animated.View style={[styles.qrBox, { transform: [{ scale: pulse }] }]}>
        {isPaid ? (
          <View style={styles.paidOverlay}>
            <Text style={styles.paidIcon}>✅</Text>
            <Text style={styles.paidText}>Pembayaran Berhasil!</Text>
          </View>
        ) : (
          <QRCode
            value={qrisString}
            size={220}
            backgroundColor="#fff"
            color="#000"
          />
        )}
      </Animated.View>

      {/* Total */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Pembayaran</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>

      {/* Timer */}
      {!isPaid && (
        <View style={[styles.timerRow, timeLeft <= 60 && styles.timerUrgent]}>
          <Text style={[styles.timerText, timeLeft <= 60 && styles.timerTextUrgent]}>
            ⏳ Bayar dalam {formatTime(timeLeft)}
          </Text>
        </View>
      )}

      {/* Instruction */}
      {!isPaid && (
        <View style={styles.instructions}>
          <Text style={styles.instrTitle}>Cara Bayar:</Text>
          <Text style={styles.instrItem}>1. Buka aplikasi mobile banking atau e-wallet</Text>
          <Text style={styles.instrItem}>2. Pilih menu Scan QR / QRIS</Text>
          <Text style={styles.instrItem}>3. Scan kode QR di atas</Text>
          <Text style={styles.instrItem}>4. Konfirmasi pembayaran</Text>
        </View>
      )}

      {/* Supported Banks */}
      <View style={styles.banksRow}>
        {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BCA', 'Mandiri', 'BRI', 'BNI'].map(
          (bank) => (
            <View key={bank} style={styles.bankChip}>
              <Text style={styles.bankText}>{bank}</Text>
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    backgroundColor: '#FF6B2B',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  qrisLabelRow: {
    alignItems: 'center',
    gap: 4,
  },
  qrisLabelBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qrisLabelText: {
    color: '#FF6B2B',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  qrBox: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 252,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  paidOverlay: {
    alignItems: 'center',
    gap: 12,
  },
  paidIcon: {
    fontSize: 60,
  },
  paidText: {
    color: COLORS.success,
    fontSize: 18,
    fontWeight: '700',
  },
  totalBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },
  timerRow: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(255,107,43,0.1)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,107,43,0.3)',
  },
  timerUrgent: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  timerText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  timerTextUrgent: {
    color: COLORS.error,
  },
  instructions: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  instrTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  instrItem: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  banksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  bankChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
