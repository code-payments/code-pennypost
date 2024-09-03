import * as web3 from '@solana/web3.js';

const program = new web3.PublicKey('time2Z2SCnn3qYg3ULKVtdkh8YmZ5jFdKicnA1W2YnJ')
const mint = new web3.PublicKey('kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6')
const payer = new web3.PublicKey('codeHy87wGD5oMRLG75qKqsSi1vWE3oxNyYmXo5F9YR')

export function getTimelockStatePda(owner: string) : [web3.PublicKey, number] {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("timelock_state"),
      mint.toBuffer(),
      payer.toBuffer(),
      new web3.PublicKey(owner).toBuffer(),
      Buffer.from([0x15]),
    ],
    program
  )
}

export function getTimelockVaultPda(timelock: string) : [web3.PublicKey, number] {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("timelock_vault"),
      new web3.PublicKey(timelock).toBuffer(),
      Buffer.from([0x03]),
    ],
    program
  )
}