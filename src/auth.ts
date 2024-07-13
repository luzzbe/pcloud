import axios from "axios";
import { PCloudError } from "./errors";
import { ApiError, ApiResponse } from "./types";
import { isApiError } from "./utils";
import { ApiEndpoint } from "./enums/ApiEndpoint";

/**
 * Generates an OAuth URL for authentication with pCloud.
 * @param clientId The OAuth Client ID provided by pCloud.
 * @param redirectUri The redirect URI after authentication.
 * @returns The generated OAuth URL for authentication.
 */
export function getOAuthUrl(clientId: string, redirectUri?: string): string {
  const url = new URL("https://my.pcloud.com/oauth2/authorize");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("response_type", "code");
  if (redirectUri) url.searchParams.append("redirect_uri", redirectUri);
  return url.toString();
}

/**
 * Exchanges an OAuth authorization code for an OAuth access token with pCloud.
 * @param clientId The OAuth Client ID provided by pCloud.
 * @param clientSecret The OAuth Client Secret provided by pCloud.
 * @param code The authorization code received after user authorization.
 * @returns The OAuth access token for accessing pCloud APIs.
 */
export async function getAccessToken(
  clientId: string,
  clientSecret: string,
  code: string,
  apiEndpoint: ApiEndpoint = ApiEndpoint.US
): Promise<string> {
  const url = apiEndpoint + "/oauth2_token";
  const response = await axios.get<ApiResponse>(url, {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    },
  });

  if (isApiError(response.data)) {
    throw new PCloudError(response.data.result, response.data.error);
  }

  return response.data.access_token;
}
