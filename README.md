# Functionality of the application

This application will allow creating/removing/updating/fetching POST items. Each POST item can have an attachment image, description, tags and can be published for public viewing. Each user has access to all public POSTS and all private and public POSTS that he/she has created.

# POST items

The application stores POST items, and each POST item contains the following fields:

- `postId` (string) - a unique id for an item
- `userId` (string) - a unique id of a user who created a POST item
- `createdAt` (string) - date and time when an item was created
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

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true 'Image 1')

Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true 'Image 2')

Select a file to import:

![Alt text](images/import-collection-3.png?raw=true 'Image 3')

Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true 'Image 4')

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true 'Image 5')
