import { AnyMessage } from "@bufbuild/protobuf";
import { hexy } from "hexy";
import { cyan, green, magenta, yellow } from "./colors";

const level = process.env.LOG_LEVEL || 'debug';
const maxLength = 128; // 128 bytes

function minLevel(val: string) {
    const levels = ['debug', 'info', 'error'];
    const current = levels.indexOf(level);
    const provided = levels.indexOf(val);
    return provided >= current;
}

function anyMessageToString(body: AnyMessage) {
  const jsonBody = body.toJson();

  const stringBody = JSON.stringify(jsonBody, (key, value) => {
    if (key === "value") {
      return Buffer.from(value, 'base64').toString('hex');
    }
    return value;
  }, 2);

  return stringBody;
}

function grpc_request(methodName: string, body: AnyMessage): void {
    if (minLevel('debug')) {
        console.log(`\n${yellow('grpc-request:')} ${green(methodName)}`)
        const buf = Buffer.from(body.toBinary());
        if (buf.length > maxLength) {
            console.log(`${hexy(buf.slice(0, maxLength))}\n...`);
            console.log(`(truncated ${buf.length} to ${maxLength} bytes)`);
        } else {
            console.log(hexy(buf));
            console.log(anyMessageToString(body));
        }
    }
}

function grpc_response(methodName: string, body: AnyMessage): void {
    if (minLevel('debug')) {
        console.log(`\n${yellow('grpc-response:')} ${green(methodName)}`)
        const buf = Buffer.from(body.toBinary());
        console.log(hexy(buf));
        console.log(anyMessageToString(body));
    }
}

function grpc_error(val: any): void {
    if (minLevel('error')) {
        console.log(`\n${yellow('grpc-error:')}`)
        console.log(val);
        console.log(`\n`);
    }
}

function http_request(opt: { timestamp: string, method: string, path: string, status: number, duration: number }): void {
    if (minLevel('info')) {
        console.log([
            `${cyan(opt.timestamp)}:`,
            `${yellow(opt.method)}`,
            `${green(opt.path)}`,
            `${cyan(opt.status.toString())}`,
            `-${magenta(opt.duration + 'ms')}`
        ].join(' '))
    }
}

export const log = {
    level,
    grpc_request,
    grpc_response,
    grpc_error,
    http_request,
}