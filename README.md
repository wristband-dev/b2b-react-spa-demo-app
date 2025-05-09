<div align="center">
  <a href="https://wristband.dev">
    <picture>
      <img src="https://assets.wristband.dev/images/email_branding_logo_v1.png" alt="Github" width="297" height="64">
    </picture>
  </a>
  <p align="center">
    Enterprise-ready auth that is secure by default, truly multi-tenant, and ungated for small businesses.
  </p>
  <p align="center">
    <b>
      <a href="https://wristband.dev">Website</a> •
      <a href="https://docs.wristband.dev">Documentation</a>
    </b>
  </p>
</div>

<br/>

---

<br/>

# Invotastic for Business (React) -- A multi-tenant demo app

"Invotastic for Business" is a Wristband multi-tenant demo app that serves other companies as its customers. This repo utilizes the Single Page App (SPA) integration pattern. The SPA framework is React.
<br>
<br>

> **Disclaimer:**
> Invotastic for Business is not a real-world application and cannot be used to send invoices to real people.

<br>
<hr />

## Getting Started

You can start up the demo application in a few simple steps.

### 1) Sign up for a Wristband account.

First, make sure you sign up for a Wristband account at [https://wristband.dev](https://wristband.dev).

### 2) Provision the React SPA demo application in the Wristband Dashboard.

After your Wristband account is set up, log in to the Wristband dashboard.  Once you land on the home page of the dashboard, click the button labelled "Add Demo App".  Make sure you choose the following options:

- Step 1: Subject to Authenticate - Humans
- Step 2: Application Framework - React (SPA)

You can also follow the [Demo App Guide](https://docs.wristband.dev/docs/setting-up-a-demo-app) for more information.

### 3) Apply your Wristband configuration values

After completing demo app creation, you will be prompted with values that you should use to create environment variables for the Vite dev server. You should see:

- `VITE_APPLICATION_VANITY_DOMAIN`
- `VITE_CLIENT_ID`

Copy those values, then create an environment variable file name `.env` in the root directory of the project. Once created, paste the copied values into this file.

### 4) Run the application

> [!WARNING]
> Make sure you are in the root directory of this repository.

#### Install dependencies

Install all dependencies for the React SPA:

```npm install```

#### Run the Vite server

Start up the Vite dev server, which runs on port `6001`.

```npm start```

<br>
<hr>
<br>

### How to interact with the demo app

#### Signup Users

Now that the app is up and running, you can sign up your first customer on the Signup Page at the following location:

- `http://{application_vanity_domain}/signup`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the application (can be found in the Wristband Dashboard by clicking the Application Settings side menu of this app).

This signup page is hosted by Wristband.  Completing the signup form will provision both a new tenant with the specified tenant domain name and a new user that is assigned to that tenant.

#### Home Page

For reference, the home page of this app can be accessed at [http://localhost:6001/home](http://localhost:6001/home).

#### Application-level Login (Tenant Discovery)

Users of this demo app can access the Application-level Login Page at the following location:

- `http://{application_vanity_domain}/login`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the application (can be found in the Wristband Dashboard by clicking the Application Settings side menu of this app).

This login page is hosted by Wristband.  Here, the user will be prompted to enter their tenant's domain name for which they want to log in to.  Successfully entering the tenant domain name will redirect the user to the tenant-level login page for their specific tenant.

Users also have the option here to execute the Forgot Tenant workflow and entering their email address in order to receive a list of all tenants that they belong to.

#### Tenant-level Login

If users wish to directly access the Tenant-level Login Page without having to go through the application-level login, they can do so at [http://localhost:6001/api/auth/login?tenant_domain={tenant_domain}](http://localhost:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.

This login page is hosted by Wristband.  Here, the user will be prompted to enter their credentials in order to login to the application.

### RBAC

When a new user signs up their company, they are assigned the "Owner" role by default and have full access to their company resources.  Owners of a company can also invite new users into their company.  Invited users can be assigned either the "Owner" role or the "Viewer" role.

### Architecture

Since there is no backend server, the React app is tasked with doing all the heavy lifting when it comes to the following:

- Storing the client ID.
- Handling the OAuth2 authorization code flow redirections to and from Wristband during user login.
- Storing the access token and refresh token in the browser's local storage upon successful login.
- Refreshing the access token if the access token is expired.
- Directly making all API calls to both Wristband, passing the access token in the Authorization header.
- Destroying the tokens in local storage and revoking the refresh token when a user logs out.

Wristband hosts all onboarding workflow pages (signup, login, etc), and the React app will redirect to Wristband in order to show users those pages.

### Wristband Code Touchpoints

Within the demo app code, you can search in your IDE of choice for the text `WRISTBAND_TOUCHPOINT`.  This will show various places in the React code where Wristband is involved.

<br>
<hr />
<br/>

## Questions

Reach out to the Wristband team at <support@wristband.dev> for any questions regarding this demo app.

<br/>
