# Invotastic for Business (React) -- A multi-tenant demo app

"Invotastic for Business" is a multi-tenant demo app that serves other companies as its customers. This repo utilizes a "Single Page App" OAuth2 client type with React. There is also a NodeJS backend server with the ExpressJS web application framework for hosting Invotastic-specific APIs unrelated to Wristband. The Vite dev server will serve up the React single page application to the browser upon request.
<br>
<br>

> **Disclaimer:**
> Invotastic for Business is not a real-world application and cannot be used to send invoices to real people.

<br>
<hr />

## Demo App Overview

Below is a quick overview of how Invotastic for Business looks behind the scenes and how it interacts with Wristband.

### Entity Model
<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/b2b-react-spa-demo-app/b2b-react-spa-demo-app-entity-model-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/b2b-react-spa-demo-app/b2b-react-spa-demo-app-entity-model-light.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/b2b-react-spa-demo-app/b2b-react-spa-demo-app-entity-model-light.png">
</picture>

The entity model starts at the top with an application that encapsulates everything related to Invotastic for Business.  The application has the Wristband identity provider enabled by default so that all users can login with an email and a password.  The application has one OAuth2 client through which users will be authenticated.  In this case, the client is a React single page app.

Companies that signup with Invotastic for Business will be provisioned a tenant under the application (1 company = 1 tenant). When a new user signs up their company, they are assigned the "Owner" role by default and have full access to their company resources.  Owners of a company can also invite new users into their company.  Invited users can be assigned either the "Owner" role or the "Viewer" role.  A user that is assigned the "Viewer" role can't perform the following operations:

- Create new invoices
- Cancel invoices
- Update company information
- Invite admins 

### Architecture
<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/b2b-react-spa-demo-app/b2b-react-spa-demo-app-architecture-dark-01.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/b2b-react-spa-demo-app/b2b-react-spa-demo-app-architecture-light-01.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/b2b-react-spa-demo-app/b2b-react-spa-demo-app-entity-model-light-01.png">
</picture>

The NodeJS server with Express is the Invotastic-specific backend containing all the APIs for interacting with Invoices. Therefore, the React app is tasked with doing all the heavy lifting when it comes to the following:

- Storing the client ID.
- Handling the OAuth2 authorization code flow redirections to and from Wristband during user login.
- Storing the access token and refresh token in the browser's local storage upon successful login.
- Refreshing the access token if the access token is expired.
- Directly making all API calls to both Wristband and the Invotastic backend data store, passing the access token in the Authorization header.
- Destroying the tokens in local storage and revoking the refresh token when a user logs out.

The server has middlewares for all protected routes that do the following:

- Validating the access token and rejecting unauthorized requests

For any Invotastic-specific APIs (i.e. invoice APIs), the server will perform an authorization check before processing the API request by checking against the permissions assigned to the session user's role.

It is also important to note that Wristband hosts all onboarding workflow pages (signup, login, etc), and the React app will redirect to Wristband in order to show users those pages.

### Wristband Code Touchpoints

Within the demo app code base, you can search in your IDE of choice for the text `WRISTBAND_TOUCHPOINT`.  This will show the various places in both the React frontend code and NodeJS backend code where Wristband is involved.  You will find the search results return one of a few possible comments using that search text:

- `/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */` - Code that deals with an authenticated user's application session.  This includes managing their JWTs, OAuth2-related endpoints for login/callback/logout, NodeJS middleware for validating tokens, and React context used to check if the user is authenticated.
- `/* WRISTBAND_TOUCHPOINT - AUTHORIZATION */` - Code that checks whether a user has the required permissions to interact with Invotastic-specific resource APIs or can access certain application functionality in the UI.
- `/* WRISTBAND_TOUCHPOINT - RESOURCE API */` - Code that interacts with any Wristband-specific resource APIs or workflow APIs that are not related to authentication or authorization directly.  For example, it could be an API call to update the user's profile or change their password.

There are also some visual cues in the Invotastic for Business UI that indicate if certain forms or buttons will trigger the execution of code that runs through any of the touchpoint categories above. For example, if we look at the Invite Admins UI:
<br>
<br>

