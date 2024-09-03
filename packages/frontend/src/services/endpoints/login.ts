import * as proto from "@code-pennypost/api";
import { rpc } from "../service";

const url = () => `/login`;
const service = proto.LoginIntentService.methods;

const create = async (req: proto.LoginIntentCreateRequest) => {
  return rpc(url(), '/create', service.create, req);
};

export {
  create,
};