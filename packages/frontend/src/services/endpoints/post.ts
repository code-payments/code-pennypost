import * as proto from "@code-pennypost/api";
import { rpc } from "../service";

const url = () => `/post`;
const service = proto.PostService.methods;

const create = async (req: proto.PostCreateRequest) => {
  return rpc(url(), '/create', service.create, req);
};

const get = async (req: proto.PostGetRequest) => {
  return rpc(url(), '/get', service.get, req);
};

const getPaginated = async (req: proto.PostGetPaginatedRequest) => {
  return rpc(url(), '/get-paginated', service.getPaginated, req);
};

export {
    create,
    get,
    getPaginated,
};