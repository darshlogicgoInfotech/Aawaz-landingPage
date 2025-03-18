import Link from "next/link";
import incidents from "../data/incidents";

export default function Home() {
  return (
    <div>
      <h1>Incident Reports</h1>
      <ul>
        {incidents.map((incident) => (
          <li key={incident.id}>
            <button onClick={() => window.location.href = `/${incident.id}`}>
                {incident.title}
            </button>
            
          </li>
        ))}
      </ul>
    </div>
  );
}