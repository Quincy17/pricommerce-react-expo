import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 6,
      }),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <LinearGradient
        colors={[COLORS.background, '#0A2010']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Success Icon */}
        <Animated.View style={[styles.iconContainer, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.iconBg}
          >
            <Ionicons name="checkmark" size={52} color="#fff" />
          </LinearGradient>
          {/* Ring */}
          <View style={styles.ring1} />
          <View style={styles.ring2} />
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            { opacity, transform: [{ translateY: slideUp }] },
          ]}
        >
          <Text style={styles.title}>Pembayaran Berhasil! 🎉</Text>
          <Text style={styles.subtitle}>
            Pesananmu sedang diproses dan akan segera dikirim
          </Text>

          {/* Order ID */}
          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>Nomor Pesanan</Text>
            <Text style={styles.orderIdValue}>{orderId}</Text>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            {[
              {
                icon: 'mail-outline',
                title: 'Konfirmasi Email',
                sub: 'Dikirim ke email kamu',
              },
              {
                icon: 'cube-outline',
                title: 'Status Pengiriman',
                sub: 'Pantau di tab Profil',
              },
              {
                icon: 'headset-outline',
                title: 'Butuh Bantuan?',
                sub: 'Hubungi CS kami',
              },
            ].map((item) => (
              <View key={item.icon} style={styles.infoCard}>
                <View style={styles.infoIconBox}>
                  <Ionicons name={item.icon as any} size={20} color={COLORS.success} />
                </View>
                <View>
                  <Text style={styles.infoTitle}>{item.title}</Text>
                  <Text style={styles.infoSub}>{item.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btns}>
            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() => router.replace('/(tabs)/profile')}
            >
              <Ionicons name="list-outline" size={18} color={COLORS.success} />
              <Text style={styles.trackBtnText}>Lihat Pesanan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.accentDark, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.homeBtnGradient}
              >
                <Ionicons name="home-outline" size={18} color="#fff" />
                <Text style={styles.homeBtnText}>Kembali ke Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  ring2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  orderIdBox: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  orderIdLabel: { color: COLORS.textMuted, fontSize: 12 },
  orderIdValue: { color: COLORS.success, fontSize: 17, fontWeight: '800', letterSpacing: 1 },
  infoCards: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  infoSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 1 },
  btns: { width: '100%', gap: 10, marginTop: 8 },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1.5,
    borderColor: COLORS.success,
  },
  trackBtnText: { color: COLORS.success, fontSize: 15, fontWeight: '700' },
  homeBtn: { borderRadius: 14, overflow: 'hidden' },
  homeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  homeBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
