"use client";

import BoardTasks from "./components/BoardTasks/BoardTasks";
import Sidebar from "./components/Sidebar/Sidebar";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./utils/firebaseConfig";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { data } from "./utils/data";

export default function Home() {

  const [userDetails, setUserDetails] = useState<{ [key: string]: any }>();

  const getUserSession = async () => {
    const session = await getSession();
    if (session) {
      setUserDetails(session.user);
    }
  };

  const handleAddDoc = async () => {
    if (userDetails) {
      // Execute code inside curly braces only when `userDetails` is true.

      // Reference to the document with the user's email to check its existence in the database.
      const docRef = collection(db, "users", userDetails.email, "tasks");
      const getDos = await getDocs(docRef);

      // If the document exists, terminate the program.
      if (getDos.docs.length > 0) {
   ;     return;
      } else {
        // If not, submit a new document containing the data from data.json for the user in the database.
        try {
          await addDoc(
            collection(db, "users", userDetails.email, "tasks"),
            data
          );
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    }
  };

  useEffect(() => {
    getUserSession(); // Call getUserSession function after the page renders.
  }, []);

  useEffect(() => {
    handleAddDoc(); // Call handleAddDoc function after the user details update.
  }, [userDetails]);

  return (
   <main className="flex h-full">
    <Sidebar />
    <BoardTasks />
   </main>
  );
}      