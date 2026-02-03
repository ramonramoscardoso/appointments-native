import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const userIdFormSchema = z.object({
  id: z.uuid("ID inválido"),
});

type FormData = z.infer<typeof userIdFormSchema>;

export default function UserIdForm() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userIdFormSchema),
    defaultValues: {
      id: "",
    },
  });

  const handleFormSubmit = (data: FormData) => {
    router.push({
      pathname: "/(scheduling)/schedule",
      params: {
        customerId: data.id,
      },
    });

    reset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputForm}>
        <Controller
          control={control}
          name="id"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Digite seu id"
              placeholderTextColor="black"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleFormSubmit)}
        >
          <MaterialIcons name="login" size={18} />
        </TouchableOpacity>
      </View>

      {errors.id && <Text style={styles.errorText}>{errors.id.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  inputForm: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 20,
    fontSize: 16,
    flex: 1,
  },
  button: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "hsl(0, 0%, 80%)",
    borderRadius: 8,
    padding: 20,
    minWidth: 60,
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    color: "hsl(0, 100%, 28%)",
  },
});
