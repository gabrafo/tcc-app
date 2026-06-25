import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, Alert, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { STATUS_MAP } from '../services/status';
import SearchBar from '../components/SearchBar';

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP[0];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

function MetaRow({ icon, children }) {
  return (
    <View style={styles.metaRow}>
      <Ionicons name={icon} size={14} color="#64748B" />
      <Text style={styles.cardMeta} numberOfLines={1}>{children}</Text>
    </View>
  );
}

function TccCard({ item, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
        <StatusBadge status={item.status} />
      </View>
      <MetaRow icon="school-outline">Aluno: {item.aluno_nome ?? item.aluno}</MetaRow>
      {item.orientador_nome && (
        <MetaRow icon="person-outline">Orientador: {item.orientador_nome}</MetaRow>
      )}
      <View style={styles.cardFooter}>
        <View style={styles.yearPill}>
          <Ionicons name="calendar-outline" size={13} color="#64748B" />
          <Text style={styles.cardYear}>{item.ano_defesa ?? '-'}</Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(item)} style={styles.deleteBtn} hitSlop={8}>
          <Ionicons name="trash-outline" size={15} color="#DC2626" />
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function TccsScreen({ navigation }) {
  const [tccs, setTccs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function applyFilters(list, text, status) {
    let result = list;
    if (status !== null) {
      result = result.filter(t => t.status === status);
    }
    if (text) {
      const q = text.toLowerCase();
      result = result.filter(t =>
        t.titulo?.toLowerCase().includes(q) ||
        String(t.aluno_nome ?? t.aluno ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }

  async function load(isRefresh = false) {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await api.getTccs();
      setTccs(data);
      setFiltered(applyFilters(data, search, statusFilter));
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(useCallback(() => { load(); }, []));

  function handleSearch(text) {
    setSearch(text);
    setFiltered(applyFilters(tccs, text, statusFilter));
  }

  function handleStatusFilter(status) {
    const next = statusFilter === status ? null : status;
    setStatusFilter(next);
    setFiltered(applyFilters(tccs, search, next));
  }

  function handleDelete(item) {
    Alert.alert(
      'Excluir TCC',
      `Deseja excluir "${item.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await api.deletarTcc(item.id);
              load();
            } catch (e) {
              Alert.alert('Erro', e.message);
            }
          },
        },
      ]
    );
  }

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  const countLabel = filtered.length === 1 ? '1 TCC' : `${filtered.length} TCCs`;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <SearchBar
          style={styles.searchBar}
          value={search}
          onChangeText={handleSearch}
          placeholder="Buscar por título ou aluno..."
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CadastrarTCC')}
        >
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addText}>Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <TouchableOpacity
          style={[styles.filterChip, statusFilter === null && styles.filterChipActive]}
          onPress={() => {
            setStatusFilter(null);
            setFiltered(applyFilters(tccs, search, null));
          }}
        >
          <Text style={[styles.filterText, statusFilter === null && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        {Object.entries(STATUS_MAP).map(([key, val]) => {
          const status = Number(key);
          const active = statusFilter === status;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterChip,
                { backgroundColor: active ? val.color : val.bg },
              ]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text style={[styles.filterText, { color: active ? '#FFF' : val.color }]}>
                {val.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.resultCount}>{countLabel} encontrado{filtered.length === 1 ? '' : 's'}</Text>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TccCard
            item={item}
            onPress={t => navigation.navigate('DetalhesTCC', { tcc: t })}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#2563EB" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="document-text-outline" size={32} color="#64748B" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum TCC encontrado</Text>
            <Text style={styles.empty}>
              {search || statusFilter !== null
                ? 'Tente outro termo ou remova os filtros.'
                : 'Cadastre o primeiro TCC com o botão Novo.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F8FB' },
  topBar: {
    flexDirection: 'row',
    padding: 14,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: '#FFF',
  },
  searchBar: { flex: 1 },
  filters: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#0F2742',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFF',
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  addBtn: {
    backgroundColor: '#0F2742',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  addText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  listContent: { padding: 14, paddingBottom: 24 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1E293B' },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  cardMeta: { flex: 1, fontSize: 13, color: '#64748B' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  cardYear: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  deleteBtn: { paddingHorizontal: 8, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 5 },
  deleteText: { fontSize: 13, color: '#DC2626', fontWeight: '700' },
  emptyState: { alignItems: 'center', gap: 8, marginTop: 48, paddingHorizontal: 32 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#475569' },
  empty: { textAlign: 'center', color: '#94A3B8', fontSize: 14, lineHeight: 20 },
});
