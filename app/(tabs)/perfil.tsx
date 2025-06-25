import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Linking,
  Alert, // Import Alert for simple messages
} from 'react-native';
import { Ionicons, Feather, Entypo, MaterialIcons } from '@expo/vector-icons';

export default function PerfilScreen() {
  const [showMyData, setShowMyData] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showSupportHelp, setShowSupportHelp] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false); // State to control Security section visibility

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [courses, setCourses] = useState('');

  // States for App Settings
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  // States for Security (Password Change)
  const [currentPassword, setCurrentPassword] = useState(''); // New state for current password
  const [newPassword, setNewPassword] = useState(''); // New state for new password
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // New state to confirm new password

  const toggleMyData = () => setShowMyData(!showMyData);
  const toggleAbout = () => setShowAbout(!showAbout);
  const toggleMyReservations = () => setShowMyReservations(!showMyReservations);
  const toggleAppSettings = () => setShowAppSettings(!showAppSettings);
  const toggleSupportHelp = () => setShowSupportHelp(!showSupportHelp);
  const toggleSecurity = () => setShowSecurity(!showSecurity); // Toggle function for Security

  const [phone, setPhone] = useState('');

  const formatDob = (text: string) => {
    let cleanedText = text.replace(/\D/g, '');
    if (cleanedText.length > 2 && cleanedText.length <= 4) {
      cleanedText = `${cleanedText.substring(0, 2)}/${cleanedText.substring(2)}`;
    } else if (cleanedText.length > 4) {
      cleanedText = `${cleanedText.substring(0, 2)}/${cleanedText.substring(2, 4)}/${cleanedText.substring(4, 8)}`;
    }
    setDob(cleanedText);
  };

