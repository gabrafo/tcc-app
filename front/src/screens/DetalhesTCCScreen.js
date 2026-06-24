import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Linking, Modal, ActivityIndicator,
} from 'react-native';
import { api, API_ORIGIN } from '../services/api';
import { STATUS_MAP } from '../services/status';

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP[0];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function DetalhesTCCScreen({ route, navigation }) {
  const [tcc, setTcc] = useState(route.params.tcc);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  async function changeStatus(newStatus) {
    try {
      setSaving(true);
      const updated = await api.atualizarStatus(tcc.id, newStatus);
      setTcc(updated);
      setModalVisible(false);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSaving(false);
    }
  }

  function openArquivo() {
    if (!tcc.arquivo) return;
    const url = tcc.arquivo.startsWith('http')
      ? tcc.arquivo
      : `${API_ORIGIN}${tcc.arquivo}`;
    Linking.openURL(url);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tcc.titulo}</Text>
        <StatusBadge status={tcc.status} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <InfoRow label="Aluno" value={tcc.aluno_nome ?? tcc.aluno} />
        <InfoRow label="Orientador" value={tcc.orientador_nome ?? tcc.orientador} />
        <InfoRow label="Curso" value={tcc.curso_nome ?? tcc.curso} />
        <InfoRow label="Ano de Defesa" value={tcc.ano_defesa} />
        <InfoRow label="Palavras-chave" value={tcc.palavras_chave} />
      </View>

      {tcc.resumo ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.resumo}>{tcc.resumo}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {tcc.arquivo ? (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={openArquivo}>
            <Text style={styles.btnText}>📄 Ver Arquivo PDF</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.btn, styles.btnDisabled]}>
            <Text style={[styles.btnText, { color: '#94A3B8' }]}>Sem arquivo</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.btnText, { color: '#1E3A5F' }]}>🔄 Alterar Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => navigation.navigate('CadastrarTCC', { tcc })}
        >
          <Text style={[styles.btnText, { color: '#3B82F6' }]}>✏️ Editar TCC</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de status */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Alterar Status</Text>
            {saving && <ActivityIndicator color="#3B82F6" style={{ marginBottom: 12 }} />}
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusOption,
                  { backgroundColor: val.bg },
                  Number(key) === tcc.status && styles.statusSelected,
                ]}
                onPress={() => changeStatus(Number(key))}
                disabled={saving}
              >
                <Text style={[styles.statusOptionText, { color: val.color }]}>
                  {Number(key) === tcc.status ? '✓ ' : ''}{val.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 24,
    paddingTop: 32,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#FFF', lineHeight: 28 },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  section: {
    backgroundColor: '#FFF',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#94A3B8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoLabel: { width: 110, fontSize: 13, color: '#64748B', fontWeight: '600' },
  infoValue: { flex: 1, fontSize: 13, color: '#1E293B' },
  resumo: { fontSize: 14, color: '#374151', lineHeight: 22 },

  actions: { padding: 12, gap: 10 },
  btn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  btnPrimary: { backgroundColor: '#1E3A5F' },
  btnSecondary: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
  btnOutline: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#3B82F6' },
  btnDisabled: { backgroundColor: '#F1F5F9' },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 10,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  statusOption: {
    borderRadius: 10,
    padding: 14,
  },
  statusSelected: { borderWidth: 2, borderColor: '#1E3A5F' },
  statusOptionText: { fontSize: 15, fontWeight: '700' },
});
