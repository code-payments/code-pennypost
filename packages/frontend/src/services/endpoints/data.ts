import * as proto from "@code-pennypost/api";
import { rpc } from "../service";

const url = () => `/data`;
const service = proto.DataService.methods;

const upload = async (req: proto.DataUploadRequest) => {
  return rpc(url(), '/upload', service.upload, req);
} 

const getFull = async (req: proto.DataGetFullRequest) => {
  return rpc(url(), '/get/post', service.getFullPost, req);
};

const getPreview = async (req: proto.DataGetPreviewRequest) => {
  return rpc(url(), '/get/post-preview', service.getPreviewPost, req);
};

export {
  upload,
  getPreview,
  getFull,
};