"use client";

import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance, useReadContract, useSignMessage, useWriteContract } from "wagmi";

import { DeployTokenizedBallot } from "~~/components/voting-dapp/DeployTokenizedBallot";
import { CastVotes } from "~~/components/voting-dapp/CastVotes";
import { ViewVotes } from "~~/components/voting-dapp/ViewVotes";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Voting dApp</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <WalletInfo></WalletInfo>
      {/*<RandomWord></RandomWord> */}
    </>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        {/*
        <WalletAction></WalletAction>
        <WalletBalance address={address as `0x${string}`}></WalletBalance>

        <TokenInfo address={address as `0x${string}`}></TokenInfo>
        */}
        <ApiData address={address as `0x${string}`}></ApiData>
        <DelegateVotes address={address as `0x${string}`}></DelegateVotes>
        <DeployTokenizedBallot></DeployTokenizedBallot>
        <CastVotes></CastVotes>
        <ViewVotes></ViewVotes>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isPending, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

//
function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useReadContract wagmi hook</h2>
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
      </div>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useReadContract({
    address: "0x37dBD10E7994AAcF6132cac7d33bcA899bd2C660",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0x0DDA38cd51ED99468194108A6e080D0e73bC95C2",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = data ? Number(data) : 0;
  //const balance = typeof data === "number" ? data : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}

function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">API Coupling</h2>
        <TokenAddressFromApi></TokenAddressFromApi>
        <p>MINTING FUNCTION</p>
        <RequestTokens address={params.address}></RequestTokens>

        <p><strong>VOTE RESULTS</strong></p>
        <GetProposalsFromApi></GetProposalsFromApi>
        <WinningProposalFromApi></WinningProposalFromApi>
      </div>
    </div>
  );
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/contract-address")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address from API: {data.result}</p>
    </div>
  );
}

function RequestTokens(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean; message: string; transactionHash: string }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address, amount: 2 };

  if (isLoading) return <p>Requesting tokens from API...</p>;
  if (!data)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then(res => res.json())
            .then(data => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Request tokens
      </button>
    );

  return (
    <div>
      <p>Result from API: {data.result ? "worked" : "failed"}</p>
      <p>Message: {data.message ? data.message : "error"}</p>
      <p>Tx Hash: {data.transactionHash ? data.transactionHash : "error"}</p>
    </div>
  );
}
function DelegateVotes(params: { address: `0x${string}` }) {
  const [delegateAddress, setdelegateAddress] = useState("");
  const { data, isError, isPending, isSuccess, writeContract } = useWriteContract();

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Delegating votes</h2>
        <CurrentDelegate address={params.address}></CurrentDelegate>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the address to delegate to:</span>
          </label>
          <input
            type="text"
            placeholder="0x...."
            className="input input-bordered w-full max-w-xs"
            value={delegateAddress}
            onChange={e => setdelegateAddress(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            writeContract({
              abi: [
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "delegatee",
                      type: "address"
                    }
                  ],
                  name: "delegate",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function"
                },
              ],
              // TODO: get this address from API
              address: "0x3c9d658a9b358cf1985bc52c5476229e8b186f1f",
              functionName: 'delegate',
              args: [delegateAddress],
            })
          }
        >
          Delegate
        </button>
        {isSuccess && <div>Transaction hash: <a href={`https://sepolia.etherscan.io/tx/${data}`} target="_blank">{data}</a></div>}
        {isError && <div>Error writing contract</div>}
      </div>
    </div>
  );
}

function CurrentDelegate(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    // TODO: get this address from API
    address: "0x3c9d658a9b358cf1985bc52c5476229e8b186f1f",
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "delegates",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ],
    functionName: "delegates",
    args: [params.address],
  });

  if (isLoading) return <div>Fetching delegate…</div>;
  if (isError) return <div>Error fetching delegate</div>;
  // TODO: it would be cool for this to update after each `delegate` transaction
  return <div>Current Delegate: {data.toString()}</div>;
}

// WIP: to add other proposals & re-organize
function GetProposalsFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/recent-votes/3")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Donuts votes: {data.result}</p>
    </div>
  );
}
// WIP End

function WinningProposalFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/winning-proposal")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Winning Proposal from API: {data.result}</p>
    </div>
  );
}

export default Home;
