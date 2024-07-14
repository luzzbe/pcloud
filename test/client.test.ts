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

  describe("Folder operations", () => {
    let createdFolderId: number;
    const parentFolderId = 0; // Root folder
    const originalFolderName = `test-folder-${Date.now()}`; // Unique folder name
    const newFolderName = `renamed-${originalFolderName}`;

    it("should create a folder", async () => {
      const createResult = await client.createFolder(
        parentFolderId,
        originalFolderName
      );
      expect(createResult.metadata.name).toBe(originalFolderName);
      createdFolderId = createResult.metadata.folderid;
    });

    it("should rename a folder", async () => {
      // Assuming the folder was created in the previous test
      const renameResult = await client.renameFolder(createdFolderId, {
        toName: newFolderName,
      });
      expect(renameResult.metadata.name).toBe(newFolderName);
      expect(renameResult.metadata.folderid).toBe(createdFolderId);

      // Verify the folder was renamed
      const listResult = await client.listFolders(parentFolderId);
      const renamedFolder = listResult.metadata.contents.find(
        (item: any) => item.folderid === createdFolderId
      );
      expect(renamedFolder).toBeDefined();
      expect(renamedFolder.name).toBe(newFolderName);
    });

    it("should delete a folder", async () => {
      // Clean up: Delete the folder
      await client.deleteFolderRecursive(createdFolderId);

      // Verify the folder is deleted
      try {
        await client.listFolders(createdFolderId);
        fail("Expected an error, but the folder still exists");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("error handling", () => {
    it("should throw PCloudError for API errors", async () => {
      const folderId = -1; // Invalid folder ID
      await expect(client.listFolders(folderId)).rejects.toThrow(PCloudError);
    });
  });
});
