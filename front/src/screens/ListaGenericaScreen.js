import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import { api } from '../services/api';

const CONFIGS = {
  Alunos: {
    fetch: () => api.getAlunos(),
    primary: item => item.nome,
    secondary: item => item.matricula ? `Matrícula: ${item.matricula}` : item.email ?? '',
    icon: '🎓',
  },
  Professores: {
    fetch: () => api.getProfessores(),
    primary: item => item.nome,
    secondary: item => item.departamento_nome ?? item.email ?? '',
    icon: '👨‍🏫',
  },
  Cursos: {
    fetch: () => api.getCursos(),
    primary: item => item.nome,
    secondary: item => item.departamento_nome ?? '',
    icon: '📚',
  },
  Departamentos: {
    fetch: () => api.getDepartamentos(),
    primary: item => item.nome,
    secondary: item => item.unidade_nome ?? '',
    icon: '🏛️',
  },
  Unidades: {
    fetch: () => api.getUnidades(),
    primary: item => item.nome,
    secondary: item => item.sigla ?? '',
    icon: '🏫',
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

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#3B82F6" />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder={`Buscar ${tipo.toLowerCase()}...`}
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.icon}>{config.icon}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{config.primary(item)}</Text>
              {!!config.secondary(item) && (
                <Text style={styles.sub}>{config.secondary(item)}</Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum item encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: {
    margin: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: { fontSize: 28 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  sub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 60 },
});
