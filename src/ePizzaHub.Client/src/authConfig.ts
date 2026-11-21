import { type Configuration, LogLevel } from '@azure/msal-browser'

// These values are public identifiers (not secrets).
const tenantSubdomain = 'epizzahubcust'
const tenantId = '2b72ef06-67fc-46e6-8c5b-cad4eaaec5c3'
export const clientId = '83997de3-c545-4fc6-a26c-39a49daaa5e1'

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://${tenantSubdomain}.ciamlogin.com/${tenantId}/`,
    knownAuthorities: [`${tenantSubdomain}.ciamlogin.com`],
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage' },
  system: { loggerOptions: { logLevel: LogLevel.Warning } },
}

// Scope exposed by the ePizzaHub Web app registration ("Expose an API").
export const apiScopes = [`api://${clientId}/access_as_user`]
