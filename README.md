# PCloudClient

PCloudClient is a TypeScript library for interacting with the pCloud API. It provides a simple and intuitive interface to perform operations such as listing files and folders, uploading files, and more.

## Features

- Easy authentication with pCloud API using OAuth access tokens
- List files and folders in a pCloud directory
- Upload files to pCloud
- Configurable API endpoint (US or EU)
- Built-in error handling for API responses
- Helper functions for OAuth authentication flow

## Installation

To install PCloudClient, use npm:

```bash
npm install pcloud-client
```

Or if you prefer yarn:

```bash
yarn add pcloud-client
```

## Authentication

Before using the PCloudClient, you need to obtain an OAuth access token. The library provides helper functions to assist with the OAuth flow:

### 1. Generate OAuth URL

Use the `getOAuthUrl` function to generate the URL for the user to authorize your application:

```typescript
import { getOAuthUrl } from "pcloud-client";

const clientId = "your-client-id";
const redirectUri = "your-redirect-uri"; // Optional

const authUrl = getOAuthUrl(clientId, redirectUri);
console.log("Authorize the app by visiting:", authUrl);
```

Direct the user to this URL. After authorization, they will be redirected to your `redirectUri` with an authorization code.

### 2. Exchange Authorization Code for Access Token

Once you have the authorization code, use the `getAccessToken` function to exchange it for an access token:

```typescript
import { getAccessToken, ApiEndpoint } from "pcloud-client";

const clientId = "your-client-id";
const clientSecret = "your-client-secret";
const authorizationCode = "code-from-redirect";

try {
  const accessToken = await getAccessToken(
    clientId,
    clientSecret,
    authorizationCode,
    ApiEndpoint.US
  );
  console.log("Access Token:", accessToken);
} catch (error) {
  console.error("Error getting access token:", error);
}
```

This access token can now be used to initialize the PCloudClient.

## Usage

Here's a basic example of how to use PCloudClient:

```typescript
import { PCloudClient, ApiEndpoint } from "pcloud-client";

// Initialize the client with the obtained access token
const client = new PCloudClient("your-access-token", ApiEndpoint.US);

// List files in a folder
const folderId = 0; // Root folder
client
  .listFolders(folderId)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

// Upload a file
const fileContent = Buffer.from("Hello, pCloud!");
client
  .uploadFile(folderId, "hello.txt", fileContent)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

## API

### PCloudClient

#### Constructor

```typescript
new PCloudClient(accessToken: string, apiEndpoint?: ApiEndpoint)
```

Creates a new instance of PCloudClient.

- `accessToken`: Your pCloud OAuth access token
- `apiEndpoint`: (Optional) The API endpoint to use. Defaults to `ApiEndpoint.US`

#### Methods

##### listFolders

```typescript
listFolders(folderId: number, options?: object): Promise<any>
```

Lists folders and files in a specified folder.

- `folderId`: ID of the folder to list contents from
- `options`: (Optional) Additional listing options
  - `recursive`: If true, lists contents recursively
  - `showDeleted`: If true, includes deleted items
  - `noFiles`: If true, excludes files from the listing
  - `noShares`: If true, excludes shared items

##### uploadFile

```typescript
uploadFile(folderId: number, fileName: string, fileContent: Buffer, options?: {
  noPartial?: boolean;
  progressHash?: string;
  renameIfExists?: boolean;
  mtime?: number;
  ctime?: number;
}): Promise<any>
```

Uploads a file to a specified folder.

- `folderId`: ID of the folder to upload the file to
- `fileName`: Name of the file to upload
- `fileContent`: Content of the file to upload (as a Buffer)
- `options`: (Optional) Additional upload options
  - `noPartial`: If true, partially uploaded files will not be saved
  - `progressHash`: Hash used for observing upload progress
  - `renameIfExists`: If true, the uploaded file will be renamed if a file with the requested name exists in the folder
  - `mtime`: If set, file modified time is set (Unix timestamp in seconds)
  - `ctime`: If set, file created time is set. Requires `mtime` to be set as well (Unix timestamp in seconds)

##### createFolder

```typescript
createFolder(folderId: number, name: string): Promise<any>
```

Create a folder in a specified parent folder.

- `folderId`: ID of the parent folder where the new folder will be created
- `name`: Name of the new folder

##### deleteFolderRecursive

```typescript
deleteFolderRecursive(folderId: number): Promise<any>
```

Deletes a folder recursively.

- `folderId`: ID of the folder to delete

##### renameFolder

```typescript
renameFolder(folderId: number): Promise<any>
```

Renames and/or moves a folder.

- `folderId`: ID of the folder to delete
- `options`: (Optional) Options for renaming/moving the folder
  - `toFolderId`: ID of the destination folder
  - `toName`: New name for the folder
  - `toPath`: New path for the folder

### Authentication Helper Functions

These functions are not part of the PCloudClient class but are provided to help with the OAuth authentication process.

#### getOAuthUrl

```typescript
getOAuthUrl(clientId: string, redirectUri?: string): string
```

Generates an OAuth URL for authentication with pCloud.

- `clientId`: The OAuth Client ID provided by pCloud
- `redirectUri`: (Optional) The redirect URI after authentication

#### getAccessToken

```typescript
getAccessToken(clientId: string, clientSecret: string, code: string, apiEndpoint?: ApiEndpoint): Promise<string>
```

Exchanges an OAuth authorization code for an OAuth access token with pCloud.

- `clientId`: The OAuth Client ID provided by pCloud
- `clientSecret`: The OAuth Client Secret provided by pCloud
- `code`: The authorization code received after user authorization
- `apiEndpoint`: (Optional) The API endpoint to use. Defaults to `ApiEndpoint.US`

## Error Handling

PCloudClient throws a `PCloudError` for any API errors. You can catch and handle these errors in your code:

```typescript
try {
  const result = await client.listFolders(invalidFolderId);
} catch (error) {
  if (error instanceof PCloudError) {
    console.error(`API Error: ${error.message}`);
  } else {
    console.error("An unexpected error occurred:", error);
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
