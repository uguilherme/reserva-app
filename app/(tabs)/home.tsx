import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useReserva } from '../../context/ReservaContext';
import { router } from 'expo-router';

// Listas de locais por tipo (mesmo do reservarEspaco)
const locaisPorTipo: { [key: string]: string[] } = {
  'Laboratório de Habilidades': [
    'Laboratório de Anatomia',
    'Laboratório de Fisioterapia',
    'Laboratório de Psicologia',
  ],
  'Sala de Aula': [
    'Sala B1 105',
    'Sala B2 110',
    'Sala B1 120',
  ],
  'Laboratório de Informatica': [
    'Labinfo 01',
    'Labinfo 02',
    'Labinfo 03',
  ],
  'Auditórios e Plenários': [
    'Auditório Principal',
    'Auditório Secundário',
    'Plenário',
  ],
};

function parseDataReserva(horario: string): Date | null {
  // Espera formato: "horaInicial - horaFinal (dd/mm/yyyy)"
  const match = horario.match(/\((\d{2}\/\d{2}\/\d{4})\)$/);
  if (!match) return null;
  const [dia, mes, ano] = match[1].split('/');
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
}

function getTipoLocalFromReserva(local: string): string {
  // Extrai o tipo do local do campo local, que está no formato: "Nome do local (Tipo do local)"
  const match = local.match(/\(([^)]+)\)$/);
  return match ? match[1] : '';
}

export default function HomeScreen() {
  const { reservas } = useReserva();

  // Filtra reservas para os próximos 7 dias e limita a 5 reservas
  const hoje = new Date();
  const daquiUmaSemana = new Date();
  daquiUmaSemana.setDate(hoje.getDate() + 7);

  const proximasReservas = reservas
    .map((reserva) => {
      const dataReserva = parseDataReserva(reserva.horario);
      return dataReserva
        ? { ...reserva, dataObj: dataReserva }
        : null;
    })
    .filter(
      (reserva) =>
        reserva &&
        reserva.dataObj >= hoje &&
        reserva.dataObj <= daquiUmaSemana
    )
    .sort((a, b) => a!.dataObj.getTime() - b!.dataObj.getTime())
    .slice(0, 5);

  // Cálculo das salas/laboratórios/auditórios disponíveis
  // 1. Conta quantos de cada tipo estão reservados para hoje
  const reservasHoje = reservas.filter((reserva) => {
    const dataReserva = parseDataReserva(reserva.horario);
    return (
      dataReserva &&
      dataReserva.getDate() === hoje.getDate() &&
      dataReserva.getMonth() === hoje.getMonth() &&
      dataReserva.getFullYear() === hoje.getFullYear()
    );
  });

  // 2. Conta reservas por tipo
  const reservadosHoje: { [key: string]: Set<string> } = {
    'Laboratório de Habilidades': new Set(),
    'Sala de Aula': new Set(),
    'Laboratório de Informatica': new Set(),
    'Auditórios e Plenários': new Set(),
  };

  reservasHoje.forEach((reserva) => {
    const tipo = getTipoLocalFromReserva(reserva.local);
    if (reservadosHoje[tipo]) {
      const nomeLocal = reserva.local.split(' (')[0];
      reservadosHoje[tipo].add(nomeLocal);
    }
  });

  // 3. Calcula quantos estão livres
  const livresHabilidades =
    locaisPorTipo['Laboratório de Habilidades'].length -
    reservadosHoje['Laboratório de Habilidades'].size;
  const livresInformatica =
    locaisPorTipo['Laboratório de Informatica'].length -
    reservadosHoje['Laboratório de Informatica'].size;
  const livresAuditorios =
    locaisPorTipo['Auditórios e Plenários'].length -
    reservadosHoje['Auditórios e Plenários'].size;
  const livresSalas =
    locaisPorTipo['Sala de Aula'].length -
    reservadosHoje['Sala de Aula'].size;

  // Soma total de todos os tipos
  const totalLivresAgora =
    livresHabilidades + livresInformatica + livresAuditorios + livresSalas;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Boas-vindas */}
      <Text style={styles.titulo}>Olá, Guilherme! 👋</Text>
      <Text style={styles.subtitulo}>
      </Text>

      {/* Próximas reservas */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>📅 Próximas Reservas</Text>
        {proximasReservas.length === 0 ? (
          <Text style={styles.textoReserva}>Nenhuma reserva nos próximos 7 dias.</Text>
        ) : (
          proximasReservas.map((reserva) => {
            // Extrai informações do campo horario
            const match = reserva!.horario.match(/^(\d{2}:\d{2}) - (\d{2}:\d{2}) \((\d{2}\/\d{2}\/\d{4})\)$/);
            const horaIni = match ? match[1] : '';
            const horaFim = match ? match[2] : '';
            const data = match ? match[3] : '';
            // Extrai nome da sala
            const nomeSala = reserva!.local.split(' (')[0];
            return (
              <View key={reserva!.id} style={styles.itemReserva}>
                <Ionicons name="calendar-outline" size={20} color="#374198" />
                <View>
                  <Text style={styles.textoReserva}>
                    <Text style={{ fontWeight: 'bold'}}>Disciplina:</Text> {reserva!.disciplina}
                  </Text>
                  <Text style={styles.textoReserva}>
                    <Text style={{ fontWeight: 'bold'}}>Sala:</Text> {nomeSala}
                  </Text>
                  <Text style={styles.textoReserva}>
                    <Text style={{ fontWeight: 'bold' }}>Data:</Text> {data} {horaIni} - {horaFim}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>


      {/* Avisos */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>🔔 Avisos</Text>
        <Text style={styles.aviso}>
          ⚠️ Sala 05 estará em manutenção no dia 20/06.
        </Text>
      </View>

      {/* Atalhos rápidos */}
      <View style={styles.atalhosContainer}>
        <TouchableOpacity 
        style={styles.atalho}
        onPress={() => router.push('/(tabs)/reservarEspaco')}>
          <MaterialIcons name="add-box" size={28} color="#fff" />
          <Text style={styles.atalhoTexto}>Nova Reserva</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.atalho}
        onPress={() => router.push('/(tabs)/agenda')}>
          <FontAwesome5 name="calendar-check" size={24} color="#fff" />
          <Text style={styles.atalhoTexto}>Minhas Reservas</Text>
          
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#374198',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374198',
    marginBottom: 8,
  },
  itemReserva: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  textoReserva: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
    // Remova borderRadius e padding!
  },
  salasLivres: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  salasLivresDetalhe: {
    fontSize: 15,
    color: '#374198',
    marginBottom: 2,
    marginLeft: 8,
  },
  salasLivresGrande: {
    fontSize: 32,
    color: '#374198',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  botao: {
    backgroundColor: '#DD6E6F',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aviso: {
    fontSize: 16,
    color: '#333',
  },
  atalhosContainer: {
    backgroundColor: '#374198',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  atalho: {
    backgroundColor: '#DD6E6F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  atalhoTexto: {
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
}); 