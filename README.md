# Shopify App Feedback Board

A Shopify App template demonstrating how to integrate **[Features.Vote](https://features.vote)** to add embedded feedback boards, feature voting, roadmaps, and changelogs directly into your Shopify App Admin.

[![Shopify App Feedback Board - Features.Vote Integration Guide](https://img.youtube.com/vi/wC7AFEv0vZs/maxresdefault.jpg)](https://youtu.be/wC7AFEv0vZs)

## Overview

This repository serves as a reference implementation for Shopify Developers looking to gather user feedback within their app. By integrating **Features.Vote**, you can collect feature requests, let merchants vote on priorities, and share your product roadmap—all without them leaving your app's dashboard.

**Key Features:**

* **Embedded Feedback Board:** detailed view for submitting and browsing feature requests.
* **Voting System:** simple upvote mechanism to prioritize development.
* **Roadmap & Changelog:** keep users updated on what's coming and what's shipped.
* **Seamless Integration:** uses the Shopify App Bridge to feel native to the admin.

### Platform & Guides

* **Platform:** [features.vote](https://features.vote)
* **Shopify Use Cases:** [features.vote/use-cases/for-shopify-apps](https://features.vote/use-cases/for-shopify-apps)
* **Integration Guide:** [features.vote/guides/shopify](https://features.vote/guides/shopify)

---

## 📂 Highlighted Files

When exploring the codebase, focus on these files to understand the integration:

* **`app/routes/app.request-feedback.tsx`**
  * **Purpose:** The feedback board page where users can submit and browse feature requests.
  * **What to look for:** This is where the Features.Vote embed is configured. **Important:** Look for the slug `"pulse"` in the code (line 165) and replace it with your own project slug.

* **`app/routes/app.roadmap.tsx`**
  * **Purpose:** The roadmap page displaying planned features.
  * **What to look for:** Features.Vote roadmap widget integration. **Important:** Replace the slug `"pulse"` (line 153) with your own project slug.

* **`app/routes/app.changelog.tsx`**
  * **Purpose:** The changelog page showing recently shipped features.
  * **What to look for:** Features.Vote changelog widget integration. **Important:** Replace the slug `"pulse"` (line 153) with your own project slug.

* **`app/shopify.server.ts`**
  * **Purpose:** Server-side Shopify configuration.
  * **What to look for:** Authentication and session handling to ensure the user viewing the board is a verified merchant.

* **`app/root.tsx`**
  * **Purpose:** The root layout file.
  * **What to look for:** Script tags or global context providers that might be required to initialize the feedback widget.

---

## 🚀 How to Run

This project is built using the **Shopify App React Router** template. Follow these steps to get it running locally:

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v20.19 or higher)
* A [Shopify Partner Account](https://partners.shopify.com/)
* A [Features.Vote](https://features.vote) account
* [Shopify CLI](https://shopify.dev/docs/apps/tools/cli/getting-started) installed globally:
  ```shell
  npm install -g @shopify/cli@latest
  ```

### 2. Install Dependencies

Clone the repository and install the required packages:

```bash
git clone https://github.com/gabriel-pineda/shopify-app-feedback-board.git
cd shopify-app-feedback-board
npm install
```

### 3. Local Development & Live Preview

Start your local development server. This command will prompt you to log in to your Shopify Partner account, select a development store, and will generate a live preview link.

```bash
npm run dev
```

Or using the Shopify CLI directly:

```bash
shopify app dev
```

Press P to open the URL to your app. Once you click install, you can start development.

Local development is powered by [the Shopify CLI](https://shopify.dev/docs/apps/tools/cli). It logs into your partners account, connects to an app, provides environment variables, updates remote config, creates a tunnel and provides commands to generate extensions.

### 4. Configuration (Important)

Before deploying or finalizing your app, you must link it to your specific Features.Vote board:

1. Open **`app/routes/app.request-feedback.tsx`**.
2. Search for the string `"pulse"` (around line 165).
3. **Replace `"pulse"` with your own project slug** from Features.Vote (e.g., if your board is at `my-app.features.vote`, your slug is `my-app`).
4. Repeat this process in **`app/routes/app.roadmap.tsx`** (line 153) and **`app/routes/app.changelog.tsx`** (line 153).

### 5. View the App

Open the URL provided in the terminal (usually a `https://admin.shopify.com/...` link) to see your app running in your development store with the feedback board active.

---

## Shopify Dev MCP

This template is configured with the Shopify Dev MCP. This instructs [Cursor](https://cursor.com/), [GitHub Copilot](https://github.com/features/copilot) and [Claude Code](https://claude.com/product/claude-code) and [Google Gemini CLI](https://github.com/google-gemini/gemini-cli) to use the Shopify Dev MCP.  

For more information on the Shopify Dev MCP please read [the documentation](https://shopify.dev/docs/apps/build/devmcp).

---

## Deployment

### Application Storage

This template uses [Prisma](https://www.prisma.io/) to store session data, by default using an [SQLite](https://www.sqlite.org/index.html) database.
The database is defined as a Prisma schema in `prisma/schema.prisma`.

This use of SQLite works in production if your app runs as a single instance.
The database that works best for you depends on the data your app needs and how it is queried.
Here's a short list of databases providers that provide a free tier to get started:

| Database   | Type             | Hosters                                                                                                                                                                                                                               |
| ---------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MySQL      | SQL              | [Digital Ocean](https://www.digitalocean.com/products/managed-databases-mysql), [Planet Scale](https://planetscale.com/), [Amazon Aurora](https://aws.amazon.com/rds/aurora/), [Google Cloud SQL](https://cloud.google.com/sql/docs/mysql) |
| PostgreSQL | SQL              | [Digital Ocean](https://www.digitalocean.com/products/managed-databases-postgresql), [Amazon Aurora](https://aws.amazon.com/rds/aurora/), [Google Cloud SQL](https://cloud.google.com/sql/docs/postgres)                                   |
| Redis      | Key-value        | [Digital Ocean](https://www.digitalocean.com/products/managed-databases-redis), [Amazon MemoryDB](https://aws.amazon.com/memorydb/)                                                                                                        |
| MongoDB    | NoSQL / Document | [Digital Ocean](https://www.digitalocean.com/products/managed-databases-mongodb), [MongoDB Atlas](https://www.mongodb.com/atlas/database)                                                                                                  |

To use one of these, you can use a different [datasource provider](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datasource) in your `schema.prisma` file, or a different [SessionStorage adapter package](https://github.com/Shopify/shopify-api-js/blob/main/packages/shopify-api/docs/guides/session-storage.md).

### Build

Build the app by running the command below with the package manager of your choice:

Using yarn:

```shell
yarn build
```

Using npm:

```shell
npm run build
```

Using pnpm:

```shell
pnpm run build
```

## Hosting

When you're ready to set up your app in production, you can follow [our deployment documentation](https://shopify.dev/docs/apps/launch/deployment) to host it externally. From there, you have a few options:

- [Google Cloud Run](https://shopify.dev/docs/apps/launch/deployment/deploy-to-google-cloud-run): This tutorial is written specifically for this example repo, and is compatible with the extended steps included in the subsequent [**Build your app**](tutorial) in the **Getting started** docs. It is the most detailed tutorial for taking a React Router-based Shopify app and deploying it to production. It includes configuring permissions and secrets, setting up a production database, and even hosting your apps behind a load balancer across multiple regions. 
- [Fly.io](https://fly.io/docs/js/shopify/): Leverages the Fly.io CLI to quickly launch Shopify apps to a single machine. 
- [Render](https://render.com/docs/deploy-shopify-app): This tutorial guides you through using Docker to deploy and install apps on a Dev store. 
- [Manual deployment guide](https://shopify.dev/docs/apps/launch/deployment/deploy-to-hosting-service): This resource provides general guidance on the requirements of deployment including environment variables, secrets, and persistent data. 

When you reach the step for [setting up environment variables](https://shopify.dev/docs/apps/deployment/web#set-env-vars), you also need to set the variable `NODE_ENV=production`.

---

## Gotchas / Troubleshooting

### Database tables don't exist

If you get an error like:

```
The table `main.Session` does not exist in the current database.
```

Create the database for Prisma. Run the `setup` script in `package.json` using `npm`, `yarn` or `pnpm`:

```shell
npm run setup
```

### Navigating/redirecting breaks an embedded app

Embedded apps must maintain the user session, which can be tricky inside an iFrame. To avoid issues:

1. Use `Link` from `react-router` or `@shopify/polaris`. Do not use `<a>`.
2. Use `redirect` returned from `authenticate.admin`. Do not use `redirect` from `react-router`
3. Use `useSubmit` from `react-router`.

This only applies if your app is embedded, which it will be by default.

### Webhooks: shop-specific webhook subscriptions aren't updated

If you are registering webhooks in the `afterAuth` hook, using `shopify.registerWebhooks`, you may find that your subscriptions aren't being updated.  

Instead of using the `afterAuth` hook declare app-specific webhooks in the `shopify.app.toml` file.  This approach is easier since Shopify will automatically sync changes every time you run `deploy` (e.g: `npm run deploy`).  Please read these guides to understand more:

1. [app-specific vs shop-specific webhooks](https://shopify.dev/docs/apps/build/webhooks/subscribe#app-specific-subscriptions)
2. [Create a subscription tutorial](https://shopify.dev/docs/apps/build/webhooks/subscribe/get-started?deliveryMethod=https)

If you do need shop-specific webhooks, keep in mind that the package calls `afterAuth` in 2 scenarios:

- After installing the app
- When an access token expires

During normal development, the app won't need to re-authenticate most of the time, so shop-specific subscriptions aren't updated. To force your app to update the subscriptions, uninstall and reinstall the app. Revisiting the app will call the `afterAuth` hook.

### Webhooks: Admin created webhook failing HMAC validation

Webhooks subscriptions created in the [Shopify admin](https://help.shopify.com/en/manual/orders/notifications/webhooks) will fail HMAC validation. This is because the webhook payload is not signed with your app's secret key.  

The recommended solution is to use [app-specific webhooks](https://shopify.dev/docs/apps/build/webhooks/subscribe#app-specific-subscriptions) defined in your toml file instead.  Test your webhooks by triggering events manually in the Shopify admin(e.g. Updating the product title to trigger a `PRODUCTS_UPDATE`).

### Webhooks: Admin object undefined on webhook events triggered by the CLI

When you trigger a webhook event using the Shopify CLI, the `admin` object will be `undefined`. This is because the CLI triggers an event with a valid, but non-existent, shop. The `admin` object is only available when the webhook is triggered by a shop that has installed the app.  This is expected.

Webhooks triggered by the CLI are intended for initial experimentation testing of your webhook configuration. For more information on how to test your webhooks, see the [Shopify CLI documentation](https://shopify.dev/docs/apps/tools/cli/commands#webhook-trigger).

### Incorrect GraphQL Hints

By default the [graphql.vscode-graphql](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) extension for will assume that GraphQL queries or mutations are for the [Shopify Admin API](https://shopify.dev/docs/api/admin). This is a sensible default, but it may not be true if:

1. You use another Shopify API such as the storefront API.
2. You use a third party GraphQL API.

If so, please update [.graphqlrc.ts](https://github.com/Shopify/shopify-app-template-react-router/blob/main/.graphqlrc.ts).

### Using Defer & await for streaming responses

By default the CLI uses a cloudflare tunnel. Unfortunately  cloudflare tunnels wait for the Response stream to finish, then sends one chunk.  This will not affect production.

To test [streaming using await](https://reactrouter.com/api/components/Await#await) during local development we recommend [localhost based development](https://shopify.dev/docs/apps/build/cli-for-apps/networking-options#localhost-based-development).

### "nbf" claim timestamp check failed

This is because a JWT token is expired.  If you  are consistently getting this error, it could be that the clock on your machine is not in sync with the server.  To fix this ensure you have enabled "Set time and date automatically" in the "Date and Time" settings on your computer.

### Using MongoDB and Prisma

If you choose to use MongoDB with Prisma, there are some gotchas in Prisma's MongoDB support to be aware of. Please see the [Prisma SessionStorage README](https://www.npmjs.com/package/@shopify/shopify-app-session-storage-prisma#mongodb).

### Unable to require(`C:\...\query_engine-windows.dll.node`).

Unable to require(`C:\...\query_engine-windows.dll.node`).
  The Prisma engines do not seem to be compatible with your system.

  query_engine-windows.dll.node is not a valid Win32 application.

**Fix:** Set the environment variable:
```shell
PRISMA_CLIENT_ENGINE_TYPE=binary
```

This forces Prisma to use the binary engine mode, which runs the query engine as a separate process and can work via emulation on Windows ARM64.

---

## Resources

React Router:

- [React Router docs](https://reactrouter.com/home)

Shopify:

- [Intro to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [Shopify App React Router docs](https://shopify.dev/docs/api/shopify-app-react-router)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge-library).
- [Polaris Web Components](https://shopify.dev/docs/api/app-home/polaris-web-components).
- [App extensions](https://shopify.dev/docs/apps/app-extensions/list)
- [Shopify Functions](https://shopify.dev/docs/api/functions)

Features.Vote:

- [Features.Vote Platform](https://features.vote)
- [Shopify Integration Guide](https://features.vote/guides/shopify)
- [Shopify Use Cases](https://features.vote/use-cases/for-shopify-apps)

Internationalization:

- [Internationalizing your app](https://shopify.dev/docs/apps/best-practices/internationalization/getting-started)
