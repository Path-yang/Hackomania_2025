// @ts-nocheck
import { createAuthenticatedClient, type AccessToken, type GrantRequest } from "@interledger/open-payments";
import { importJWK, exportJWK, JWK, KeyLike } from "jose";

const OP_CLIENT_WALLET_ADDRESS = process.env.OP_CLIENT_WALLET_ADDRESS;
const OP_CLIENT_KEY_ID = process.env.OP_CLIENT_KEY_ID;
const OP_CLIENT_PRIVATE_JWK = process.env.OP_CLIENT_PRIVATE_JWK;

if (!OP_CLIENT_WALLET_ADDRESS || !OP_CLIENT_KEY_ID || !OP_CLIENT_PRIVATE_JWK) {
  console.warn("Open Payments client env not fully configured. Some flows will be disabled.");
}

export async function getOpenPaymentsClient() {
  if (!OP_CLIENT_WALLET_ADDRESS || !OP_CLIENT_KEY_ID || !OP_CLIENT_PRIVATE_JWK) {
    throw new Error("Open Payments client is not configured");
  }
  const privateJwk = JSON.parse(OP_CLIENT_PRIVATE_JWK) as JWK;
  const keyLike = (await importJWK(privateJwk, privateJwk.alg)) as KeyLike | string;

  return createAuthenticatedClient({
    walletAddressUrl: OP_CLIENT_WALLET_ADDRESS,
    privateKey: keyLike,
  });
}

export async function getPublicJwks() {
  if (!OP_CLIENT_PRIVATE_JWK || !OP_CLIENT_KEY_ID) return { keys: [] };
  const privateJwk = JSON.parse(OP_CLIENT_PRIVATE_JWK) as JWK;
  const { alg } = privateJwk as any;
  const keyLike = await importJWK(privateJwk, alg);
  const publicJwk = await exportJWK(keyLike);
  (publicJwk as any).alg = alg;
  (publicJwk as any).kid = OP_CLIENT_KEY_ID;
  (publicJwk as any).use = "sig";
  return { keys: [publicJwk] };
}

export type RequestGrantParams = GrantRequest;
export async function requestGrant(params: RequestGrantParams) {
  const client = await getOpenPaymentsClient();
  // NOTE: In a full implementation, discover AS endpoint and pass as first arg
  // Here we optimistically call with params only to keep dev flows moving
  const grant = await (client as any).grant.request({ url: OP_CLIENT_WALLET_ADDRESS }, params as any);
  return grant;
}

export async function continueGrant(continueUri: string, body: any) {
  const client = await getOpenPaymentsClient();
  const result = await (client as any).grant.continue({ url: continueUri }, body);
  return result;
}

export async function createIncomingPayment(recipientWalletAddress: string, accessToken: AccessToken, args: { incomingAmount?: { value: string; assetCode: string; assetScale: number } }) {
  const client = await getOpenPaymentsClient();
  const account = await (client as any).account.get({ url: recipientWalletAddress });
  const incoming = await (client as any).incomingPayment.create({ url: account.incomingPaymentsEndpoint, accessToken }, args.incomingAmount ? { incomingAmount: args.incomingAmount } : {});
  return incoming;
}

export async function createQuote(senderWalletAddress: string, accessToken: AccessToken, args: { receiver: string; receiveAmount?: { value: string; assetCode: string; assetScale: number }; debitAmount?: { value: string; assetCode: string; assetScale: number } }) {
  const client = await getOpenPaymentsClient();
  const account = await (client as any).account.get({ url: senderWalletAddress });
  const quote = await (client as any).quote.create({ url: account.quotesEndpoint, accessToken }, {
    receiver: args.receiver,
    receiveAmount: args.receiveAmount,
    debitAmount: args.debitAmount,
  });
  return quote;
}

export async function createOutgoingPayment(senderWalletAddress: string, accessToken: AccessToken, args: { quoteId: string; receiver: string }) {
  const client = await getOpenPaymentsClient();
  const account = await (client as any).account.get({ url: senderWalletAddress });
  const op = await (client as any).outgoingPayment.create({ url: account.outgoingPaymentsEndpoint, accessToken }, {
    quote: args.quoteId,
    receiver: args.receiver,
  });
  return op;
} 