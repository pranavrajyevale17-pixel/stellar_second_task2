import { useState } from "react";
import { createAccount, getBalance, sendXLM } from "./stellar";

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [balance, setBalance] = useState([]);
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");

  const createWallet = () => {
    const acc = createAccount();
    setAccounts([...accounts, acc]);
    setSelected(acc);
  };

  const check = async () => {
    if (!selected) return alert("Select wallet");
    setBalance(await getBalance(selected.publicKey));
  };

  const send = async () => {
    if (!destination.trim()) return alert("Enter address");
    if (!destination.startsWith("G")) return alert("Invalid address");

    try {
      setStatus("Sending...");
      await sendXLM(selected.secret, destination);
      setStatus("Success");
    } catch {
      setStatus("Failed");
    }
  };

  return (
    <div className="container">
      <h1>🚀 Payment Tracker App</h1>

      <button onClick={createWallet}>Create Wallet</button>

      <div>
        {accounts.map((a, i) => (
          <button key={i} onClick={() => setSelected(a)}>
            Wallet {i + 1}
          </button>
        ))}
      </div>

      {selected && <p>{selected.publicKey}</p>}

      <button onClick={check}>Check Balance</button>

      {balance.map((b, i) => (
        <p key={i}>{b.balance} XLM</p>
      ))}

      <input
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination Address"
      />

      <button onClick={send}>Send XLM</button>

      <p>Status: {status}</p>
    </div>
  );
}
