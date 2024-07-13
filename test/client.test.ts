import { config } from "dotenv";
import { PCloudClient } from "../src/client";
import { ApiEndpoint } from "../src/enums/ApiEndpoint";
import { PCloudError } from "../src/errors";

config();

describe("PCloudClient", () => {
  let client: PCloudClient;
  const accessToken = process.env.PCLOUD_ACCESS_TOKEN!;

  beforeEach(() => {
    client = new PCloudClient(accessToken);
  });

  it("should create an instance with default API endpoint", () => {
    expect(client).toBeInstanceOf(PCloudClient);
  });

  it("should create an instance with custom API endpoint", () => {
    const customClient = new PCloudClient(accessToken, ApiEndpoint.EU);
    expect(customClient).toBeInstanceOf(PCloudClient);
  });

  describe("listFiles", () => {
    it("should list files for a given folder ID", async () => {
      const folderId = 22351536493;
      await expect(client.listFolders(folderId)).resolves.toBeDefined();
    });
  });

  describe("uploadFile", () => {
    it("should upload a file to a given folder ID", async () => {
      const folderId = 22351536493;
      const fileName = "test.txt";
      const fileContent = Buffer.from("Hello, world!");
      await expect(
        client.uploadFile(folderId, fileName, fileContent)
      ).resolves.toBeDefined();
    });
  });

  describe("error handling", () => {
    it("should throw PCloudError for API errors", async () => {
      const folderId = -1; // Invalid folder ID
      await expect(client.listFolders(folderId)).rejects.toThrow(PCloudError);
    });
  });
});
