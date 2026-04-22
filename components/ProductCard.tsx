import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { COLORS, formatPrice } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${product.id}` as any)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.badge && (
          <View
            style={[
              styles.badge,
              product.badge === 'sale'
                ? styles.badgeSale
                : product.badge === 'new'
                  ? styles.badgeNew
                  : styles.badgeHot,
            ]}
          >
            <Text style={styles.badgeText}>
              {product.badge === 'sale'
                ? 'SALE'
                : product.badge === 'new'
                  ? 'NEW'
                  : '🔥 HOT'}
            </Text>
          </View>
        )}
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={COLORS.star} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.sold}>· {product.sold.toLocaleString()} terjual</Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSale: { backgroundColor: COLORS.accent },
  badgeNew: { backgroundColor: '#10B981' },
  badgeHot: { backgroundColor: '#EF4444' },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
    gap: 4,
  },
  name: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    color: COLORS.star,
    fontSize: 11,
    fontWeight: '600',
  },
  sold: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  originalPrice: {
    color: COLORS.textMuted,
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
