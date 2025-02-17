const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://subcena.com";

export default baseUrl;
