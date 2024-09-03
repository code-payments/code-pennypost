# Pennypost API

This package contains the binary network protocol between the frontend and
backend. The protocol is defined using [Protocol
Buffers](https://developers.google.com/protocol-buffers) and is compiled into
TypeScript source files. If you'd like to make changes to the protocol, you can
do so by editing the `.proto` files in the `proto` directory.

## Getting Started

After making changes to the `.proto` files, you can run the following command to
generate the TypeScript source files:

```bash
npm run gen
```

The files will be generated in the `src` directory. Which is imported as an npm
package in the `backend` and `frontend` packages.

## HTTP/1 First Design

One notable implementation feature of Pennypost is that we don't force the
useage of websockets or sockets for services, as is usually the case with 
`gRPC` or `es-connect`. By avoiding `HTTP/2`, we can take advantage of 
traditional load balancing infrastructure. This is the same pattern used 
by the Code SDK.

The protocol is defined in the [network.proto](https://github.com/code-payments/code-pennypost/blob/main/packages/api/proto/network.proto) file.

Example:

```bash

grpc-response: api.UserGetResponse
00000000: 1249 0a19 636d 3067 7474 6479 3230 3030  .I..cm0gttdy2000
00000010: 3075 3530 7a67 6932 746d 6376 3512 2c46  0u50zgi2tmcv5.,F
00000020: 3972 7441 5a32 5642 4d64 7662 7563 3358  9rtAZ2VBMdvbuc3X
00000030: 6578 5844 5850 4645 594d 4a41 7a45 6575  exXDXPFEYMJAzEeu
00000040: 5036 4639 706f 4167 4a50 0067              P6F9poAgJPg

{
  "user": {
    "id": "cm0gttdy20000u50zgi2tmcv5",
    "codeAddress": "F9rtAZ2VBMdvbuc3XexXDXPFEYMJAzEeuP6F9poAgJPg"
  }
}

2024-09-03T18:26:57.224Z: POST /user/get 200 -60ms

grpc-request: api.PostCreateRequest
00000000: 0a00 12f4 0b3c 6831 3e68 656c 6c6f 2c20  .....<h1>hello, 
00000010: 776f 726c 643c 2f68 313e 3c70 3e54 6865  world</h1><p>The
00000020: 2073 746f 7279 2074 616b 6573 2070 6c61   story takes pla
00000030: 6365 2069 6e20 616e 2069 6d61 6769 6e65  ce in an imagine
00000040: 6420 6675 7475 7265 2e20 5468 6520 6375  d future. The cu
00000050: 7272 656e 7420 7965 6172 2069 7320 756e  rrent year is un
00000060: 6365 7274 6169 6e2c 2062 7574 2062 656c  certain, but bel
00000070: 6965 7665 6420 746f 2062 6520 3139 3834  ieved to be 1984

...
(truncated 1529 to 128 bytes)

grpc-response: api.PostCreateResponse
00000000: 1219 636d 306d 726a 6277 3830 3030 3079  ..cm0mrjbw80000y
00000010: 3074 6267 3074 6f6e 7876 701a 0f30 3531  0tbg0tonxvp..051
00000020: 2f68 656c 6c6f 2d77 6f72 6c64            /hello-world

{
  "id": "cm0mrjbw80000y0tbg0tonxvp",
  "slug": "051/hello-world"
}
```

## Getting Help

If you have any questions or need help integrating Code into your website or
application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp)
or [Twitter](https://twitter.com/getcode).
