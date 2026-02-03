import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { CreateUserInput, CreateUserResponse } from "../_types/graphql";

const userFormSchema = z.object({
  name: z.string().min(1, "Nome deve ter no mínimo 1 letra"),
});

type FormData = z.infer<typeof userFormSchema>;

export default function UserForm() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const CREATE_USER = gql`
    mutation CreateCustomer($data: CreateCustomerInput!) {
      createCustomer(data: $data) {
        id
        name
      }
    }
  `;

  const [createUser, { loading, error }] = useMutation<
    CreateUserResponse,
    { data: CreateUserInput }
  >(CREATE_USER, {
    onCompleted: (data) => {
      console.log("user criado:", data.createCustomer.id);
      router.push({
        pathname: "/(scheduling)/schedule",
        params: {
          customerId: data.createCustomer.id,
          name: data.createCustomer.name,
        },
      });
    },
    onError: (error) => {
      console.error("Erro ao criar usuário:", error);
      Alert.alert(
        "Erro",
        "Não foi possível criar o usuário. Tente novamente.",
        [{ text: "OK" }],
      );
    },
  });

  const handleFormSubmit = (data: FormData) => {
    createUser({
      variables: {
        data: {
          name: data.name,
        },
      },
    });

    reset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputForm}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Digite seu nome"
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
          <Text>
            <MaterialIcons name="login" size={18} />
          </Text>
        </TouchableOpacity>
      </View>

      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}
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
