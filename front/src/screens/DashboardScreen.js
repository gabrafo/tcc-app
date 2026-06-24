import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, RefreshControl,
} from 'react-native';
import { api } from '../services/api';
import { STATUS_MAP } from '../services/status';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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

function StatCard({ label, value, color }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#3B82F6" />;

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => load()}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusEntries = Object.entries(stats?.por_status ?? {});

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Visão geral dos TCCs</Text>
      </View>

      <View style={styles.statGrid}>
        <StatCard label="Total Geral" value={stats?.total_geral ?? 0} color="#3B82F6" />
        {statusEntries.map(([key, val], i) => (
          <StatCard key={key} label={key} value={val} color={COLORS[i % COLORS.length]} />
        ))}
      </View>

      <BarChart data={stats?.por_status} label="TCCs por Status" />
      <BarChart data={stats?.por_orientador} label="TCCs por Orientador" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 24,
    paddingTop: 48,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#FFF' },
  subtitle: { fontSize: 14, color: '#93C5FD', marginTop: 4 },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    width: '47%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: '#1E293B' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },

  chartContainer: {
    backgroundColor: '#FFF',
    margin: 12,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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

  errorText: { color: '#EF4444', marginBottom: 12 },
  retryBtn: { backgroundColor: '#3B82F6', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: '#FFF', fontWeight: '600' },
});
