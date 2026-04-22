import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CartItem } from '@/components/CartItem';
import { OrderSummary } from '@/components/OrderSummary';
import { useCartStore } from '@/store/cartStore';
import { COLORS, formatPrice } from '@/constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, subtotal, shippingCost, total } = useCartStore();

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <SafeAreaView edges={['top']} style={styles.header}>
          <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        </SafeAreaView>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
          <Text style={styles.emptySub}>
            Yuk tambahkan produk favoritmu!
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text style={styles.shopBtnText}>Mulai Belanja</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Keranjang Belanja</Text>
        <Text style={styles.headerSub}>{items.length} produk</Text>
      </SafeAreaView>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CartItem item={item} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <OrderSummary
              subtotal={subtotal()}
              shippingCost={shippingCost()}
              total={total()}
            />

            {shippingCost() > 0 && (
              <View style={styles.freeShippingHint}>
                <Ionicons name="information-circle-outline" size={14} color={COLORS.accent} />
                <Text style={styles.freeShippingHintText}>
                  Belanja {formatPrice(500000 - subtotal())} lagi untuk gratis ongkir
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push('/checkout')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[COLORS.accentDark, COLORS.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.checkoutGradient}
              >
                <Ionicons name="bag-check-outline" size={20} color="#fff" />
                <Text style={styles.checkoutText}>Checkout</Text>
                <Text style={styles.checkoutTotal}>{formatPrice(total())}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  headerSub: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  list: {
    padding: 16,
  },
  footer: {
    gap: 12,
    marginTop: 8,
    paddingBottom: 20,
  },
  freeShippingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,107,43,0.08)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,107,43,0.2)',
  },
  freeShippingHintText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  checkoutBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  checkoutTotal: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  shopBtn: {
    marginTop: 8,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
