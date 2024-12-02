   import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
   import { getSession } from "next-auth/react";
   import { collection,doc, getDocs, updateDoc } from "firebase/firestore";
   import  { db } from "@/components/app/utils/firebaseConfig";

   //Create the Firestore API using createApi
export const fireStoreApi = createApi({
   reducerPath: "firestoreApi",
   baseQuery: fakeBaseQuery(),
   tagTypes: ["Tasks"],
   endpoints: (builder) => ({
    fetchDataFromDb: builder.query<{[key: string]: any}[], void>({
        async queryFn() {
            try {
                const session = await getSession();
                const { user } = session!;
                  const ref = collection(db, `users/${user?.email}/tasks`);
                  const querySnapshot = await getDocs(ref);
                  const boards = querySnapshot.docs.map((doc) => {
                  return doc.data()});
              return { data: boards };
              } catch (e: any) {
                return { error: e.message };
              }
            },
            providesTags: ["Tasks"],
    }),
     // endpoint for CRUD actions
     updateBoardToDb: builder.mutation({
        async queryFn(arg) {
          try {
            const session = await getSession();
            if (session?.user) {
              const { user } = session;
              const ref = collection(db, `users/${user.email}/tasks`);
              const querySnapshot = await getDocs(ref);
              const boardId = querySnapshot.docs.map((doc) => {
                return doc.id;
              });
              await updateDoc(doc(db, `users/${user.email}/tasks/${boardId}`), {
                boards: arg,
              });
            }
            return Promise.resolve({ data: null });
          } catch (e) {
            return Promise.reject({ error: e });
          }
        },
        invalidatesTags: ["Tasks"],
   }),
}),
});

   export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } = fireStoreApi;