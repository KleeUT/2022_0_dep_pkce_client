import { getVerifier, storeVerifier } from "./authenticatorStore";
import { generateChallenge, generateCodeVerifier } from "./codeVerifier";

const auth0ClientId = "7M8U6q01ze42Cbf7uDxPaGc7tMLZfE2m";
const baseUrl = "http://localhost:1234";
const auth0Domain = "staging-saladsimulator.au.auth0.com";
const auth0BaseUrl = `https://${auth0Domain}`;
const auth0ApiAudience = "saladsimulator-staging";
const scope = "openid profile";
const authCallbackUrl = `${baseUrl}`;
const auth0TokenUrl = `https://${auth0Domain}/oauth/token`;

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: "Bearer";
  expires_in: number;
};

function authLoginUrl({ challenge }: { challenge: string }): string {
  const params = new URLSearchParams();
  params.append("client_id", auth0ClientId);
  params.append("redirect_uri", authCallbackUrl);
  params.append("audience", auth0ApiAudience);
  params.append("response_type", "code");
  params.append("scope", scope);
  params.append("code_challenge", challenge);
  params.append("code_challenge_method", "S256");
  const url = new URL(`${auth0BaseUrl}/authorize?${params.toString()}`);
  return url.toString();
}

function writeToDom(val: string) {
  document.getElementById("out").innerHTML = `<p>${val}</p>`;
}

async function handleAuthorizationCodeExchange(code: string): Promise<void> {
  const codeVerifier = getVerifier().verifier;
  const body = {
    grant_type: "authorization_code",
    client_id: auth0ClientId,
    code_verifier: codeVerifier,
    code,
    redirect_uri: authCallbackUrl,
  };

  console.log("token request body", body);
  const res = await fetch(`${auth0TokenUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const bod = await res.json();

    writeToDom(
      `failed to get code from url ${res.status} ${
        res.statusText
      } - Code ${code} bod: ${JSON.stringify(bod)}`
    );
    return;
  } else {
    const resJson = (await res.json()) as TokenResponse;
    writeToDom(`<p>Got tokens ${JSON.stringify(resJson)}</p>`);
    return;
  }
}

const queryParams = new URLSearchParams(window.location.search);
if (queryParams.has("code")) {
  const code = queryParams.get("code");
  handleAuthorizationCodeExchange(code);
}

document.getElementById("login").addEventListener("click", async () => {
  const verifier = await generateCodeVerifier();
  const challenge = await generateChallenge(verifier);
  storeVerifier(verifier);
  console.log({ verifier, challenge });
  writeToDom(
    `<a href="${authLoginUrl({ challenge })}">${authLoginUrl({
      challenge,
    })}</a>`
  );
});
