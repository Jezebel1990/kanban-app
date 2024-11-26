import BoardTasks from "./components/BoardTasks/BoardTasks";
import Sidebar from "./components/Sidebar/Sidebar";

export default function Home() {
  return (
   <main className="flex h-full">
    <Sidebar />
    <BoardTasks />
   </main>
  );
}      