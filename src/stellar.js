import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

export const createAccount = () => {
  const pair = StellarSdk.Keypair.random();
  return {
    publicKey: pair.publicKey(),
    secret: pair.secret(),
  };
};

export const getBalance = async (key) => {
  try {
    const acc = await server.loadAccount(key);
    return acc.balances;
  } catch {
    return [];
  }
};

export const sendXLM = async (secret, destination) => {
  const kp = StellarSdk.Keypair.fromSecret(secret);
  const acc = await server.loadAccount(kp.publicKey());

  const tx = new StellarSdk.TransactionBuilder(acc, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount: "10",
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(kp);
  return await server.submitTransaction(tx);
};