const formatPhone = (text: string) => {
  let cleanedText = text.replace(/\D/g, '');
  let formattedText = '';

  // Limita a 11 dígitos
  if (cleanedText.length > 11) {
    cleanedText = cleanedText.substring(0, 11);
  }

  if (cleanedText.length === 0) {
    formattedText = '';
  } else if (cleanedText.length < 3) {
    formattedText = `(${cleanedText}`;
  } else if (cleanedText.length < 7) {
    formattedText = `(${cleanedText.substring(0, 2)}) ${cleanedText.substring(2)}`;
  } else if (cleanedText.length < 11) {
    formattedText = `(${cleanedText.substring(0, 2)}) ${cleanedText.substring(2, 6)}-${cleanedText.substring(6)}`;
  } else {
    // 11 dígitos: (XX) 9XXXX-XXXX
    formattedText = `(${cleanedText.substring(0, 2)}) ${cleanedText.substring(2, 7)}-${cleanedText.substring(7)}`;
  }

  setPhone(formattedText);
};


  const handleSaveData = () => {
    console.log('Dados Salvos:');
    console.log('Nome Completo:', fullName);
    console.log('Data de Nascimento:', dob);
    console.log('E-mail:', email);
    console.log('Cursos:', courses);
    console.log('Telefone:', phone);
    Alert.alert('Sucesso', 'Suas informações foram salvas!');
    // In a real app, send data to your backend
  };

  // --- NOVA FUNÇÃO PARA ALTERAR SENHA ---
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos de senha.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }
    if (newPassword.length < 6) { // Example: minimum password length
        Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }
    if (newPassword === currentPassword) {
        Alert.alert('Erro', 'A nova senha não pode ser igual à senha atual.');
        return;
    }

    // In a real application, you would:
    // 1. Send currentPassword, newPassword to your backend for validation and update.
    // 2. Handle success or error responses from the backend.
    console.log('Tentando alterar senha...');
    console.log('Senha Atual:', currentPassword);
    console.log('Nova Senha:', newPassword);

    Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
    // Clear password fields after successful attempt (even if just simulated)
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const sendEmail = () => {
    Linking.openURL('mailto:suporte@unochapeco.edu.br?subject=Suporte do Aplicativo de Reservas');
  };

  const makeCall = () => {
    Linking.openURL('tel:+554912345678');
  };

  function menuItem(
    title: string,
    subtitle: string,
    iconName: 'person-outline' | 'key-outline' | 'map' | 'file-text' | 'cube' | 'calendar' | 'settings' | 'help-circle' | 'lock-closed',
    onPress?: () => void,
    isExpanded?: boolean
  ) {
    const IconSet = {
      'person-outline': <Ionicons name="person-outline" size={22} color="white" />,
      'key-outline': <Ionicons name="key-outline" size={22} color="white" />,
      'map': <Feather name="map" size={22} color="white" />,
      'file-text': <Feather name="file-text" size={22} color="white" />,
      'cube': <Entypo name="box" size={22} color="white" />,
      'calendar': <Ionicons name="calendar-outline" size={22} color="white" />,
      'settings': <Ionicons name="settings-outline" size={22} color="white" />,
      'help-circle': <Ionicons name="help-circle-outline" size={22} color="white" />,
      'lock-closed': <Ionicons name="lock-closed-outline" size={22} color="white" />,
    };

    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.icon}>{IconSet[iconName]}</View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"}
          size={24}
          color="#aaa"
        />
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://api.dicebear.com/8.x/adventurer-neutral/png?seed=User&size=128',
          }}
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>{fullName || 'Nome Completo'}</Text>
          <Text style={styles.email}>{email || 'mail@unochapeco.edu.br'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Meus Dados */}
      {menuItem(
        'Meus Dados',
        'Altere as informações do seu perfil',
        'person-outline',
        toggleMyData,
        showMyData
      )}
      {showMyData && (
        <View style={styles.myDataContent}>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Nome Completo:</Text>
            <TextInput
              style={styles.dataInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Data de Nascimento:</Text>
            <TextInput
              style={styles.dataInput}
              value={dob}
              onChangeText={formatDob}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#888"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Telefone:</Text>
            <TextInput
              style={styles.dataInput}
              placeholder="(DD) 9XXXX-XXXX"
              value={phone}
              onChangeText={formatPhone}
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>E-mail:</Text>
            <TextInput
              style={styles.dataInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Curso:</Text>
            <TextInput
              style={styles.dataInput}
              value={courses}
              onChangeText={setCourses}
              placeholder="Digite seus cursos"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Disciplina:</Text>
            <TextInput
              style={styles.dataInput}
              value={courses}
              onChangeText={setCourses}
              placeholder="Digite suas Disciplinas"
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
            <Text style={styles.saveButtonText}>Salvar Informações</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Configurações do Aplicativo */}
      {menuItem(
        'Configurações do Aplicativo',
        'Gerencie as opções do app',
        'settings',
        toggleAppSettings,
        showAppSettings
      )}
      {showAppSettings && (
        <View style={styles.myDataContent}>
          <View style={styles.settingRow}>
            <Text style={styles.dataLabel}>Receber Notificações Push:</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={receiveNotifications ? "#374198" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setReceiveNotifications}
              value={receiveNotifications}
            />
          </View>
        </View>
      )}

      {/* Suporte e Ajuda */}
      {menuItem(
        'Suporte e Ajuda',
        'Perguntas frequentes e contato',
        'help-circle',
        toggleSupportHelp,
        showSupportHelp
      )}
      {showSupportHelp && (
        <View style={styles.myDataContent}>
          <Text style={styles.sectionHeader}>FAQ (Perguntas Frequentes):</Text>
          <Text style={styles.faqQuestion}>• Como faço uma reserva?</Text>
          <Text style={styles.faqAnswer}>Navegue até a aba "Reservar", selecione o tipo de espaço, data e horário desejados. Preencha os detalhes e confirme.</Text>
          <Text style={styles.faqQuestion}>• Como cancelo uma reserva?</Text>
          <Text style={styles.faqAnswer}>Vá em "Minhas Reservas", localize a reserva e clique na opção "Cancelar". Confirme o cancelamento.</Text>
          <Text style={styles.faqQuestion}>• Quais tipos de espaços posso reservar?</Text>
          <Text style={styles.faqAnswer}>Você pode reservar salas de aula, laboratórios, auditórios e o plenário.</Text>

          <Text style={[styles.sectionHeader, { marginTop: 15 }]}>Contato com o Apoio Operacional:</Text>
          <Text style={styles.infoText}>Se precisar de ajuda, entre em contato:</Text>
          <TouchableOpacity onPress={sendEmail}>
            <Text style={styles.contactLink}>E-mail: apoio@unochapeco.edu.br</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={makeCall}>
            <Text style={styles.contactLink}>Telefone: (49) 98404-2591</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionHeader, { marginTop: 15 }]}>Contato com o Suporte de TI:</Text>
          <Text style={styles.infoText}>Se precisar de ajuda, entre em contato:</Text>
          <TouchableOpacity onPress={sendEmail}>
            <Text style={styles.contactLink}>E-mail: suporte@unochapeco.edu.br</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={makeCall}>
            <Text style={styles.contactLink}>Telefone: (49) 3321-8300</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- SEGURANÇA --- */}
      {menuItem(
        'Segurança',
        'Altere sua senha de acesso',
        'lock-closed',
        toggleSecurity,
        showSecurity
      )}
      {showSecurity && (
        <View style={styles.myDataContent}>
          <Text style={styles.infoText}>Para sua segurança, digite sua senha atual e a nova senha desejada.</Text>
          
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Senha Atual:</Text>
            <TextInput
              style={styles.dataInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="********"
              placeholderTextColor="#888"
              secureTextEntry // Hide input characters
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Nova Senha:</Text>
            <TextInput
              style={styles.dataInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="********"
              placeholderTextColor="#888"
              secureTextEntry // Hide input characters
            />
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Confirmar Nova Senha:</Text>
            <TextInput
              style={styles.dataInput}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="********"
              placeholderTextColor="#888"
              secureTextEntry // Hide input characters
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
            <Text style={styles.saveButtonText}>Alterar Senha</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sobre o App */}
      {menuItem('Sobre o App', 'Informações sobre a versão do aplicativo', 'cube',
        toggleAbout,
        showAbout
      )}
      {showAbout && (
        <View style={styles.myDataContent}>
          <View style={styles.dataRow}>
            <Text style={styles.aboutAppDescription}>
            O aplicativo tem como objetivo auxiliar os colaboradores da UnoChapecó na gestão de suas reservas de espaços da universidade.
            A criação desse aplicativo foi motivada pela necessidade de um sistema mais eficiente e acessível para a reserva de espaços, visando otimizar o uso dos recursos disponíveis e melhorar a experiência dos usuários.
            O aplicativo foi desenvolvido no curso de Sistemas de Informação da Unochapecó, como trabalho final da Disciplina Desenvolvimento Mobile.
          </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#24284d',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: '#374198',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: '#ccc',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  icon: {
    width: 32,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 13,
  },
  myDataContent: {
    backgroundColor: '#222',
    padding: 16,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dataLabel: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 0.8,
  },
  dataInput: {
    color: '#fff',
    fontSize: 14,
    flex: 2.2,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingVertical: 2,
  },
  saveButton: {
    backgroundColor: '#374198',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutAppDescription: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  faqQuestion: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  faqAnswer: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 10,
  },
  contactLink: {
    color: '#81b0ff',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  reservationItem: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reservationTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  reservationDetails: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 5,
  },
  smallButton: {
    backgroundColor: '#555',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
    marginRight: 5,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});
