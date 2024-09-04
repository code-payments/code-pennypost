import * as proto from "@code-pennypost/api";
import { rpc } from "../service";

const url = () => `/tip`;
const service = proto.TipIntentService.methods;

const create = async (req: proto.TipIntentCreateRequest) => {
  return rpc(url(), '/create', service.create, req);
};

export {
  create,
};