import { useRouter } from "next/router";
import Head from "next/head";
import incidents from "../data/incidents";

export default function IncidentPage({ incident }) {
  const router = useRouter();

  // Agar incident nahi mila toh 404 dikhana
  if (!incident) {
    return <h1>Incident Not Found</h1>;
  }

  return (
    <>
      <Head>
        <title>{incident.title}</title>
        <meta name="description" content={incident.description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={incident.title} />
        <meta property="og:description" content={incident.description} />
        <meta property="og:image" content={incident.image} />
        <meta property="og:url" content={`https://yourdomain.com/${incident.id}`} />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={incident.title} />
        <meta name="twitter:description" content={incident.description} />
        <meta name="twitter:image" content={incident.image} />
      </Head>

      <div>
        <h1>{incident.title}</h1>
        <p>{incident.description}</p>
        <img src={incident.image} alt={incident.title} width="600" />
      </div>
    </>
  );
}

// **Server-side Rendering (SSR)**
export async function getServerSideProps(context) {
  const { id } = context.params;
  const incident = incidents.find(item => item.id === id) || null;

  return {
    props: { incident },
  };
}