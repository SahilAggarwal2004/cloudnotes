import Welcome from "../components/Welcome";
import Dashboard from "../components/notes/Dashboard";

export default function Home({ user }) {
  return user ? <Dashboard /> : <Welcome />;
}
