import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { COLORS } from '@/constants/theme';
import { PRODUCTS, CATEGORIES } from '@/data/products';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating' | 'sold';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'default', label: 'Relevan' },
  { id: 'price_asc', label: 'Termurah' },
  { id: 'price_desc', label: 'Termahal' },
  { id: 'rating', label: 'Rating' },
  { id: 'sold', label: 'Terlaris' },
];

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ q?: string; cat?: string }>();
  const [search, setSearch] = useState(params.q ?? '');
  const [selectedCat, setSelectedCat] = useState(params.cat ?? 'all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCat !== 'all') {
      result = result.filter((p) => p.category === selectedCat);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'sold':
        result.sort((a, b) => b.sold - a.sold);
        break;
    }

    return result;
  }, [search, selectedCat, sortBy]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Katalog Produk</Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari produk..."
              placeholderTextColor={COLORS.textMuted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.sortBtn, showSort && styles.sortBtnActive]}
            onPress={() => setShowSort((v) => !v)}
          >
            <Ionicons name="swap-vertical" size={18} color={showSort ? '#fff' : COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        {showSort && (
          <View style={styles.sortRow}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.sortChip, sortBy === opt.id && styles.sortChipActive]}
                onPress={() => { setSortBy(opt.id); setShowSort(false); }}
              >
                <Text style={[styles.sortChipText, sortBy === opt.id && styles.sortChipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Category Filter */}
        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />
      </SafeAreaView>

      {/* Result count */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {filtered.length} produk ditemukan
        </Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
            <Text style={styles.emptySub}>Coba kata kunci atau kategori lain</Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    padding: 0,
  },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortBtnActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  sortChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: '#fff',
  },
  resultRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
