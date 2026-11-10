import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {AuthResponse} from '../../screens/auth/types';

// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// RTK Query base API
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Chofer', 'Viaje', 'Reserva'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, {email: string; password: string}>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Users endpoints
    getCurrentUser: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // Choferes endpoints
    getChoferes: builder.query({
      query: () => '/choferes',
      providesTags: ['Chofer'],
    }),

    // Viajes endpoints
    getViajesDisponibles: builder.query({
      query: ({origen, destino}) => ({
        url: `/viajes/disponibles?origen=${origen}&destino=${destino}`,
      }),
      providesTags: ['Viaje'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCurrentUserQuery,
  useGetChoferesQuery,
  useGetViajesDisponiblesQuery,
} = apiSlice;
