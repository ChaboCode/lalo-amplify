"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { authStatus, error, username } = useAuthenticator((context) => [
    context.authStatus,
    context.error,
    context.username,
  ]);

  const { signOut } = useAuthenticator();
  const [records, setRecords] = useState<Array<Schema["Records"]["type"]>>([]);

  function listRecords() {
    client.models.Records.observeQuery().subscribe({
      next: (data) => setRecords([...data.items]),
    });
  }

  function logError() {
    client.models.Records.create({
      user: username,
      loggedAt: Date.now(),
    });
  }

  useEffect(() => {
    if (error) {
      logError();
    }
  }, [error]);

  useEffect(() => {
    listRecords();
  }, []);

  return (
    <Authenticator>
      <main>
        <h1>Login attemps</h1>
        <ul>
          {records.map((record) => (
            <li key={record.id}>{record.user}</li>
          ))}
        </ul>
        <button onClick={signOut}>Sign out</button>
      </main>
    </Authenticator>
  );
}
