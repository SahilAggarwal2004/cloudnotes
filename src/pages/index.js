import Welcome from "../components/Welcome";
import Dashboard from "../components/Dashboard";

export default function Home({ name }) {
  return name ? <Dashboard /> : <Welcome />;
}
