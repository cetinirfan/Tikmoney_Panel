import { GoogleAuth } from './auth/googleauth';
export { Compute, ComputeOptions } from './auth/computeclient';
export { CredentialBody, CredentialRequest, Credentials, JWTInput, } from './auth/credentials';
export { GCPEnv } from './auth/envDetect';
export { GoogleAuthOptions, ProjectIdCallback } from './auth/googleauth';
export { IAMAuth, RequestMetadata } from './auth/iam';
export { IdTokenClient, IdTokenProvider } from './auth/idtokenclient';
export { Claims, JWTAccess } from './auth/jwtaccess';
export { JWT, JWTOptions } from './auth/jwtclient';
export { Certificates, CodeChallengeMethod, CodeVerifierResults, GenerateAuthUrlOpts, GetTokenOptions, OAuth2Client, OAuth2ClientOptions, RefreshOptions, TokenInfo, VerifyIdTokenOptions, } from './auth/oauth2client';
export { LoginTicket, TokenPayload } from './auth/loginticket';
export { UserRefreshClient, UserRefreshClientOptions, } from './auth/refreshclient';
export { AwsClient, AwsClientOptions } from './auth/awsclient';
export { IdentityPoolClient, IdentityPoolClientOptions, } from './auth/identitypoolclient';
export { ExternalAccountClient, ExternalAccountClientOptions, } from './auth/externalclient';
export { BaseExternalAccountClient, BaseExternalAccountClientOptions, } from './auth/baseexternalclient';
export { DefaultTransporter } from './transporters';
declare const auth: GoogleAuth;
export { auth, GoogleAuth };
