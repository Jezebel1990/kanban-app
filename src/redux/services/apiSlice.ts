
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/components/app/utils/firebaseConfig";

// Create the Firestore API using createApi
export const fireStoreApi = createApi({
  reducerPath: "firestoreApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    fetchDataFromDb: builder.query<{ [key: string]: any }[], void>({
      async queryFn() {
        try {
          const session = await getSession();
          if (!session?.user) {
            return { error: "Usuário não autenticado." };
          }

          const { user } = session;
          const ref = collection(db, `users/${user.email}/tasks`);
          const querySnapshot = await getDocs(ref);

          const boards = querySnapshot.docs.map((doc) => doc.data());
          return { data: boards };
        } catch (error: any) {
          return { error: error.message || "Erro ao buscar dados do Firestore." };
        }
      },
      providesTags: ["Tasks"],
    }),
    updateBoardToDb: builder.mutation<void, any>({
      async queryFn(arg) {
        try {
          const session = await getSession();
          if (!session?.user) {
            return { error: "Usuário não autenticado." };
          }

          const { user } = session;
          const ref = collection(db, `users/${user.email}/tasks`);
          const querySnapshot = await getDocs(ref);

          // Identifique o ID do documento que precisa ser atualizado
          const boardDoc = querySnapshot.docs[0]; 
          if (!boardDoc) {
            return { error: "Nenhum documento encontrado para atualizar." };
          }

          // Atualiza o documento com os dados fornecidos
          await updateDoc(doc(db, `users/${user.email}/tasks/${boardDoc.id}`), {
            boards: arg,
          });

         
          return { data: undefined };
        } catch (error: any) {
          return { error: error.message || "Erro ao atualizar o Firestore." };
        }
      },
      invalidatesTags: ["Tasks"], 
    }),
  }),
});

// Export hooks for using the created endpoint
export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } = fireStoreApi;
