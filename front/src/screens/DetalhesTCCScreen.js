import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, Linking, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

function InfoRow({ label, value, icon }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color="#64748B" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function ActionButton({ icon, label, style, textStyle, iconColor, onPress, disabled }) {
  const content = (
    <View style={styles.btnContent}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={[styles.btnText, textStyle]}>{label}</Text>
    </View>
  );

  if (disabled) {
    return <View style={[styles.btn, styles.btnDisabled]}>{content}</View>;
  }

  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress} activeOpacity={0.78}>
      {content}
    </TouchableOpacity>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="document-text-outline" size={26} color="#BFDBFE" />
        </View>
        <Text style={styles.title}>{tcc.titulo}</Text>
        <StatusBadge status={tcc.status} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <InfoRow label="Aluno" value={tcc.aluno_nome ?? tcc.aluno} icon="school-outline" />
        <InfoRow label="Orientador" value={tcc.orientador_nome ?? tcc.orientador} icon="person-outline" />
        <InfoRow label="Curso" value={tcc.curso_nome ?? tcc.curso} icon="library-outline" />
        <InfoRow label="Ano de Defesa" value={tcc.ano_defesa} icon="calendar-outline" />
        <InfoRow label="Palavras-chave" value={tcc.palavras_chave} icon="pricetags-outline" />
      </View>

      {tcc.resumo ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text style={styles.resumo}>{tcc.resumo}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {tcc.arquivo ? (
          <ActionButton
            icon="document-attach-outline"
            label="Ver arquivo PDF"
            style={styles.btnPrimary}
            iconColor="#FFF"
            onPress={openArquivo}
          />
        ) : (
          <ActionButton
            icon="document-outline"
            label="Sem arquivo"
            textStyle={{ color: '#94A3B8' }}
            iconColor="#94A3B8"
            disabled
          />
        )}

        <ActionButton
          icon="swap-horizontal-outline"
          label="Alterar status"
          style={styles.btnSecondary}
          textStyle={{ color: '#0F2742' }}
          iconColor="#0F2742"
          onPress={() => setModalVisible(true)}
        />

        <ActionButton
          icon="create-outline"
          label="Editar TCC"
          style={styles.btnOutline}
          textStyle={{ color: '#2563EB' }}
          iconColor="#2563EB"
          onPress={() => navigation.navigate('CadastrarTCC', { tcc })}
        />
      </View>

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
            {saving && <ActivityIndicator color="#2563EB" style={{ marginBottom: 12 }} />}
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
                {Number(key) === tcc.status ? (
                  <Ionicons name="checkmark-circle" size={18} color={val.color} />
                ) : (
                  <View style={styles.statusSpacer} />
                )}
                <Text style={[styles.statusOptionText, { color: val.color }]}>
                  {val.label}
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
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: '#0F2742',
    padding: 24,
    paddingTop: 32,
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(96, 165, 250, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#FFF', lineHeight: 28 },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  section: {
    backgroundColor: '#FFF',
    margin: 14,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0 },
  infoRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  infoValue: { fontSize: 14, color: '#1E293B', lineHeight: 20 },
  resumo: { fontSize: 14, color: '#374151', lineHeight: 22 },

  actions: { paddingHorizontal: 14, gap: 10 },
  btn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  btnPrimary: { backgroundColor: '#0F2742' },
  btnSecondary: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
  btnOutline: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#2563EB' },
  btnDisabled: { backgroundColor: '#F1F5F9' },
  btnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
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
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusSelected: { borderWidth: 2, borderColor: '#0F2742' },
  statusSpacer: { width: 18, height: 18 },
  statusOptionText: { fontSize: 15, fontWeight: '700' },
});
