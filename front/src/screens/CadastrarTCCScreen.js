import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

// Picker simples sem dependência externa
function SimplePicker({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => String(o.value) === String(value));
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerBtn}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.pickerText, !selected && { color: '#94A3B8' }]}>
          {selected ? selected.label : placeholder ?? 'Selecionar...'}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.dropdownItem, String(opt.value) === String(value) && styles.dropdownSelected]}
              onPress={() => { onChange(opt.value); setOpen(false); }}
            >
              <Text style={[styles.dropdownText, String(opt.value) === String(value) && { color: '#1E3A5F', fontWeight: '700' }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function Field({ label, required, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{required ? <Text style={{ color: '#EF4444' }}> *</Text> : ''}</Text>
      {children}
    </View>
  );
}

const STATUS_OPTIONS = [
  { value: 0, label: 'Em Elaboração' },
  { value: 1, label: 'Enviado' },
  { value: 2, label: 'Aprovado' },
  { value: 3, label: 'Reprovado' },
];

export default function CadastrarTCCScreen({ route, navigation }) {
  const editando = route.params?.tcc;

  const [form, setForm] = useState({
    titulo: editando?.titulo ?? '',
    resumo: editando?.resumo ?? '',
    palavras_chave: editando?.palavras_chave ?? '',
    ano_defesa: editando?.ano_defesa ? String(editando.ano_defesa) : '',
    status: editando?.status ?? 0,
    aluno: editando?.aluno ?? '',
    orientador: editando?.orientador ?? '',
    curso: editando?.curso ?? '',
  });
  const [arquivo, setArquivo] = useState(null); // { name, uri, type }
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: editando ? 'Editar TCC' : 'Novo TCC' });
    async function loadSelects() {
      try {
        const [a, p, c] = await Promise.all([
          api.getAlunos(),
          api.getProfessores(),
          api.getCursos(),
        ]);
        setAlunos(a.map(x => ({ value: x.id, label: x.nome ?? `Aluno ${x.id}` })));
        setProfessores(p.map(x => ({ value: x.id, label: x.nome ?? `Prof. ${x.id}` })));
        setCursos(c.map(x => ({ value: x.id, label: x.nome ?? `Curso ${x.id}` })));
      } catch (e) {
        Alert.alert('Erro ao carregar dados', e.message);
      } finally {
        setLoading(false);
      }
    }
    loadSelects();
  }, []);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  // Simulação de seleção de arquivo (sem expo-document-picker)
  function simularUpload() {
    Alert.alert(
      'Upload de PDF',
      'Em um app real, utilize expo-document-picker:\n\nimport * as DocumentPicker from "expo-document-picker";\nconst result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });\n\nPara fins de demonstração, o campo de arquivo será simulado.',
      [
        { text: 'Cancelar' },
        {
          text: 'Simular arquivo',
          onPress: () => setArquivo({ name: 'trabalho.pdf', uri: 'file://simulado.pdf', type: 'application/pdf' }),
        },
      ]
    );
  }

  async function salvar() {
    if (!form.titulo.trim()) return Alert.alert('Atenção', 'Título é obrigatório.');
    if (!form.aluno) return Alert.alert('Atenção', 'Selecione um aluno.');

    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) formData.append(k, String(v));
      });
      if (arquivo) {
        formData.append('arquivo', {
          uri: arquivo.uri,
          name: arquivo.name,
          type: arquivo.type ?? 'application/pdf',
        });
      }

      if (editando) {
        await api.atualizarTcc(editando.id, formData);
        Alert.alert('Sucesso', 'TCC atualizado!');
      } else {
        await api.criarTcc(formData);
        Alert.alert('Sucesso', 'TCC cadastrado!');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2563EB" />;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <View style={styles.body}>

        <Field label="Título" required>
          <TextInput
            style={styles.input}
            value={form.titulo}
            onChangeText={v => set('titulo', v)}
            placeholder="Título do trabalho"
            placeholderTextColor="#94A3B8"
            multiline
          />
        </Field>

        <SimplePicker
          label="Aluno *"
          options={alunos}
          value={form.aluno}
          onChange={v => set('aluno', v)}
          placeholder="Selecionar aluno..."
        />

        <SimplePicker
          label="Orientador"
          options={professores}
          value={form.orientador}
          onChange={v => set('orientador', v)}
          placeholder="Selecionar orientador..."
        />

        <SimplePicker
          label="Curso"
          options={cursos}
          value={form.curso}
          onChange={v => set('curso', v)}
          placeholder="Selecionar curso..."
        />

        <SimplePicker
          label="Status"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={v => set('status', v)}
        />

        <Field label="Ano de Defesa">
          <TextInput
            style={styles.input}
            value={form.ano_defesa}
            onChangeText={v => set('ano_defesa', v)}
            placeholder="Ex: 2024"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            maxLength={4}
          />
        </Field>

        <Field label="Palavras-chave">
          <TextInput
            style={styles.input}
            value={form.palavras_chave}
            onChangeText={v => set('palavras_chave', v)}
            placeholder="Ex: machine learning, IA, redes neurais"
            placeholderTextColor="#94A3B8"
          />
        </Field>

        <Field label="Resumo">
          <TextInput
            style={[styles.input, styles.textarea]}
            value={form.resumo}
            onChangeText={v => set('resumo', v)}
            placeholder="Resumo do trabalho..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </Field>

        <Field label="Arquivo PDF">
          <TouchableOpacity style={styles.uploadBtn} onPress={simularUpload}>
            <View style={styles.uploadIcon}>
              <Ionicons name="attach-outline" size={22} color="#2563EB" />
            </View>
            <Text style={styles.uploadText}>
              {arquivo ? arquivo.name : 'Selecionar PDF...'}
            </Text>
          </TouchableOpacity>
          {editando?.arquivo && !arquivo && (
            <Text style={styles.uploadHint}>Arquivo atual: {editando.arquivo.split('/').pop()}</Text>
          )}
        </Field>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={salvar}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#FFF" />
            : (
              <View style={styles.saveContent}>
                <Ionicons name={editando ? 'save-outline' : 'add-circle-outline'} size={19} color="#FFF" />
                <Text style={styles.saveBtnText}>{editando ? 'Salvar alterações' : 'Cadastrar TCC'}</Text>
              </View>
            )
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB' },
  content: { paddingBottom: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F8FB' },
  body: { padding: 16, gap: 4 },

  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
  },
  textarea: { minHeight: 110, paddingTop: 12 },

  pickerContainer: { marginBottom: 14 },
  pickerBtn: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: { fontSize: 14, color: '#1E293B', flex: 1 },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
    maxHeight: 220,
    overflow: 'scroll',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 999,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownSelected: { backgroundColor: '#EFF6FF' },
  dropdownText: { fontSize: 14, color: '#374151' },

  uploadBtn: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  uploadText: { fontSize: 14, color: '#2563EB', fontWeight: '700' },
  uploadHint: { fontSize: 12, color: '#64748B', marginTop: 4, paddingLeft: 2 },

  saveBtn: {
    backgroundColor: '#0F2742',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
