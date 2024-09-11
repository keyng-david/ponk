import {useCallback, useEffect, useRef} from "react";
import {Account, TonProofItemReplySuccess, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {createRequest} from "@/shared/lib/api/createRequest";

export const useConnectTon = () => {
    const firstProofLoading = useRef<boolean>(true)
    const interval = useRef<NodeJS.Timer>()
    const wallet = useTonWallet()
    const [tonConnectUI] = useTonConnectUI()

    const createProofPayload = useCallback(async () => {
        try {
            if (firstProofLoading.current) {
                tonConnectUI.setConnectRequestParameters({ state: "loading" });
                firstProofLoading.current = false;
            }

            const response = await createRequest<{
                payload: string
            }>({
                endpoint: '/api/wallet/generatePayload',
                method: 'GET'
            })

            if (response.payload && response.payload.payload) {
                tonConnectUI.setConnectRequestParameters({
                    state: "ready",
                    value: {
                        tonProof: response.payload.payload,
                    },
                });
            } else {
                tonConnectUI.setConnectRequestParameters(null);
            }
        } catch (e) {
            console.log(e)
        }
    }, [tonConnectUI, firstProofLoading]);

    async function checkProof(
    proof: TonProofItemReplySuccess["proof"],
    account: Account
) {
    try {
        const checkResponse = await createRequest({
            endpoint: '/api/wallet/checkProof',
            method: 'POST',
            body: {  // Change 'data' to 'body'
                address: account.address,
                network: account.chain,
                public_key: account.publicKey,
                proof: {
                    ...proof,
                    domain: {
                        ...proof.domain,
                        length_bytes: proof.domain.lengthBytes,
                    },
                    state_init: account.walletStateInit,
                }
            }
        });

        if (checkResponse.error) {
            await tonConnectUI.disconnect();
            return;
        }
    } catch (e) {
        console.log(`${e}`);
    }
}

    const updateStatusListener = useCallback(() => {
        tonConnectUI.onStatusChange(async v => {
            if (v?.connectItems?.tonProof && 'proof' in v.connectItems.tonProof) {
                await checkProof(v.connectItems.tonProof.proof, v.account)
            }
        })
    }, [tonConnectUI])

    interval.current = setInterval(createProofPayload, 100000)

    const initialize = useCallback(async () => {
        try {
            if (firstProofLoading.current) {
                await createProofPayload()
            }
            updateStatusListener()
            if (!wallet) {
                tonConnectUI.openModal().then()
            }
        } catch (e) {
            console.log(e)
        }
    }, [tonConnectUI, wallet])

    useEffect(() => {
        if (wallet && firstProofLoading.current) {
            initialize().then()
        }
    }, [wallet, initialize]);

    useEffect(() => {
        return () => clearInterval(interval.current)
    }, []);

    return {
        initialize,
    }
}