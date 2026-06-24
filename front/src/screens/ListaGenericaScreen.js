import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const CONFIGS = {
  Alunos: {
    fetch: () => api.getAlunos(),
    primary: item => item.nome,
    secondary: item => item.matricula ? `Matrícula: ${item.matricula}` : item.email ?? '',
    icon: 'school-outline',
    color: '#2563EB',
    bg: '#DBEAFE',
  },
  Professores: {
    fetch: () => api.getProfessores(),
    primary: item => item.nome,
    secondary: item => item.departamento_nome ?? item.email ?? '',
    icon: 'people-outline',
    color: '#059669',
    bg: '#D1FAE5',
  },
  Cursos: {
    fetch: () => api.getCursos(),
    primary: item => item.nome,
    secondary: item => item.departamento_nome ?? '',
    icon: 'library-outline',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  Departamentos: {
    fetch: () => api.getDepartamentos(),
    primary: item => item.nome,
    secondary: item => item.unidade_nome ?? '',
    icon: 'business-outline',
    color: '#7C3AED',
    bg: '#EDE9FE',
  },
  Unidades: {
    fetch: () => api.getUnidades(),
    primary: item => item.nome,
    secondary: item => item.sigla ?? '',
    icon: 'home-outline',
    color: '#DB2777',
    bg: '#FCE7F3',
  },
};

export default function ListaGenericaScreen({ route }) {
  const { tipo } = route.params;
  const config = CONFIGS[tipo];

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(isRefresh = false) {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await config.fetch();
      setItems(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleSearch(text) {
    setSearch(text);
    const q = text.toLowerCase();
    setFiltered(items.filter(i => config.primary(i)?.toLowerCase().includes(q)));
  }

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          style={styles.search}
          placeholder={`Buscar ${tipo.toLowerCase()}...`}
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
              <Ionicons name={config.icon} size={22} color={config.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{config.primary(item)}</Text>
              {!!config.secondary(item) && (
                <Text style={styles.sub}>{config.secondary(item)}</Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#2563EB" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name={config.icon} size={34} color="#94A3B8" />
            <Text style={styles.empty}>Nenhum item encontrado.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F8FB' },
  searchWrap: {
    margin: 12,
    marginBottom: 4,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  search: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1E293B',
  },
  listContent: { padding: 12, gap: 8, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  sub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  emptyState: { alignItems: 'center', gap: 10, marginTop: 60 },
  empty: { textAlign: 'center', color: '#94A3B8' },
});
