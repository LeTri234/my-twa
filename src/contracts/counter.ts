import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';


export class Counter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createForDeploy (code: Cell, initialCounterValue: number): Counter {
        const data = beginCell().storeUint(initialCounterValue, 64).endCell();

        const workchain = 0;
        const address = contractAddress(workchain, { code, data });

        return new Counter(address, { code, data });

    }


    async sendDeploy (provider: ContractProvider, sender: Sender) {
        await provider.internal(sender, {
            value: "0.01",
            bounce: false
        })
    }

    async getCounter (provider: ContractProvider) {
        const { stack } = await provider.get('counetr', [])
        return stack.readBigNumber()
    }

    async sendIncrement (provider: ContractProvider, sender: Sender) {
        const message = beginCell().storeUint(1, 32).storeUint(0, 64).endCell()
        await provider.internal(sender, {
            value: '0.001',
            body: message,
            sendMode: SendMode.PAY_GAS_SEPARATELY
        })
    }



}   
