# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# TODO items

The application stores TODO items, and each TODO item contains the following fields:

- `todoId` (string) - a unique id for an item
- `userId` (string) - a unique id of a user who created a TODO item
- `createdAt` (string) - date and time when an item was created
- `name` (string) - name of a TODO item (e.g. "Change a light bulb")
- `dueDate` (string) - date and time by which an item should be completed
- `done` (boolean) - true if an item was completed, false otherwise
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
