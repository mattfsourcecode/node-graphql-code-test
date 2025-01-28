import express, {
  Express,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import helmet from "helmet";
import { createYoga, createSchema, YogaServerInstance } from "graphql-yoga";
import { typeDefs, resolvers } from "@/graphql";
import { IncomingMessage, Server, ServerResponse } from "http";
import dotenv from "dotenv";
import { setServer, setupSignalHandlers } from "@/utils/signalHandlers";

dotenv.config();

const app: Express = express();

/**
 * Global middleware: `morgan`
 *
 * - Logs HTTP requests and response details for debugging and monitoring.
 * - Example log: `POST / 200 5.123 ms - 12`
 * - Placed early to log requests before other middleware.
 */
app.use(morgan("dev"));

/**
 * Global middleware: `helmet`
 *
 * Helps secure Express apps by setting various HTTP headers.
 *
 * Features:
 * - Enhances security by mitigating common web vulnerabilities.
 * - Easy to configure and provides default settings for most use cases.
 *
 * Protections Provided:
 * - `Content-Security-Policy`: Prevents cross-site scripting (XSS) and other code injection attacks.
 * - `X-Frame-Options`: Prevents clickjacking attacks by restricting how the app can be embedded in iframes.
 * - `Strict-Transport-Security`: Enforces HTTPS connections.
 * - `X-DNS-Prefetch-Control`: Controls browser DNS prefetching to reduce potential information leaks.
 * - `X-Content-Type-Options`: Prevents browsers from interpreting files as a different MIME type.
 * - `X-Permitted-Cross-Domain-Policies`: Restricts Adobe Flash or PDF cross-domain requests.
 */
app.use(
  helmet({
    // Enable and configure Content-Security-Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'none'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // Enable X-Frame-Options
    frameguard: {
      action: "deny",
    },
    // Enable Strict-Transport-Security
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    // Enable X-DNS-Prefetch-Control
    dnsPrefetchControl: {
      allow: false,
    },
    // Enable X-Content-Type-Options
    noSniff: true,
    // Enable X-Permitted-Cross-Domain-Policies
    permittedCrossDomainPolicies: {
      permittedPolicies: "none",
    },
  })
);

/**
 * Global middleware: Custom CORS Handler
 *
 * - Dynamically handles CORS by validating the request's origin against `allowedOrigin`.
 * - Allows cross-origin requests from trusted origins only.
 * - Allows specified request methods only.
 * - Handles preflight (OPTIONS) requests with a 200 OK response.
 * - Rejects unauthorized origins with a 403 Forbidden response.
 * - Rejects unauthorized request methods with a 405 Method Not Allowed response.
 */
const allowedOrigin = process.env.ORIGIN_FRONTEND ?? "*"; // Used for development. This should be switched to an environment variable initialized at runtime for production.

const corsMiddleware: RequestHandler = (req, res, next): void => {
  const requestOrigin = allowedOrigin === "*" ? "*" : req.headers.origin;
  // Allow only specific frontend origins
  if (requestOrigin === allowedOrigin) {
    // Allow POST and OPTIONS requests
    if (["POST", "OPTIONS"].includes(req.method)) {
      // Allows requests only from the specified frontend origin (environment variable ORIGIN_FRONTEND).
      res.setHeader("Access-Control-Allow-Origin", allowedOrigin);

      // Specifies which custom headers can be sent in the request. For example:
      // - Content-Type: Indicates the media type of the request body (e.g., application/json).
      // - Authorization: Often used for passing JWT or Bearer tokens.
      // - x-custom-auth, Signature, Timestamp: Custom headers used for specific application logic or security.
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-custom-auth, Signature, Timestamp"
      );

      // Allow credentials to be sent with the request
      // Enables cookies, authorization headers, or TLS client certificates to be included in the request.
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // Responds to the browser's preflight request (OPTIONS method) to confirm that the actual request is allowed.
      if (req.method === "OPTIONS") {
        res.sendStatus(200); // Send a 200 OK response for preflight
        return;
      }

      next(); // Proceed to the next middleware or route handler
      return;
    } else {
      // Block requests with unsupported methods
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }
  } else {
    // Reject requests from origins that are not allowed according to the CORS policy.
    res
      .status(403)
      .json({ message: "Forbidden: CORS policy blocked this request." });
    return;
  }
};

