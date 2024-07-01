import React, { useEffect } from "react";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Counter } from "../contracts/counter";
import { Address, OpenedContract } from "@ton/core";
import useTonConnect from "./useTonConnect";

const useCounterContract = () => {
  const client = useTonClient();
  const [val, setVal] = React.useState<null | number>();
  const { sender } = useTonConnect();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Counter(
      Address.parse("EQBEqN5Hx66S1SKuQNVVVuFb34Igmz0_boL_-n5M4yWB0XMK")
    );

    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    (async () => {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    })();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: () => {
      return counterContract?.sendIncrement(sender);
    },
  };
};

export default useCounterContract;
