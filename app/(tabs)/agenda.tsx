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
            <Text style={styles.cardTitle}>{item.disciplina}</Text>
            <Text style={styles.cardText}>📚 Curso: {item.curso}</Text>
            <Text style={styles.cardText}>📅 Data: {item.horario}</Text>
            <Text style={styles.cardText}>📍 Local: {item.local}</Text>
            {item.observacoes ? (
              <Text style={styles.cardText}>📝 Observações: {item.observacoes}</Text>
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
  emptyContainer: {
    backgroundColor: '#374198',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#374198',
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
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
