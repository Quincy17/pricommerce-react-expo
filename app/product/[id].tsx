import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { COLORS, formatPrice } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.items);

  const product = PRODUCTS.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'review'>('desc');

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Produk tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const inCart = cartItems.find((i) => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/(tabs)/cart');
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(15,23,42,0.6)', 'transparent']}
          style={styles.imageTopGradient}
        />

        {/* Back Button */}
        <SafeAreaView edges={['top']} style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => router.push('/(tabs)/cart')}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </SafeAreaView>

        {/* Badges */}
        <View style={styles.badgesRow}>
          {product.badge && (
            <View
              style={[
                styles.badge,
                product.badge === 'sale'
                  ? { backgroundColor: COLORS.accent }
                  : product.badge === 'new'
                    ? { backgroundColor: '#10B981' }
                    : { backgroundColor: '#EF4444' },
              ]}
            >
              <Text style={styles.badgeText}>
                {product.badge === 'sale' ? 'SALE' : product.badge === 'new' ? 'NEW' : '🔥 HOT'}
              </Text>
            </View>
          )}
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>HEMAT {discount}%</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.info} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons
                key={i}
                name={i <= Math.floor(product.rating) ? 'star' : 'star-outline'}
                size={14}
                color={COLORS.star}
              />
            ))}
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewCount.toLocaleString()} ulasan)
            </Text>
            <Text style={styles.soldText}>· {product.sold.toLocaleString()} terjual</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.quantityRow}>
          <Text style={styles.qtyLabel}>Jumlah</Text>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={18} color={quantity <= 1 ? COLORS.textMuted : COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.stockText}>Stok tersedia</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            {(['desc', 'review'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'desc' ? 'Deskripsi' : 'Ulasan'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'desc' ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : (
            <View style={styles.reviews}>
              {[
                { name: 'Andi S.', rating: 5, text: 'Produk bagus, sesuai deskripsi! Pengiriman cepat.' },
                { name: 'Budi K.', rating: 4, text: 'Kualitas oke, harga worth it. Recommended!' },
                { name: 'Citra M.', rating: 5, text: 'Sangat puas! Akan beli lagi. Packing aman.' },
              ].map((r) => (
                <View key={r.name} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text>{r.name[0]}</Text>
                    </View>
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewName}>{r.name}</Text>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Ionicons key={i} name="star" size={10} color={i <= r.rating ? COLORS.star : COLORS.border} />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color={COLORS.accent} />
          <Text style={styles.addCartText}>
            {inCart ? 'Tambah Lagi' : 'Keranjang'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
          <LinearGradient
            colors={[COLORS.accentDark, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buyBtnGradient}
          >
            <Text style={styles.buyBtnText}>Beli Sekarang</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  notFoundText: { color: COLORS.text, fontSize: 18 },
  back: { color: COLORS.accent, fontSize: 15, marginTop: 12 },
  imageContainer: { width, height: 340, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageTopGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  badgesRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  discountBadge: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { flex: 1 },
  headerInfo: {
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  category: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  name: { color: COLORS.text, fontSize: 18, fontWeight: '700', lineHeight: 24 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: COLORS.textSecondary, fontSize: 12, marginLeft: 4 },
  soldText: { color: COLORS.textMuted, fontSize: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  price: { color: COLORS.accent, fontSize: 22, fontWeight: '800' },
  originalPrice: {
    color: COLORS.textMuted,
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  qtyLabel: { color: COLORS.textSecondary, fontSize: 14, flex: 1 },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  qtyBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { color: COLORS.text, fontSize: 16, fontWeight: '700', minWidth: 30, textAlign: 'center' },
  stockText: { color: COLORS.success, fontSize: 12, fontWeight: '600' },
  tabsContainer: { padding: 16 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  description: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
  reviews: { gap: 12 },
  reviewItem: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewInfo: { gap: 3 },
  reviewName: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,107,43,0.1)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  addCartText: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  buyBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  buyBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
