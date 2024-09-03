import * as proto from "@code-pennypost/api";
import { rpc } from "../service";

const url = () => `/user`;
const service = proto.UserService.methods;

const session = async (req: proto.UserSessionRequest) => {
  return rpc(url(), '/session', service.session, req);
};

const get = async (req: proto.UserGetRequest) => {
  return rpc(url(), '/get', service.get, req);
};

const profile = async (req: proto.UserGetPublicProfileRequest) => {
  return rpc(url(), '/profile', service.getPublicProfile, req);
}

const update = async (req: proto.UserUpdateRequest) => {
  return rpc(url(), '/update', service.update, req);
}

export {
  get,
  profile,
  session,
  update,
};