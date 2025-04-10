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
    client.models.Records.observeQuery({
      filter: {
        user: { eq: username },
      },
    }).subscribe({
      next: (data) => setRecords([...data.items]),
    });
  }

  async function logError() {
    try {
      const res = await client.models.Records.create({
        user: username,
        loggedAt: Date.now(),
        reason: error || "Normal login",
        level: error ? { I: 2, P: 3 }[error[0]]! : 1,
      });
      console.info(res);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if(authStatus === 'configuring') return
    console.log(authStatus);
    logError();
  }, [error, authStatus]);

  useEffect(() => {
    listRecords();
  }, []);

  const colors = [
    "",
    "rgb(255, 255, 255)",
    "rgb(229, 245, 187)",
    "rgb(255, 187, 187)",
  ];

  return (
    <Authenticator>
      <main>
        <h1>Login attemps</h1>
        <ul>
          {records.map((record) => (
            <li style={{ background: colors[record.level] }} key={record.id}>
              {new Date(record.loggedAt || 0).toISOString()} |{" "}
              <b>{record.reason}</b> | {record.user}
            </li>
          ))}
        </ul>
        <button onClick={signOut}>Sign out</button>
      </main>
    </Authenticator>
  );
}
