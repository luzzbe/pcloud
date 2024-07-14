import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import { PCloudError } from "./errors";
import { ApiEndpoint } from "./enums/ApiEndpoint";
import { ApiResponse } from "./types";
import { isApiError } from "./utils";

/**
 * pCloud Client for interacting with pCloud API.
 */
export class PCloudClient {
  private axiosInstance: AxiosInstance;

  /**
   * Initializes a new instance of the PCloudClient.
   * @param accessToken OAuth access token for authenticating requests.
   * @param apiEndpoint Endpoint URL for the pCloud API.
   */
  constructor(accessToken: string, apiEndpoint: ApiEndpoint = ApiEndpoint.US) {
    this.axiosInstance = axios.create({
      baseURL: apiEndpoint,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Makes a generic request to the pCloud API.
   * @param method HTTP method for the request (GET, POST, etc.).
   * @param url API endpoint URL.
   * @param data Optional data to send with the request (for POST requests).
   */
  private async request(method: string, url: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.request<ApiResponse>({
        method,
        url,
        data,
      });

      // Check if result is non-zero, indicating an error
      if (isApiError(response.data)) {
        throw new PCloudError(response.data.result, response.data.error);
      }

      return response.data;
    } catch (error) {
      throw error; // Throw the original error as-is
    }
  }

  /**
   * Lists folders/files in a specified folder.
   * @param folderId ID of the folder to list files from.
   * @param options Additional options for the listing.
   *  - options.recursive If true, lists contents recursively.
   *  - options.showDeleted If true, includes deleted items in the listing.
   *  - options.noFiles If true, excludes files from the listing.
   *  - options.noShares If true, excludes shared items from the listing.
   */
  async listFolders(
    folderId: number,
    options?: {
      recursive?: boolean;
      showDeleted?: boolean;
      noFiles?: boolean;
      noShares?: boolean;
    }
  ): Promise<any> {
    const params = new URLSearchParams({
      folderid: folderId.toString(),
    });

    if (options) {
      if (options.recursive) params.append("recursive", "1");
      if (options.showDeleted) params.append("showdeleted", "1");
      if (options.noFiles) params.append("nofiles", "1");
      if (options.noShares) params.append("noshares", "1");
    }

    return this.request("GET", `/listfolder?${params.toString()}`);
  }

  /**
   * Uploads a file to a specified folder.
   * @param folderId ID of the folder to upload the file to.
   * @param fileName Name of the file to upload.
   * @param fileContent Content of the file to upload (Buffer).
   * @param options Additional options for the upload.
   *  - options.noPartial If true, partially uploaded files will not be saved.
   *  - options.progressHash Hash used for observing upload progress.
   *  - options.renameIfExists If true, the uploaded file will be renamed, if file with the requested name exists in the folder.
   *  - options.mtime If set, file modified time is set. Have to be unix time seconds.
   *  - options.ctime If set, file created time is set. It's required to provide mtime to set ctime. Have to be unix time seconds.
   */
  async uploadFile(
    folderId: number,
    fileName: string,
    fileContent: Buffer,
    options?: {
      noPartial?: boolean;
      progressHash?: string;
      renameIfExists?: boolean;
      mtime?: number;
      ctime?: number;
    }
  ): Promise<any> {
    const params = new URLSearchParams({
      folderid: folderId.toString(),
    });

    if (options) {
      if (options.noPartial) params.append("nopartial", "1");
      if (options.renameIfExists) params.append("renameifexists", "1");
      if (options.mtime) params.append("mtime", options.mtime.toString());
      if (options.ctime) params.append("ctime", options.ctime.toString());
      if (options.progressHash) {
        params.append("progresshash", options.progressHash);
      }
    }

    const formData = new FormData();
    formData.append("file", fileContent, fileName);

    return this.request("POST", `/uploadfile?${params.toString()}`, formData);
  }

  /**
   * Creates a new folder.
   * @param folderId ID of the parent folder where the new folder will be created.
   * @param name Name of the new folder.
   */
  async createFolder(folderId: number, name: string): Promise<any> {
    const params = new URLSearchParams({
      folderid: folderId.toString(),
      name: name,
    });

    return this.request("GET", `/createfolder?${params.toString()}`);
  }

  /**
   * Deletes a folder recursively.
   * @param folderId ID of the folder to delete.
   */
  async deleteFolderRecursive(folderId: number): Promise<any> {
    const params = new URLSearchParams({
      folderid: folderId.toString(),
    });

    return this.request("GET", `/deletefolderrecursive?${params.toString()}`);
  }

  /**
   * Renames and/or moves a folder.
   * @param folderId ID of the folder to rename/move.
   * @param options Options for renaming/moving the folder.
   *  - options.toFolderId ID of the destination folder (optional).
   *  - options.toName New name for the folder (optional).
   *  - options.toPath New path for the folder (optional). If it's an existing folder to place the source folder without a new name, it MUST end with a slash (/).
   */
  async renameFolder(
    folderId: number,
    options: {
      toFolderId?: number;
      toName?: string;
      toPath?: string;
    }
  ): Promise<any> {
    const params = new URLSearchParams({
      folderid: folderId.toString(),
    });

    if (options.toFolderId) {
      params.append("tofolderid", options.toFolderId.toString());
    }
    if (options.toName) {
      params.append("toname", options.toName);
    }
    if (options.toPath) {
      params.append("topath", options.toPath);
    }

    return this.request("GET", `/renamefolder?${params.toString()}`);
  }
}
