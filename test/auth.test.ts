import { config } from "dotenv";
import { getOAuthUrl } from "../src/auth";

config();

describe("Authentication Module", () => {
  it("should generate OAuth URL", () => {
    const clientId = process.env.PCLOUD_CLIENT_ID!;
    const redirectUri = "http://localhost/callback";
    const url = getOAuthUrl(clientId, redirectUri);

    expect(url).toContain(`client_id=${clientId}`);
    expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
  });
});
