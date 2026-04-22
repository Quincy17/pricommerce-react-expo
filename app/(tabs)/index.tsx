import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductCard } from '@/components/ProductCard';
import { COLORS, formatPrice } from '@/constants/theme';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { useCartStore } from '@/store/cartStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems());

  const hotProducts = PRODUCTS.filter((p) => p.badge === 'hot');
  const newProducts = PRODUCTS.filter((p) => p.badge === 'new').slice(0, 4);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/(tabs)/explore', params: { q: searchQuery } } as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.surface, COLORS.background]}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Halo, Selamat Datang 👋</Text>
              <Text style={styles.tagline}>Pricommerce — Belanja Mudah, Bayar QRIS</Text>
            </View>
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => router.push('/(tabs)/cart')}
            >
              <Ionicons name="cart-outline" size={24} color={COLORS.text} />
              {totalItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/(tabs)/explore')}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
            <Text style={styles.searchPlaceholder}>Cari produk...</Text>
            <Ionicons name="filter-outline" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <HeroBanner />

        {/* Kategori */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() =>
                  router.push({ pathname: '/(tabs)/explore', params: { cat: cat.id } } as any)
                }
              >
                <LinearGradient
                  colors={[COLORS.surface, COLORS.card]}
                  style={styles.categoryIcon}
                >
                  <Text style={{ fontSize: 22 }}>
                    {cat.label.split(' ')[0]}
                  </Text>
                </LinearGradient>
                <Text style={styles.categoryLabel} numberOfLines={1}>
                  {cat.label.split(' ').slice(1).join(' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Produk Hot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Produk Hot</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <TouchableOpacity style={styles.promoBanner} onPress={() => router.push('/(tabs)/explore')}>
          <LinearGradient
            colors={[COLORS.accentDark, COLORS.accent, COLORS.accentLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoBannerGradient}
          >
            <View>
              <Text style={styles.promoTitle}>🎁 Gratis Ongkir!</Text>
              <Text style={styles.promoSub}>Min. belanja {formatPrice(500000)}</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={34} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Produk Baru */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Produk Terbaru</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
    marginBottom: 14,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  tagline: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cartBtn: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchPlaceholder: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, gap: 0 },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAll: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesRow: {
    paddingHorizontal: 16,
    gap: 14,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  promoBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  promoBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  promoSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
});