![touchpoint](https://assets.wristband.dev/docs/b2b-expressjs-demo-app/b2b-demo-app-invite-admins-touchpoint.png)

Submitting the form to invite another admin into your company will ultimately trigger an API call to Wristband to peform the Invite New User workflow, and thus would execute code in the category of `WRISTBAND_TOUCHPOINT - RESOURCE API`.

<br>
<hr />

## Getting Started

You can start up the Invotastic for Business demo application in a few simple steps.

### Sign up for an Wristband account.

First thing is first: make sure you sign up for an Wristband account at [https://wristband.dev](https://wristband.dev).

### Provision the B2B React SPA demo application in the Wristband Dashboard.

After your Wristband account is set up, log in to the Wristband dashboard.  Once you land on the home page of the dashboard, click the button labelled "Add Demo App".  Make sure you choose the following options:

- Step 1: App Type - B2B
- Step 2: Subject Kind - Humans
- Step 3: Client Framework - React
- Step 4: Domain Format  - Choosing `Localhost` is fastest to setup. You can alternatively choose `Vanity Domain` if you want a production-like experience on your local machine for tenant-specific vanity domains, but this method will require additional setup.

### Apply your Wristband configuration values to the React configuration

Upon completing the demo application setup, you will be prompted with values that you should copy into the environment variable configurations for this demo repository. There are two files to paste values into:

#### Client-side Environment Variables

In the React client portion of the project, replace the following values located in `client/.env`:
- `VITE_APPLICATION_DOMAIN`
- `VITE_DOMAIN_FORMAT`
- `VITE_CLIENT_ID`

In the NodeJS server portion of the project, replace the following values located in `server/.env`:
- `APPLICATION_DOMAIN`
- `DOMAIN_FORMAT`
- `CLIENT_ID`

#### Enable CORS configuration
In the demo application setting, please update the following
- Allowed Origins (CORS) : http://localhost:6001

### Run the application in "production" mode 

Make sure you are in the root directory of this repository. 

#### Install dependencies

Now install all dependencies for both the React client application and the NodeJS server:

```npm run install-all```

#### Build the client application bundle

Next, build the React asset bundle that will be served up by NodeJS (asset bundle target location is `server/dist/`):

```npm run build```

#### Run the NodeJS server

Start up the NodeJS server in "production" mode. This lets NodeJS serve the React bundle as static content from the NodeJS server.  The NodeJS server runs on port `6001`.

```npm start```

### How to interact with Invotastic for Business

#### Signup Invotastic Users

Now that Invotastic for Business is up and running, you can sign up your first customer on the Invotastic for Business Signup Page at the following location:

- `http://{application_vanity_domain}/signup`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Invotastic for Business application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

This signup page is hosted by Wristband.  Completing the signup form will provision both a new tenant with the specified tenant domain name and a new user that is assigned to that tenant.

#### Invotastic Home Page

For reference, the home page of this Inovtastic for Business app can be accessed at the following locations:

- Localhost domain format: [http://localhost:6001/home](http://localhost:6001/home)
- Vanity domain format: [http://{tenant_domain}.business.invotastic.com:6001/home](http://{tenant_domain}.business.invotastic.com:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.

#### Invotastic Application-level Login

Users of Invotastic for Business can access the Invotastic for Business Application-level Login Page at the following location:

- `http://{application_vanity_domain}/login`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Invotastic for Business application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

This login page is hosted by Wristband.  Here, the user will be prompted to enter their tenant's domain name for which they want to log in to.  Successfully entering the tenant domain name will redirect the user to the tenant-level login page for their specific tenant.

Users also have the option here to execute the Forgot Tenant workflow and entering their email address in order to receive a list of all tenants that they belong to.

#### Invotastic Tenant-level Login

If users wish to directly access the Invotastic Tenant-level Login Page without having to go through the application-level login, they can do so at the following locations:

- Localhost domain format: [http://localhost:6001/api/auth/login?tenant_domain={tenant_domain}](http://localhost:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.
- Vanity domain format: [http://{tenant_domain}.business.invotastic.com:6001/api/auth/login](http://{tenant_domain}.business.invotastic.com:6001/api/auth/login), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.

This login page is hosted by Wristband.  Here, the user will be prompted to enter their credentials in order to login to the application.

### Run the application in "dev" mode to experiment with the code and debug

You can run this demo application in "dev" mode in order to actively debug or experiment with any of the code.  This will require starting up the React client application in a separate CLI from the NodeJS server.  All API calls made from React to NodeJS are configured to be proxied in order to avoid CORS issues.

In one CLI, change to the `client` directory and run the following to start Create React App's Webpack dev server (runs on port `6001`):

```npm start```

In a second separate CLI, change to the `server` directory and run the following to start the NodeJS server in "dev" mode (runs on port `3001`):

```npm run dev```

All Invotastic URL locations should remain the same as when using the app in "production" mode.

### Setting up a local DNS when using vanity domain for the domain format
##### *<em>**Under Construction**</em>
<br/>

If you choose to use vanity domains as the domain format for the demo application, you will need to install a local DNS server to provide custom configurations.  This configuration forces any requests made to domains ending with `.business.invotastic.com` to get routed to your localhost.  This configuration is necessary since all vanity domains that get generated when running the demo application locally will have a domain suffix of  `*.business.invotastic.com`. Therefore, the above setting will force those domains to resolve back to your local machine instead of attempting to route them out to the web.

The goal is the following mapping:
`business.invotastic.com` => `127.0.0.1`.


Here are some options which you can use, depending on your operating system:

- Mac / Linux: [dnsmasq](http://mayakron.altervista.org/support/acrylic/Home.htm)
- Windows: [Acrylic](http://mayakron.altervista.org/support/acrylic/Home.htm)

More to setup-specific instructions to come...
