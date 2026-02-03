import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GetAppointmentsInput,
  GetAppointmentsResponse,
  GetUserInput,
  GetUserResponse,
} from "../_types/graphql";

export default function ScheduleForm() {
  const { customerId } = useLocalSearchParams<{
    customerId: string;
  }>();

  if (!customerId) return null;

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

  const GET_CUSTOMER_APPOINTMENTS = gql`
    query CustomerAppointments($customerId: String!) {
      customerAppointments(customerId: $customerId) {
        id
        startsAt
        endsAt
      }
    }
  `;

  const { data: appointmentsData, loading: isLoadingAppointments } = useQuery<
    GetAppointmentsResponse,
    GetAppointmentsInput
  >(GET_CUSTOMER_APPOINTMENTS, {
    variables: { customerId },
  });

  if (loading || isLoadingAppointments) {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text
          style={styles.title}
        >{`Agendamentos de ${data.customer.name}`}</Text>

        <AppointmentsSection data={appointmentsData} />
      </View>
    </SafeAreaView>
  );
}

function AppointmentsSection({ data }: { data?: GetAppointmentsResponse }) {
  console.log(JSON.stringify(data));
  if (data?.customerAppointments && data?.customerAppointments.length > 0) {
    return (
      <FlatList
        data={data.customerAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item: appointment }) => (
          <View style={styles.appointmentCard}>
            <View>
              <Text>Id de agendamento:</Text>
              <Text>{appointment.id}</Text>
            </View>

            <View>
              <Text>Início:</Text>
              <Text>
                {format(appointment.startsAt, "EEEE, d 'de' MMMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </Text>
            </View>

            <View>
              <Text>Fim:</Text>
              <Text>
                {format(appointment.endsAt, "EEEE, d 'de' MMMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    );
  }

  return (
    <View>
      <Text style={{ textAlign: "center" }}>Nenhum agendamento encontrado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 150,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
    textAlign: "center",
  },
  appointmentCard: {
    borderWidth: 1,
    borderColor: "#9b9b9b",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    gap: 10,
  },
  listContent: {
    paddingTop: 20,
  },
});
