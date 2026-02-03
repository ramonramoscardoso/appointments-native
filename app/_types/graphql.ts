export interface User {
  id: string;
  name: string;
}

export interface Appointments {
  id: string;
  startsAt: Date;
  endsAt: Date;
  customerId: string;
  customer?: User;
}

export interface CreateUserInput {
  name: string;
}

export interface CreateUserResponse {
  createCustomer: {
    id: string;
    name: string;
  };
}

export interface GetUserInput {
  customerId: string;
}

export interface GetUserResponse {
  customer: User;
}

export interface CreateAppointmentInput {
  customerId: string;
  endsAt: Date;
  startsAt: Date;
}

export interface CreateAppointmentResponse {
  createAppointment: {
    id: string;
  };
}

export interface GetAppointmentsInput {
  customerId: string;
}

export interface GetAppointmentsResponse {
  customerAppointments: Appointments[];
}
