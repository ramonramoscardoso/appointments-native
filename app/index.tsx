import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import UserForm from "./_components/user-form";
import UserIdForm from "./_components/user-id-form";

export default function Index() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <Text style={styles.title}>Bem-vindo(a)!</Text>
      <Text style={styles.subtitle}>
        Organize seus agendamentos de forma rápida e fácil.
      </Text>
      <UserForm />

      <View style={styles.existingUserView}>
        <Text style={{ fontSize: 15 }}>
          Já possui cadastro? Digite seu id abaixo
        </Text>
        <UserIdForm />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  existingUserView: {
    gap: 10,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
  },
});
