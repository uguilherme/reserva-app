import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReserva } from '../../context/ReservaContext';

export default function TabTwoScreen() {
  const { adicionarReserva } = useReserva();

  const [dataReserva, setDataReserva] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [turno, setTurno] = useState('');
  const [horaInicial, setHoraInicial] = useState('');
  const [horaFinal, setHoraFinal] = useState('');
  const [curso, setCurso] = useState('');
  const [disciplina, setDisciplina] = useState('');

  const horariosPorTurno: { [key: string]: string[] } = {
    Matutino: ['07:30', '08:30', '09:30', '10:30', '11:30'],
    Vespertino: ['13:00', '14:00', '15:00', '16:00', '17:00'],
    Noturno: ['19:00', '20:00', '21:00', '22:00'],
  };

  const handleAdicionarReserva = () => {
    const novaReserva = {
      id: String(Date.now()),
      disciplina,
      horario: `${horaInicial} - ${horaFinal}`,
      local: 'Sala a definir',
    };
    adicionarReserva(novaReserva);
    setCurso('');
    setDisciplina('');
    setHoraInicial('');
    setHoraFinal('');
    setTurno('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservar espaço</Text>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>📅 {dataReserva.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dataReserva}
          mode="date"
          display="default"
          onChange={(_event, date) => {
            setShowDatePicker(false);
            if (date) setDataReserva(date);
          }}
        />
      )}

      <Text style={styles.label}>Turno:</Text>
      <Picker
        selectedValue={turno}
        onValueChange={(itemValue) => {
          setTurno(itemValue);
          setHoraInicial('');
          setHoraFinal('');
        }}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o turno" value="" />
        <Picker.Item label="Matutino" value="Matutino" />
        <Picker.Item label="Vespertino" value="Vespertino" />
        <Picker.Item label="Noturno" value="Noturno" />
      </Picker>

      {turno !== '' && (
        <>
          <Text style={styles.label}>Hora Inicial:</Text>
          <Picker
            selectedValue={horaInicial}
            onValueChange={(itemValue) => setHoraInicial(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a hora inicial" value="" />
            {horariosPorTurno[turno].map((hora) => (
              <Picker.Item key={hora} label={hora} value={hora} />
            ))}
          </Picker>

          <Text style={styles.label}>Hora Final:</Text>
          <Picker
            selectedValue={horaFinal}
            onValueChange={(itemValue) => setHoraFinal(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a hora final" value="" />
            {horariosPorTurno[turno].map((hora) => (
              <Picker.Item key={hora} label={hora} value={hora} />
            ))}
          </Picker>
        </>
      )}

      <Text style={styles.label}>Curso:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o curso"
        value={curso}
        onChangeText={setCurso}
      />

      <Text style={styles.label}>Disciplina:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a disciplina"
        value={disciplina}
        onChangeText={setDisciplina}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdicionarReserva}>
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
    backgroundColor: '#374198',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  datePicker: {
    backgroundColor: '#C4C4C4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
  },
  label: {
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#0077ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
