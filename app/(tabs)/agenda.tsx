import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useReserva } from '../../context/ReservaContext';

export default function TabTwoScreen() {
  const { reservas, removerReserva } = useReserva();
  const [reservaSelecionada, setReservaSelecionada] = useState<string | null>(null);

  const confirmarCancelamento = (id: string) => {
    Alert.alert(
      'Cancelar reserva',
      'Tem certeza que deseja cancelar esta reserva?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => removerReserva(id),
        },
      ],
      { cancelable: true }
    );
  };

  if (reservas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Você ainda não reservou nenhum espaço da universidade...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.curso}</Text>
            <Text style={styles.cardText}>
              <Text style={{ color: '#fff' }}>📚 Disciplina:</Text> {item.disciplina}
            </Text>
            <Text style={styles.cardText}>
              <Text style={{ color: '#fff' }}>📅 Data:</Text> {item.horario}
            </Text>
            <Text style={styles.cardText}>
              <Text style={{ color: '#fff' }}>📍 Local:</Text> {item.local}
            </Text>
            {item.observacoes ? (
              <Text style={styles.cardText}>
                <Text style={{ color: '#fff' }}>📝 Observações:</Text> {item.observacoes}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => confirmarCancelamento(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancelar reserva</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#24284d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#6b6868',
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#e94f4f',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#374198',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
