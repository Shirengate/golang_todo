import express, { Request, Express, Response } from "express";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from TypeScript Express server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
