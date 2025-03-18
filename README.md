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

"Invotastic for Business" is a multi-tenant demo app that serves other companies as its customers. This repo utilizes a "Single Page App" OAuth2 client type with React and Vite.
<br>
<br>

> **Disclaimer:**
> Invotastic for Business is not a real-world application and cannot be used to send invoices to real people.

<br>
<hr />

## Getting Started

You can start up the Invotastic demo application in a few simple steps.

### 1) Sign up for a Wristband account.

First, make sure you sign up for a Wristband account at [https://wristband.dev](https://wristband.dev).

### 2) Provision the React SPA demo application in the Wristband Dashboard.

After your Wristband account is set up, log in to the Wristband dashboard.  Once you land on the home page of the dashboard, click the button labelled "Add Demo App".  Make sure you choose the following options:

- Step 1: Subject to Authenticate - Humans
- Step 2: Client Framework - React (SPA)
- Step 3: Domain Format  - Choosing `Localhost` is fastest to setup. You can alternatively choose `Vanity Domain` if you want a production-like experience on your local machine for tenant-specific vanity domains, but this method will require additional setup.

You can also follow the [Demo App Guide](https://docs.wristband.dev/docs/setting-up-a-demo-app) for more information.
 
> **Using Vanity Domains**
> If you’re using vanity domains for URLs, check the suggestions later in this README for configuring them to work with your local development server.

### 3) Apply your Wristband configuration values

After completing demo app creation, you will be prompted with values that you should use to create environment variables for the Vite dev server. You should see:

- `VITE_APPLICATION_DOMAIN`
- `VITE_CLIENT_ID`
- `VITE_DOMAIN_FORMAT`

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

### How to interact with Invotastic for Business

#### Signup Invotastic Users

Now that Invotastic for Business is up and running, you can sign up your first customer on the Invotastic for Business Signup Page at the following location:

- `http://{application_vanity_domain}/signup`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Invotastic for Business application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

This signup page is hosted by Wristband.  Completing the signup form will provision both a new tenant with the specified tenant domain name and a new user that is assigned to that tenant.

#### Invotastic Home Page

For reference, the home page of this Inovtastic for Business app can be accessed at the following locations:

- Localhost domain format: [http://localhost:6001/home](http://localhost:6001/home)
- Vanity domain format: [http://{tenant_domain}.business.invotastic.com:6001/home](http://{tenant_domain}.business.invotastic.com:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.

#### Invotastic Application-level Login (Tenant Discovery)

Users of Invotastic for Business can access the Invotastic for Business Application-level Login Page at the following location:

- `http://{application_vanity_domain}/login`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Invotastic for Business application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

This login page is hosted by Wristband.  Here, the user will be prompted to enter their tenant's domain name for which they want to log in to.  Successfully entering the tenant domain name will redirect the user to the tenant-level login page for their specific tenant.

Users also have the option here to execute the Forgot Tenant workflow and entering their email address in order to receive a list of all tenants that they belong to.

#### Invotastic Tenant-level Login

If users wish to directly access the Invotastic Tenant-level Login Page without having to go through the application-level login, they can do so at the following locations:

- Localhost domain format: [http://localhost:6001/api/auth/login?tenant_domain={tenant_domain}](http://localhost:6001/home), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.
- Vanity domain format: [http://{tenant_domain}.business.invotastic.com:6001/api/auth/login](http://{tenant_domain}.business.invotastic.com:6001/api/auth/login), where `{tenant_domain}` should be replaced with the value of the desired tenant's domain name.

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

### Setting up a local DNS when using vanity domain for the domain format

If you choose to use vanity domains as the domain format for the demo application, you will need to install a local DNS server to provide custom configurations.  This configuration forces any requests made to domains ending with `.business.invotastic.com` to get routed to your localhost.  This configuration is necessary since all vanity domains that get generated when running the demo application locally will have a domain suffix of  `*.business.invotastic.com`. Therefore, the above setting will force those domains to resolve back to your local machine instead of attempting to route them out to the web.

The goal is the following mapping:
`business.invotastic.com` => `127.0.0.1`.


Here are some options which you can use, depending on your operating system:

- Mac / Linux: [dnsmasq](http://mayakron.altervista.org/support/acrylic/Home.htm)
- Windows: [Acrylic](http://mayakron.altervista.org/support/acrylic/Home.htm)

<br>

## Questions

Reach out to the Wristband team at <support@wristband.dev> for any questions regarding this demo app.

<br/>
