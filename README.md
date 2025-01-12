# Node GraphQL Code Test

This codebase leverages **[swc-node](https://github.com/swc-project/swc-node)** for fast TypeScript execution, enabling rapid builds and efficient runtime transformations. Paired with **[nodemon](https://nodemon.io/)**, the server quickly reloads when code changes are saved, which even includes updating the port configuration without needing a manual restart! It integrates **[GraphQL Yoga](https://the-guild.dev/graphql/yoga-server)** to handle GraphQL queries and mutations, and **[SuperTest](https://github.com/visionmedia/supertest)** for endpoint testing.

<br>
<br>

---

<br>
<br>

# Start the environment

## Ensure that you have [pnpm](https://pnpm.io/) installed. If not, follow the steps below:

### Install pnpm

1. **Using npm**:

   You can install `pnpm` globally using the following command:

   ```bash
   npm install -g pnpm
   ```

2. **Using Homebrew (macOS)**:

   ```bash
   brew install pnpm
   ```

3. **Using curl**:
   ```bash
   curl -fsSL https://get.pnpm.io/install.sh | sh -
   ```

After installation, verify that `pnpm` is working by running:

```bash
pnpm -v
```

<br>
<br>

---

<br>
<br>

## Setup

### Clone the repository

```bash
git clone https://github.com/mattfsourcecode/node-graphql-code-test
cd node-graphql-code-test
```

### Install Dependencies

```bash
pnpm i
```

The install command automatically runs a `prepare` script that sets up a `pre-commit` Git hook to ensure tests pass and the build succeeds before each commit.

<br>
<br>

---

<br>
<br>

## To start the development server, run:

```bash
pnpm dev
```

#### What the `dev` script does:

- Uses `nodemon` to watch for changes in TypeScript files (`src/**/*.ts`).
- Automatically restarts the server when a change is detected.
- Runs the server using `node` with the `@swc-node/register` to transpile TypeScript files on the fly.
- Enables debugging with `--inspect` (useful for debugging in Chrome DevTools or other debugging tools).

<br>
<br>

---

<br>
<br>

## GraphQL Query

### Install [jq](https://jqlang.github.io/jq/)

`jq` is used to format JSON output from `curl`. To install `jq`, follow the instructions for your system:

- **macOS (Homebrew)**:

  ```bash
  brew install jq
  ```

- **Linux (Ubuntu/Debian)**:

  ```bash
  sudo apt-get update
  sudo apt-get install jq
  ```

- **Windows**: Follow the instructions on the [official jq website](https://stedolan.github.io/jq/download/).

The `curl` command will send a query to the GraphQL server at `http://localhost:3000/graphql`, and `jq` will format the JSON response for easy reading.

## Example cURL Request

To query the GraphQL server for the full menu, use the following `curl` command:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ menu { appetizers { id name description price } entrees { id name description price } sandwiches { description cold { id name description halfPrice fullPrice } hot { id name description price } } soupAndSaladCombos { id name price } fajitas { id description price options { id name } } tacos { id description price options { id name } } enchiladas { id description options { id name } sizes { id name price } } quiche { id name description price } greenSalads { id name description price } } }"}' | jq
```

<br>
<br>

---

<br>
<br>

## Run the Tests

The existing [Jest](https://www.npmjs.com/package/jest) testing suite in the application uses [SuperTest](https://www.npmjs.com/package/supertest) to vastly simplify the need for Express server setup in test specs.

**NOTE:** The testing suite currently requires the dev server to be **stopped**. A future optimization will implement a method for running the tests on a different port.

To run the tests using Jest:

```bash
pnpm test
```

<br>
<br>

---

<br>
<br>

## Debugging the Dev Server

To start debugging:

1. Start the server using the `pnpm dev` script.
2. Open Chrome and navigate to `chrome://inspect`.
3. Click on "Inspect" under the "Remote Targets" section.
4. The app should now be available for debugging in Chrome DevTools.

<br>
<br>

---

<br>
<br>

## Additional GraphQL Queries

### 1. Query data for all sandwiches with their full prices:

**Query:**

```graphql
{
  menu {
    sandwiches {
      cold {
        name
        fullPrice
      }
      hot {
        name
        price
      }
    }
  }
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ menu { sandwiches { cold { name fullPrice } hot { name price } } } }"}' | jq
```

### 2. Query data for all tacos and their prices:

**Query:**

```graphql
{
  menu {
    tacos {
      description
      price
      options {
        name
        description
      }
    }
  }
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ menu { tacos { description price options { name description } } } }"}' | jq
```

### 3. Query data for all fajitas and their options:

**Query:**

```graphql
{
  menu {
    fajitas {
      description
      options {
        name
        description
      }
    }
  }
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ menu { fajitas { description options {  name description } } } }"}' | jq
```
