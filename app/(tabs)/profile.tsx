import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrderStore } from '@/store/orderStore';
import { COLORS, formatPrice } from '@/constants/theme';

export default function ProfileScreen() {
  const { orders } = useOrderStore();

  const statusLabel: Record<string, string> = {
    pending: 'Menunggu',
    paid: 'Dibayar',
    shipped: 'Dikirim',
    delivered: 'Selesai',
  };

  const statusColor: Record<string, string> = {
    pending: COLORS.warning,
    paid: COLORS.success,
    shipped: '#60A5FA',
    delivered: COLORS.textMuted,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <SafeAreaView edges={['top']} style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.userName}>Pengguna PriCommerce</Text>
            <Text style={styles.userEmail}>user@pricommerce.id</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Pesanan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatPrice(orders.reduce((s, o) => s + o.total, 0))}
            </Text>
            <Text style={styles.statLabel}>Total Belanja</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {[
            { icon: 'notifications-outline', label: 'Notifikasi' },
            { icon: 'location-outline', label: 'Alamat Pengiriman' },
            { icon: 'card-outline', label: 'Metode Pembayaran' },
            { icon: 'shield-checkmark-outline', label: 'Keamanan Akun' },
            { icon: 'help-circle-outline', label: 'Bantuan & FAQ' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <Ionicons name={item.icon as any} size={20} color={COLORS.textSecondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Order History */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>Riwayat Pesanan</Text>

          {orders.length === 0 ? (
            <View style={styles.noOrders}>
              <Text style={styles.noOrdersIcon}>📦</Text>
              <Text style={styles.noOrdersText}>Belum ada pesanan</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${statusColor[order.status]}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusColor[order.status] },
                      ]}
                    >
                      {statusLabel[order.status]}
                    </Text>
                  </View>
                </View>

                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>

                <Text style={styles.orderItems}>
                  {order.items.length} produk · {formatPrice(order.total)}
                </Text>
              </View>
            ))
          )}
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  avatarText: { fontSize: 24 },
  userName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  statValue: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  menuSection: {
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  ordersSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  noOrders: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  noOrdersIcon: { fontSize: 40 },
  noOrdersText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderDate: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  orderItems: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
