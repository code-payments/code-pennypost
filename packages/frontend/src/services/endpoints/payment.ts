import * as proto from "@code-pennypost/api";
import { rpc } from "../service";

const url = () => `/payment`;
const service = proto.PaymentIntentService.methods;

const create = async (req: proto.PaymentIntentCreateRequest) => {
  return rpc(url(), '/create', service.create, req);
};

export {
  create,
};