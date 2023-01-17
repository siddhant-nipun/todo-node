import { FastifyRequest } from "fastify";

export interface FastifyRequestWithUserId extends FastifyRequest {
  userId: string;
}
