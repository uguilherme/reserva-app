import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Platform, View as RNView, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReserva } from '../../context/ReservaContext';

export default function TabTwoScreen() {
  const { adicionarReserva } = useReserva();

  const [dataReserva, setDataReserva] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const [turno, setTurno] = useState('');
  const [showTurnoPicker, setShowTurnoPicker] = useState(false);
  const [tempTurno, setTempTurno] = useState('');

  const [horaInicial, setHoraInicial] = useState('');
  const [showHoraInicialPicker, setShowHoraInicialPicker] = useState(false);
  const [tempHoraInicial, setTempHoraInicial] = useState('');

  const [horaFinal, setHoraFinal] = useState('');
  const [showHoraFinalPicker, setShowHoraFinalPicker] = useState(false);
  const [tempHoraFinal, setTempHoraFinal] = useState('');

  const [curso, setCurso] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [erro, setErro] = useState('');

  const [tipoLocal, setTipoLocal] = useState('');
  const [local, setLocal] = useState('');
  const [showLocalPicker, setShowLocalPicker] = useState(false);
  const [tempLocal, setTempLocal] = useState('');

  const [observacoes, setObservacoes] = useState('');

  const [showTipoLocalPicker, setShowTipoLocalPicker] = useState(false);
  const [tempTipoLocal, setTempTipoLocal] = useState('');

  const horariosPorTurno: { [key: string]: string[] } = {
    Matutino: ['07:30', '08:30', '09:30', '10:30', '11:30'],
    Vespertino: ['13:00', '14:00', '15:00', '16:00', '17:00'],
    Noturno: ['19:00', '20:00', '21:00', '22:00'],
  };

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

  const handleAdicionarReserva = () => {
    if (!disciplina || !curso || !turno || !horaInicial || !horaFinal || !tipoLocal || !local) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setErro('');
    const novaReserva = {
      id: String(Date.now()),
      disciplina,
      curso,
      horario: `${horaInicial} - ${horaFinal} (${dataReserva.toLocaleDateString()})`,
      local: `${local} (${tipoLocal})`,
      observacoes,
      professor: '', // Adicione um valor padrão ou obtenha do formulário se necessário
    };
    adicionarReserva(novaReserva);
    setCurso('');
    setDisciplina('');
    setHoraInicial('');
    setHoraFinal('');
    setTurno('');
    setTempTurno('');
    setDataReserva(new Date());
    setTipoLocal('');
    setLocal('');
    setTempLocal('');
    setObservacoes('');
  };

  // Handler para DateTimePicker cross-platform
  const onChangeDate = (_event: any, selectedDate?: Date) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmarData = () => {
    setDataReserva(tempDate);
    setShowDatePicker(false);
  };

  const confirmarTurno = () => {
    setTurno(tempTurno);
    setHoraInicial('');
    setHoraFinal('');
    setShowTurnoPicker(false);
  };

  const confirmarHoraInicial = () => {
    setHoraInicial(tempHoraInicial);
    setShowHoraInicialPicker(false);
    setHoraFinal('');
    setTempHoraFinal('');
  };

  const confirmarHoraFinal = () => {
    setHoraFinal(tempHoraFinal);
    setShowHoraFinalPicker(false);
  };

  const confirmarLocal = () => {
    setLocal(tempLocal);
    setShowLocalPicker(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Reservar espaço</Text>

      {erro ? <Text style={{ color: 'red', marginBottom: 10 }}>{erro}</Text> : null}

      {/* Data */}
      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity onPress={() => { setTempDate(dataReserva); setShowDatePicker(true); }} style={styles.datePicker}>
        <Text style={styles.dateText}>{dataReserva.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <RNView style={styles.datePickerModal}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={confirmarData}>
            <Text style={styles.confirmButtonText}>Confirmar Data</Text>
          </TouchableOpacity>
        </RNView>
      )}

      {/* Tipo de Local */}
      <Text style={styles.label}>Escolher o local:</Text>
      <TouchableOpacity
        onPress={() => { setShowTipoLocalPicker(true); setTempTipoLocal(tipoLocal); }}
        style={styles.datePicker}
      >
        <Text style={styles.dateText}>
          {tipoLocal ? tipoLocal : 'Selecione o tipo de local'}
        </Text>
      </TouchableOpacity>
      {showTipoLocalPicker && (
        <RNView style={styles.datePickerModal}>
          <Picker
            selectedValue={tempTipoLocal}
            onValueChange={(itemValue) => setTempTipoLocal(itemValue)}
            style={styles.picker}
            dropdownIconColor="#374198"
          >
            <Picker.Item label="Selecione o tipo de local" value="" />
            <Picker.Item label="Laboratório de Habilidades" value="Laboratório de Habilidades" />
            <Picker.Item label="Sala de Aula" value="Sala de Aula" />
            <Picker.Item label="Laboratório de Informatica" value="Laboratório de Informatica" />
            <Picker.Item label="Auditórios/Auditórios e Plenário" value="Auditórios/Auditórios e Plenário" />
          </Picker>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              setTipoLocal(tempTipoLocal);
              setLocal('');
              setTempLocal('');
              setShowTipoLocalPicker(false);
            }}
            disabled={!tempTipoLocal}
          >
            <Text style={styles.confirmButtonText}>Confirmar Tipo de Local</Text>
          </TouchableOpacity>
        </RNView>
      )}

      {/* Local específico */}
      {tipoLocal !== '' && (
        <>
          <Text style={styles.label}>Local:</Text>
          <TouchableOpacity
            onPress={() => { setTempLocal(local); setShowLocalPicker(true); }}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              {local ? local : 'Selecione o local'}
            </Text>
          </TouchableOpacity>
          {showLocalPicker && (
            <RNView style={styles.datePickerModal}>
              <Picker
                selectedValue={tempLocal}
                onValueChange={(itemValue) => setTempLocal(itemValue)}
                style={styles.picker}
                dropdownIconColor="#374198"
              >
                <Picker.Item label="Selecione o local" value="" />
                {locaisPorTipo[tipoLocal]?.map((nome) => (
                  <Picker.Item key={nome} label={nome} value={nome} />
                ))}
              </Picker>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmarLocal} disabled={!tempLocal}>
                <Text style={styles.confirmButtonText}>Confirmar Local</Text>
              </TouchableOpacity>
            </RNView>
          )}
        </>
      )}

      {/* Turno */}
      <Text style={styles.label}>Turno:</Text>
      <TouchableOpacity
        onPress={() => { setTempTurno(turno); setShowTurnoPicker(true); }}
        style={styles.datePicker}
      >
        <Text style={styles.dateText}>
          {turno ? turno : 'Selecione o turno'}
        </Text>
      </TouchableOpacity>
      {showTurnoPicker && (
        <RNView style={styles.datePickerModal}>
          <Picker
            selectedValue={tempTurno}
            onValueChange={(itemValue) => setTempTurno(itemValue)}
            style={styles.picker}
            dropdownIconColor="#374198"
          >
            <Picker.Item label="Selecione o turno" value="" />
            <Picker.Item label="Matutino" value="Matutino" />
            <Picker.Item label="Vespertino" value="Vespertino" />
            <Picker.Item label="Noturno" value="Noturno" />
          </Picker>
          <TouchableOpacity style={styles.confirmButton} onPress={confirmarTurno}>
            <Text style={styles.confirmButtonText}>Confirmar Turno</Text>
          </TouchableOpacity>
        </RNView>
      )}

      {/* Hora Inicial */}
      {turno !== '' && (
        <>
          <Text style={styles.label}>Hora Inicial:</Text>
          <TouchableOpacity
            onPress={() => { setTempHoraInicial(horaInicial); setShowHoraInicialPicker(true); }}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              {horaInicial ? horaInicial : 'Selecione a hora inicial'}
            </Text>
          </TouchableOpacity>
          {showHoraInicialPicker && (
            <RNView style={styles.datePickerModal}>
              <Picker
                selectedValue={tempHoraInicial}
                onValueChange={(itemValue) => setTempHoraInicial(itemValue)}
                style={styles.picker}
                dropdownIconColor="#374198"
              >
                <Picker.Item label="Selecione a hora inicial" value="" />
                {horariosPorTurno[turno].map((hora) => (
                  <Picker.Item key={hora} label={hora} value={hora} />
                ))}
              </Picker>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmarHoraInicial}>
                <Text style={styles.confirmButtonText}>Confirmar Hora Inicial</Text>
              </TouchableOpacity>
            </RNView>
          )}

          {/* Hora Final */}
          <Text style={styles.label}>Hora Final:</Text>
          <TouchableOpacity
            onPress={() => { setTempHoraFinal(horaFinal); setShowHoraFinalPicker(true); }}
            style={styles.datePicker}
            disabled={!horaInicial}
          >
            <Text style={[styles.dateText, !horaInicial && { color: '#aaa' }]}>
              {horaFinal ? horaFinal : 'Selecione a hora final'}
            </Text>
          </TouchableOpacity>
          {showHoraFinalPicker && (
            <RNView style={styles.datePickerModal}>
              <Picker
                selectedValue={tempHoraFinal}
                onValueChange={(itemValue) => setTempHoraFinal(itemValue)}
                style={styles.picker}
                dropdownIconColor="#374198"
              >
                <Picker.Item label="Selecione a hora final" value="" />
                {horariosPorTurno[turno]
                  .filter((hora) => !horaInicial || horariosPorTurno[turno].indexOf(hora) > horariosPorTurno[turno].indexOf(horaInicial))
                  .map((hora) => (
                    <Picker.Item key={hora} label={hora} value={hora} />
                  ))}
              </Picker>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmarHoraFinal}>
                <Text style={styles.confirmButtonText}>Confirmar Hora Final</Text>
              </TouchableOpacity>
            </RNView>
          )}
        </>
      )}

      {/* Curso */}
      <Text style={styles.label}>Curso:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o curso"
        value={curso}
        onChangeText={setCurso}
      />

      {/* Disciplina */}
      <Text style={styles.label}>Disciplina:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a disciplina"
        value={disciplina}
        onChangeText={setDisciplina}
      />

      {/* Observações */}
      <Text style={styles.label}>Observações:</Text>
      <TextInput
        style={[styles.input, { minHeight: 60 }]}
        placeholder="Digite observações (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdicionarReserva}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Reserva</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  datePickerModal: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#0077ff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  pickerWrapper: {
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    minHeight: 48,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: '#374198',
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
