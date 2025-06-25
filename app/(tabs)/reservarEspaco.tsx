import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Platform, View as RNView, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReserva } from '../../context/ReservaContext';

export default function TabTwoScreen() {
  const { adicionarReserva, reservas } = useReserva();

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

  const [repetirSemanal, setRepetirSemanal] = useState('');
  const [showRepetirPicker, setShowRepetirPicker] = useState(false);
  const [tempRepetir, setTempRepetir] = useState('');

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

  function getDatasRepetidas(dataInicial: Date) {
    const ano = dataInicial.getFullYear();
    const primeiroSemestreInicio = new Date(ano, 1, 1); // 01/02
    const primeiroSemestreFim = new Date(ano, 5, 30);   // 30/06
    const segundoSemestreInicio = new Date(ano, 6, 14); // 14/07
    const segundoSemestreFim = new Date(ano, 11, 17);   // 17/12

    let dataFim: Date;
    if (dataInicial >= primeiroSemestreInicio && dataInicial <= primeiroSemestreFim) {
      dataFim = primeiroSemestreFim;
    } else if (dataInicial >= segundoSemestreInicio && dataInicial <= segundoSemestreFim) {
      dataFim = segundoSemestreFim;
    } else {
      return [dataInicial];
    }

    const datas: Date[] = [];
    let data = new Date(dataInicial);
    while (data <= dataFim) {
      datas.push(new Date(data));
      data.setDate(data.getDate() + 7);
    }
    return datas;
  }

  const handleAdicionarReserva = () => {
    if (!disciplina || !curso || !turno || !horaInicial || !horaFinal || !tipoLocal || !local) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    const dataFormatada = dataReserva.toLocaleDateString();
    const localFormatado = `${local} (${tipoLocal})`;

    const reservasMesmoLocalData = reservas.filter(
      (r) =>
        r.local === localFormatado &&
        r.horario.endsWith(`(${dataFormatada})`)
    );

    const conflito = reservasMesmoLocalData.find((r) => {
      const match = r.horario.match(/^(\d{2}:\d{2}) - (\d{2}:\d{2})/);
      if (!match) return false;
      const [_, ini, fim] = match;
      return horariosSobrepostos(horaInicial, horaFinal, ini, fim);
    });

    if (conflito) {
      const match = conflito.horario.match(/^(\d{2}:\d{2}) - (\d{2}:\d{2})/);
      const horarioOcupado = match ? `${match[1]} às ${match[2]}` : 'horário já reservado';
      setErro(`Este espaço já possui reserva das ${horarioOcupado} nesta data. Escolha outro horário.`);
      return;
    }

    setErro('');

    const datasParaReservar = repetirSemanal === 'Sim' ? getDatasRepetidas(dataReserva) : [dataReserva];

    let reservasCriadas = 0;
    let reservasConflito = 0;

    datasParaReservar.forEach((data) => {
      const dataFormatada = data.toLocaleDateString();
      const localFormatado = `${local} (${tipoLocal})`;
      const horarioFormatado = `${horaInicial} - ${horaFinal} (${dataFormatada})`;

      const reservasMesmoLocalData = reservas.filter(
        (r) =>
          r.local === localFormatado &&
          r.horario.endsWith(`(${dataFormatada})`)
      );
      const conflito = reservasMesmoLocalData.find((r) => {
        const match = r.horario.match(/^(\d{2}:\d{2}) - (\d{2}:\d{2})/);
        if (!match) return false;
        const [_, ini, fim] = match;
        return horariosSobrepostos(horaInicial, horaFinal, ini, fim);
      });

      if (!conflito) {
        const novaReserva = {
          id: String(Date.now()) + Math.random() + dataFormatada, 
          disciplina,
          curso,
          horario: horarioFormatado,
          local: localFormatado,
          observacoes,
          professor: '',
        };
        adicionarReserva(novaReserva);
        reservasCriadas++;
      } else {
        reservasConflito++;
      }
    });

    if (reservasCriadas > 0) {
      setErro('');
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
      setRepetirSemanal('');
    }
    if (reservasConflito > 0) {
      setErro(`Algumas datas não foram reservadas por conflito de horário.`);
    }
  };

  // Handler para DateTimePicker cross-platform
  const onChangeDate = (_event: any, selectedDate?: Date) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmarData = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (tempDate < hoje) {
      setErro('Não é possível selecionar uma data anterior à data atual.');
      setShowDatePicker(false);
      return;
    }
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

  function horariosSobrepostos(horaIni1: string, horaFim1: string, horaIni2: string, horaFim2: string) {

    const toMin = (h: string) => {
      const [hh, mm] = h.split(':').map(Number);
      return hh * 60 + mm;
    };
    const ini1 = toMin(horaIni1);
    const fim1 = toMin(horaFim1);
    const ini2 = toMin(horaIni2);
    const fim2 = toMin(horaFim2);

    return ini1 < fim2 && ini2 < fim1;
  }

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

      {/* Repetir semanalmente */}
      <Text style={styles.label}>Repetir semanalmente?</Text>
      <TouchableOpacity
        onPress={() => { setShowRepetirPicker(true); setTempRepetir(repetirSemanal); }}
        style={styles.datePicker}
      >
        <Text style={styles.dateText}>
          {repetirSemanal ? repetirSemanal : 'Selecione se deseja repetir'}
        </Text>
      </TouchableOpacity>
      {showRepetirPicker && (
        <RNView style={styles.datePickerModal}>
          <Picker
            selectedValue={tempRepetir}
            onValueChange={(itemValue) => setTempRepetir(itemValue)}
            style={styles.picker}
            dropdownIconColor="#374198"
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Sim" value="Sim" />
            <Picker.Item label="Não" value="Não" />
          </Picker>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              setRepetirSemanal(tempRepetir);
              setShowRepetirPicker(false);
            }}
            disabled={!tempRepetir}
          >
            <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: '#24284d',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  datePicker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerModal: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 4,
  },
  picker: {
    width: '100%',
    color: '#374198',
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#374198',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#374198',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 6,
    marginTop: 24,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
