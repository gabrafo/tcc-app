import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'];
const STATUS_ICONS = ['create-outline', 'send-outline', 'checkmark-circle-outline', 'close-circle-outline'];

function BarChart({ data, label }) {
  if (!data || Object.keys(data).length === 0) return null;
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v));
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{label}</Text>
      {entries.map(([key, val], i) => (
        <View key={key} style={styles.barRow}>
          <Text style={styles.barLabel} numberOfLines={1}>{key}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                { width: `${(val / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] },
              ]}
            />
          </View>
          <Text style={styles.barValue}>{val}</Text>
        </View>
      ))}
    </View>
  );
}

function StatCard({ label, value, color, icon = 'document-text-outline' }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.statCopy}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  async function load(isRefresh = false) {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const data = await api.getEstatisticas();
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  if (error) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons name="alert-circle-outline" size={26} color="#DC2626" />
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => load()}>
          <Ionicons name="refresh" size={16} color="#FFF" />
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusEntries = Object.entries(stats?.por_status ?? {});

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#2563EB" />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <Ionicons name="analytics-outline" size={24} color="#BFDBFE" />
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeValue}>{stats?.total_geral ?? 0}</Text>
            <Text style={styles.totalBadgeLabel}>TCCs</Text>
          </View>
        </View>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Acompanhamento geral dos trabalhos</Text>
      </View>

      <View style={styles.statGrid}>
        <StatCard label="Total Geral" value={stats?.total_geral ?? 0} color="#2563EB" icon="albums-outline" />
        {statusEntries.map(([key, val], i) => (
          <StatCard
            key={key}
            label={key}
            value={val}
            color={COLORS[i % COLORS.length]}
            icon={STATUS_ICONS[i % STATUS_ICONS.length]}
          />
        ))}
      </View>

      <BarChart data={stats?.por_status} label="TCCs por Status" />
      <BarChart data={stats?.por_orientador} label="TCCs por Orientador" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { paddingBottom: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F8FB', padding: 24 },
  header: {
    backgroundColor: '#0F2742',
    padding: 24,
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.16)',
  },
  totalBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 64,
  },
  totalBadgeValue: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  totalBadgeLabel: { fontSize: 11, color: '#BAE6FD', fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  subtitle: { fontSize: 14, color: '#BAE6FD', marginTop: 4 },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 14,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statCopy: { gap: 2 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },

  chartContainer: {
    backgroundColor: '#FFF',
    margin: 14,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  chartTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  barLabel: { width: 110, fontSize: 12, color: '#475569' },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: { height: '100%', borderRadius: 7 },
  barValue: { width: 24, fontSize: 12, fontWeight: '700', color: '#1E293B', textAlign: 'right' },

  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorText: { color: '#B91C1C', marginBottom: 12, textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryText: { color: '#FFF', fontWeight: '600' },
});
