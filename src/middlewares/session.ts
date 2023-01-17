import { getUserBySession } from "../controllers/user";
import fp from 'fastify-plugin'
import { FastifyInstance } from "fastify";

export const sessionMiddleware = async (app:any) => {  
  app.decorateRequest("userId", null);
  app.addHook('onRequest', getUserBySession)
};

export default fp(sessionMiddleware)