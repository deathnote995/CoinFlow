const API_BASE_URL = "http://localhost:3001";

export async function fetchWallets(baseUrl = API_BASE_URL) {
  const res = await fetch(`${baseUrl}/wallets`);
  if (!res.ok) throw new Error("Failed to fetch wallets");
  return res.json();
}

export async function fetchTransactions(baseUrl = API_BASE_URL) {
  const res = await fetch(`${baseUrl}/transactions`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function createTransaction(payload, baseUrl = API_BASE_URL) {
  const res = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json();
}

export async function createWallet(payload, baseUrl = API_BASE_URL) {
  const res = await fetch(`${baseUrl}/wallets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create wallet");
  return res.json();
}