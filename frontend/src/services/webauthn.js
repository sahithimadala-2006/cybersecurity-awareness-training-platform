function decodeBase64Url(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodeBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function registrationOptionsFromJson(options) {
  return {
    ...options,
    challenge: decodeBase64Url(options.challenge),
    user: { ...options.user, id: decodeBase64Url(options.user.id) },
    excludeCredentials: (options.excludeCredentials || []).map((item) => ({ ...item, id: decodeBase64Url(item.id) })),
  };
}

export function authenticationOptionsFromJson(options) {
  return {
    ...options,
    challenge: decodeBase64Url(options.challenge),
    allowCredentials: (options.allowCredentials || []).map((item) => ({ ...item, id: decodeBase64Url(item.id) })),
  };
}

export function credentialToJson(credential, registration = false) {
  const response = credential.response;
  const serializedResponse = registration
    ? {
        attestationObject: encodeBase64Url(response.attestationObject),
        clientDataJSON: encodeBase64Url(response.clientDataJSON),
        transports: response.getTransports?.() || [],
      }
    : {
        authenticatorData: encodeBase64Url(response.authenticatorData),
        clientDataJSON: encodeBase64Url(response.clientDataJSON),
        signature: encodeBase64Url(response.signature),
        userHandle: response.userHandle ? encodeBase64Url(response.userHandle) : null,
      };
  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: credential.type,
    response: serializedResponse,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),
  };
}

export function ensurePasskeySupport() {
  if (!window.PublicKeyCredential || !navigator.credentials) {
    throw new Error("Passkeys are not supported by this browser.");
  }
}
