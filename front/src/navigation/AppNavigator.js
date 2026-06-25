import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import TccsScreen from '../screens/TccsScreen';
import DetalhesTCCScreen from '../screens/DetalhesTCCScreen';
import CadastrarTCCScreen from '../screens/CadastrarTCCScreen';
import ListaGenericaScreen from '../screens/ListaGenericaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#0F2742' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
};

function TccsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="ListaTCCs" component={TccsScreen} options={{ title: 'TCCs' }} />
      <Stack.Screen name="DetalhesTCC" component={DetalhesTCCScreen} options={{ title: 'Detalhes' }} />
      <Stack.Screen name="CadastrarTCC" component={CadastrarTCCScreen} options={{ title: 'Novo TCC' }} />
    </Stack.Navigator>
  );
}

function PessoasStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen name="MenuPessoas" component={MenuPessoas} options={{ title: 'Cadastros' }} />
      <Stack.Screen name="ListaGenerica" component={ListaGenericaScreen} options={({ route }) => ({ title: route.params?.tipo ?? 'Lista' })} />
    </Stack.Navigator>
  );
}

function MenuPessoas({ navigation }) {
  const items = [
    { tipo: 'Alunos', icon: 'school-outline', cor: '#2563EB', bg: '#DBEAFE' },
    { tipo: 'Professores', icon: 'people-outline', cor: '#059669', bg: '#D1FAE5' },
    { tipo: 'Cursos', icon: 'library-outline', cor: '#D97706', bg: '#FEF3C7' },
    { tipo: 'Departamentos', icon: 'business-outline', cor: '#7C3AED', bg: '#EDE9FE' },
    { tipo: 'Unidades', icon: 'home-outline', cor: '#DB2777', bg: '#FCE7F3' },
  ];
  return (
    <View style={ms.container}>
      <Text style={ms.intro}>Consulte alunos, professores e estrutura acadêmica.</Text>
      {items.map(({ tipo, icon, cor, bg }) => (
        <TouchableOpacity
          key={tipo}
          style={[ms.card, { borderLeftColor: cor }]}
          onPress={() => navigation.navigate('ListaGenerica', { tipo })}
          activeOpacity={0.75}
        >
          <View style={[ms.iconBox, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={22} color={cor} />
          </View>
          <Text style={ms.label}>{tipo}</Text>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ms = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FB', padding: 16, gap: 10 },
  intro: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#E2E8F0',
    borderRightColor: '#E2E8F0',
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1E293B' },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0F2742',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            height: 64,
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
            backgroundColor: '#FFF',
            paddingTop: 6,
            paddingBottom: 8,
          },
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 11, color, fontWeight: focused ? '700' : '500' }}>
              {route.name === 'Dashboard' ? 'Dashboard'
                : route.name === 'TCCs' ? 'TCCs'
              : 'Cadastros'}
            </Text>
          ),
          tabBarIcon: ({ focused, color }) => {
            const map = {
              Dashboard: focused ? 'grid' : 'grid-outline',
              TCCs: focused ? 'document-text' : 'document-text-outline',
              Cadastros: focused ? 'people' : 'people-outline',
            };
            return <Ionicons name={map[route.name]} size={focused ? 24 : 22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="TCCs" component={TccsStack} />
        <Tab.Screen name="Cadastros" component={PessoasStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
