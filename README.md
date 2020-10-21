# Functionality of the application

This application will allow creating/removing/updating/fetching/publishing POST items. Each POST item can have an title, attachment image, description, tags and can be published for public viewing. Each user has access to all public POSTS and all private and public POSTS that he/she has created.

# POST items

The application stores POST items, and each POST item contains the following fields:

- `postId` (string) - a unique id for a post
- `userId` (string) - a unique id of a user who created a POST item
- `title` (string) - title of a post
- `createdAt` (string) - date and time when a post was created
- `description` (string) - description of a POST item (e.g. "Change a light bulb")
- `tags` (string[]) - array of strings
- `public` (string) - public or private status
- `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.
Pleas see the `config.ts` file in the `client` folder. This file configures your client application and contains an API endpoint and Auth0 configuration:

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.
