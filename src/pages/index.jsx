import Welcome from "../components/Welcome";
import Dashboard from "../components/Dashboard";

export default function Home({ name, router }) {
  return name ? <Dashboard router={router} /> : <Welcome />;
}
