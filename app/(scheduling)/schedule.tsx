import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod/v3";
import {
  CreateAppointmentInput,
  CreateAppointmentResponse,
  GetUserInput,
  GetUserResponse,
} from "../_types/graphql";

const schema = z
  .object({
    customerId: z.string().min(1, "ID do cliente é obrigatório"),
    startsAt: z.date({
      required_error: "Data de início é obrigatória",
      invalid_type_error: "Data inválida",
    }),
    endsAt: z.date({
      required_error: "Data de término é obrigatória",
      invalid_type_error: "Data inválida",
    }),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "Data de término deve ser posterior à data de início",
    path: ["endsAt"],
  });

type FormData = z.infer<typeof schema>;

export default function ScheduleForm() {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { customerId } = useLocalSearchParams<{
    customerId: string;
  }>();

  if (!customerId) return null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId,
      startsAt: undefined,
      endsAt: undefined,
    },
  });

  const values = watch();

  const formatDateTime = (date?: Date) => {
    if (!date) return "Selecione";
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const GET_USER = gql`
    query Customer($customerId: String!) {
      customer(id: $customerId) {
        id
        name
      }
    }
  `;

  const { data, loading, error } = useQuery<GetUserResponse, GetUserInput>(
    GET_USER,
    {
      variables: { customerId },
    },
  );

  const CREATE_APPOINTMENT = gql`
    mutation CreateAppointment($data: CreateAppointmentInput!) {
      createAppointment(data: $data) {
        id
      }
    }
  `;

  const GET_CUSTOMER_APPOINTMENTS = gql`
    query CustomerAppointments($customerId: String!) {
      customerAppointments(customerId: $customerId) {
        id
        startsAt
        endsAt
      }
    }
  `;

  const [createAppoitment] = useMutation<
    CreateAppointmentResponse,
    { data: CreateAppointmentInput }
  >(CREATE_APPOINTMENT, {
    onCompleted: (data) => {
      console.log("appointment criado:", data.createAppointment.id);
      router.push({
        pathname: "/(scheduling)/my-schedules",
        params: {
          customerId,
        },
      });
    },
    onError: (error) => {
      console.error("Erro ao criar appointment:", error);
      Alert.alert(
        "Erro",
        "Não foi possível criar o agendamento. Tente novamente.",
        [{ text: "OK" }],
      );
    },
    refetchQueries: [
      {
        query: GET_CUSTOMER_APPOINTMENTS,
        variables: { customerId },
      },
    ],
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  if (error || !data?.customer) {
    Alert.alert(
      "Erro",
      "Não foi possível encontrar o usuário. Tente novamente.",
      [{ text: "OK" }],
    );

    router.push({
      pathname: "/",
    });

    return null;
  }

  const copyToClipboard = async (text?: string) => {
    if (!text) return;

    await Clipboard.setStringAsync(text);
    Alert.alert("Copiado!", "Texto copiado para a área de transferência");
  };

  const handleFormSubmit = (data: FormData) => {
    createAppoitment({
      variables: {
        data: {
          customerId: data?.customerId,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
        },
      },
    });

    reset();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{`Olá, ${data?.customer.name}!`}</Text>
        <View style={styles.idView}>
          <Text>Seu id:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text>{data?.customer.id}</Text>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(data?.customer.id);
              }}
            >
              <Ionicons name="copy-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>
          {`Vamos continuar seu agendamento...`}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Data e Hora de Início</Text>
          <Controller
            control={control}
            name="startsAt"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    errors.startsAt && styles.dateButtonError,
                  ]}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDateTime(value)}
                  </Text>
                </TouchableOpacity>

                {showStartPicker && (
                  <>
                    <DateTimePicker
                      value={value || new Date()}
                      mode="datetime"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      textColor="black"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                      minimumDate={new Date()}
                      locale="pt-BR"
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setShowStartPicker(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Ok</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          />
          {errors.startsAt && (
            <Text style={styles.errorText}>{errors.startsAt.message}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Data e Hora de Término</Text>
          <Controller
            control={control}
            name="endsAt"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    errors.endsAt && styles.dateButtonError,
                  ]}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDateTime(value)}
                  </Text>
                </TouchableOpacity>

                {showEndPicker && (
                  <>
                    <DateTimePicker
                      value={value || new Date()}
                      mode="datetime"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      textColor="black"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                      minimumDate={new Date()}
                      locale="pt-BR"
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setShowEndPicker(false);
                      }}
                    >
                      <Text style={styles.buttonText}>Ok</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          />
          {errors.endsAt && (
            <Text style={styles.errorText}>{errors.endsAt.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!values.startsAt || !values.endsAt) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={!values.startsAt || !values.endsAt}
        >
          <Text style={styles.buttonText}>Confirmar Agendamento</Text>
          <MaterialIcons
            name="check-circle-outline"
            size={20}
            color={"white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mySchedulesView}>
        <TouchableOpacity
          style={styles.mySchedulesButton}
          onPress={() => {
            router.push({
              pathname: "/(scheduling)/my-schedules",
              params: {
                customerId,
              },
            });
          }}
        >
          <Text>Meus agendamentos</Text>
          <MaterialIcons name="calendar-month" size={12} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: 30,
  },
  idView: {
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    gap: 5,
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "500",
    fontSize: 20,
    textAlign: "center",
  },
  formContainer: {
    gap: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fff",
  },
  dateButtonError: {
    borderColor: "#ff0000",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mySchedulesView: {
    alignItems: "center",
  },
  mySchedulesButton: {
    borderBottomWidth: 1,
    opacity: 0.8,
    flexDirection: "row",
    gap: 4,
  },
});
