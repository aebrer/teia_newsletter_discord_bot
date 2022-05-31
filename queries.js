import fetch from 'node-fetch';

const notifierInfo = {
    teia: {
        url: "https://api.hicdex.com/v1/graphql",
        query: `
            query Check($userId: String) {
                hic_et_nunc_token(where: {creator: {address: {_eq: $userId}}}, order_by: {id: desc}, limit: 1) {
                    id
                    timestamp
                    title
                    swaps {
                        amount_left
                    }
                    supply
                    creator {
                        name
                    }
                }
            }   
        `
    },
    fxhash: {
        url: "https://api.fxhash.xyz/graphql",
        query: `
            query Check($userId: String) {
                user(id: $userId) {
                    name
                    generativeTokens(take: 1) {
                        id
                        name
                        supply
                        balance
                        createdAt
                    }
                }
            }  
        `
    }
}

export async function TeiaGraphQL(_address){
    const _result = await fetch(
        notifierInfo.teia.url,
        {
            method: "POST",
            body: JSON.stringify({
                query: notifierInfo.teia.query,
                variables: {userId: _address}
            })
        }
    );

    return await _result.json();
}

export async function FxhashGraphQL(_address){
    const _result = await fetch(
        notifierInfo.fxhash.url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: notifierInfo.fxhash.query,
                variables: {userId: _address}
            })
        }
    );

    return await _result.json();
}