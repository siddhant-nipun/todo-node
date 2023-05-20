import { getUserByJWT } from "../controllers/user";
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

const authMiddleware = async (app: any) => {
  app.decorateRequest("userId", null);
  app.addHook("onRequest", getUserByJWT);
};

export default fp(authMiddleware);
