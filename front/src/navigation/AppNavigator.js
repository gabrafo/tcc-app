import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import TccsScreen from '../screens/TccsScreen';
import DetalhesTCCScreen from '../screens/DetalhesTCCScreen';
import CadastrarTCCScreen from '../screens/CadastrarTCCScreen';
import ListaGenericaScreen from '../screens/ListaGenericaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#1E3A5F' },
  headerTintColor: '#FFF',
  headerTitleStyle: { fontWeight: '700' },
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

import { View, TouchableOpacity, StyleSheet } from 'react-native';

function MenuPessoas({ navigation }) {
  const items = [
    { tipo: 'Alunos', icon: '🎓', cor: '#3B82F6' },
    { tipo: 'Professores', icon: '👨‍🏫', cor: '#10B981' },
    { tipo: 'Cursos', icon: '📚', cor: '#F59E0B' },
    { tipo: 'Departamentos', icon: '🏛️', cor: '#8B5CF6' },
    { tipo: 'Unidades', icon: '🏫', cor: '#EC4899' },
  ];
  return (
    <View style={ms.container}>
      {items.map(({ tipo, icon, cor }) => (
        <TouchableOpacity
          key={tipo}
          style={[ms.card, { borderLeftColor: cor }]}
          onPress={() => navigation.navigate('ListaGenerica', { tipo })}
          activeOpacity={0.75}
        >
          <Text style={ms.icon}>{icon}</Text>
          <Text style={ms.label}>{tipo}</Text>
          <Text style={ms.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ms = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, gap: 10 },
  card: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  icon: { fontSize: 26 },
  label: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1E293B' },
  arrow: { fontSize: 24, color: '#CBD5E1' },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#1E3A5F',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#E2E8F0',
            backgroundColor: '#FFF',
            paddingBottom: 4,
          },
          tabBarLabel: ({ focused, color }) => (
            <Text style={{ fontSize: 11, color, fontWeight: focused ? '700' : '500' }}>
              {route.name === 'Dashboard' ? 'Dashboard'
                : route.name === 'TCCs' ? 'TCCs'
                : 'Cadastros'}
            </Text>
          ),
          tabBarIcon: ({ focused }) => {
            const map = { Dashboard: '📊', TCCs: '📄', Cadastros: '👥' };
            return <Text style={{ fontSize: focused ? 24 : 20 }}>{map[route.name]}</Text>;
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