app.use("/", corsMiddleware);

/**
 * Global middleware: `express.json()`
 *
 * Parses incoming requests with JSON payloads.
 *
 * Features:
 * - Automatically parses `Content-Type: application/json` requests and populates `req.body` with the parsed data.
 * - Handles invalid JSON gracefully by returning a 400 Bad Request response.
 *
 * Advantages:
 * - Simplifies the handling of JSON payloads in HTTP requests.
 * - Reduces boilerplate code for parsing request bodies manually.
 * - Essential for APIs or routes where JSON input is expected (e.g., GraphQL requests or RESTful APIs).
 *
 * Drawbacks of Not Using It:
 * - Requires manual parsing of JSON payloads using `JSON.parse(req.body)`, which is error-prone and inefficient.
 * - Missing or incorrect JSON parsing can lead to application crashes or improper handling of user input.
 */
app.use(express.json());

/**
 * "/graphql" endpoint middleware: Rate limiter
 */
const graphqlRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * "/graphql" endpoint middleware: JWT validation
 *
 * Skipped for now, implemented as a placeholder for best practice.
 * This may not be necessary for a public endpoint but can be useful to have
 * readily available in the code when adding private endpoints in the future.
 * Uses jsonwebtoken:
 * - https://www.npmjs.com/package/jsonwebtoken
 * - https://www.npmjs.com/package/@types/jsonwebtoken
 *
 * THE COMMENTED CODE IN THIS METHOD HAS INCOMPLETE TYPE DEFINITIONS.
 *
 * @param {Request} req - The incoming HTTP request
 * @param {Response} res - The outgoing HTTP response
 * @param {NextFunction} next - Function to pass control to the next middleware
 */
const validateToken = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // const token = req.cookies?.accessToken; // Extract token from cookies
  // if (!token) {
  //   res.status(401).json({ message: "Token missing" });
  //   return;
  // }
  // jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ message: "Invalid token" });
  //   }
  //   req.user = decoded; // Temporary cast for demonstration
  next(); // Proceed to the next middleware or route handler
  // });
};

// GraphQL Yoga server setup
const yoga: YogaServerInstance<object, object> = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

app.use("/graphql", graphqlRateLimiter, validateToken, yoga);

/**
 * Catch-all middleware for handling undefined routes.
 * Returns a 404 status with a JSON error message.
 * Must be the last middleware in the stack.
 */
app.use((_, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

const createServer = (customPort?: string): Promise<Server> => {
  const port: string = customPort ?? process.env.PORT ?? "3000";
  return new Promise((resolve, reject) => {
    const server: Server<typeof IncomingMessage, typeof ServerResponse> =
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}/graphql`);
        setServer(server);
        resolve(server);
      });

    server.on("error", (err) => {
      reject(err);
    });
  });
};

let server: Server | null = null;
/**
 * The createServer function returns a Promise, ensuring the server can
 * handle requests before use. In the test environment, the beforeAll hook
 * uses this Promise to start the server on a dynamically assigned port and
 * waits for it to initialize, preventing race conditions.
 *
 * The check for process.env.NODE_ENV !== "test" bypasses automatic server
 * startup during tests. Instead, the beforeAll hook calls createServer,
 * allowing tests to manage initialization, assign dynamic ports, and handle
 * cleanup afterward.
 */
if (process.env.NODE_ENV !== "test") {
  void createServer().then((api) => {
    server = api;
  });
}

// Signal handlers for graceful shutdown
setupSignalHandlers();

export { app, server, createServer };
