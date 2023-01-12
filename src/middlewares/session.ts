import { getUserBySession } from "../controllers/user";
import fp from 'fastify-plugin'

export const generateSession = async (app:any) => {  
  app.decorateRequest("userId", null);
  app.addHook('onRequest', getUserBySession)
};

export default fp(generateSession)