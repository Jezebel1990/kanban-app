import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/components/app/utils/firebaseConfig";


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
            return { error: { message: "User not authenticated" } };
          }

          const { user } = session;
          const ref = collection(db, `users/${user.email}/tasks`);
          const querySnapshot = await getDocs(ref);
          const boards = querySnapshot.docs.map((doc) => doc.data());

          return { data: boards };
        } catch (e: any) {
          return { error: e.message || "Failed to fetch data" };
        }
      },
      providesTags: ["Tasks"],
    }),
    updateBoardToDb: builder.mutation({
      async queryFn(boardData) {
        try {
          const session = await getSession();
          if (!session?.user) {
            return { error: { message: "User not authenticated" } };
          }

          const { user } = session;
          const ref = collection(db, `users/${user.email}/tasks`);
          const querySnapshot = await getDocs(ref);
          const boardId = querySnapshot.docs[0]?.id;

          if (!boardId) {
            return { error: { message: "No board ID found" } };
          }

          await updateDoc(doc(db, `users/${user.email}/tasks/${boardId}`), {
            boards: boardData,
          });

          return { data: null };
        } catch (e: any) {
          return { error: e.message || "Failed to update board" };
        }
      },
      invalidatesTags: ["Tasks"],
    }),
  }),
});

// Export hooks for using the created endpoint
export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } =
  fireStoreApi;
