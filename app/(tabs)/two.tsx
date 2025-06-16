import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';

export default function TabTwoScreen() {
  // Dados simulados da agenda do professor
  const agenda = [
    {
      id: '1',
      horario: '08:00 - 10:00',
      local: 'Laboratório de Informática 01',
      disciplina: 'Programação I',
    },
    {
      id: '2',
      horario: '13:30 - 15:10',
      local: 'Sala 204 - Bloco B',
      disciplina: 'Banco de Dados',
    },
    {
      id: '3',
      horario: '19:00 - 21:00',
      local: 'Laboratório de Redes',
      disciplina: 'Redes de Computadores',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Agenda</Text>

      <FlatList
        data={agenda}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.disciplina}</Text>
            <Text style={styles.cardText}>📅 {item.horario}</Text>
            <Text style={styles.cardText}>📍 {item.local}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Reserva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#374198',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#C4C4C4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    left: 20,
    backgroundColor: '#0077ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
