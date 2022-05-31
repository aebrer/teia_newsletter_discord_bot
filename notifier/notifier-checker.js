import mongoose from 'mongoose'
import { TeiaGraphQL, FxhashGraphQL } from '../queries.js';

import notifySchema from "../schemas/notify-schema.js"

const NotificationList = mongoose.model("notification", notifySchema)

// Initialize Checker Variables
var notifierAddresses = [];
var notifierIndex = 0;


export async function NotifierCheck(){
    
    // If there are no addresses populated (most likely when the bot is just launched)
    if(notifierAddresses.length === 0){
        let _notifiers = await NotificationList.find();
        console.log("checking: populating");
        _notifiers.forEach(_notifier => {
            notifierAddresses.push({
                address: _notifier.address,
                structTeia: JSON.parse(_notifier.structTeia),
                structFxhash: JSON.parse(_notifier.structFxhash)
            });
        })
        console.log(notifierAddresses)

    // If addresses are populated
    }else{
        // Make sure address index is within bounds
        notifierIndex = notifierIndex % notifierAddresses.length;
        let _current = notifierAddresses[notifierIndex];

        // Start Checking for new drops
        console.log("checking " + _current.address + ":")

        // TEIA
        if(_current.structTeia.users.length > 0 || _current.structTeia.tags.length > 0){
            console.log("checking: teia")
            let _responseTeia = await TeiaGraphQL(_current.address);
            if(_responseTeia){
                let _tokenTeia = _responseTeia.data.hic_et_nunc_token[0];
                var _timestampTeia = Date.parse(_tokenTeia.timestamp);
                if(_timestampTeia > Date.parse(_current.structTeia.timestamp)){
                    // TODO: NEW THING!! NOTIFY!!
                    console.log("new thing just dropped");
                    let _name = _responseTeia.creator.name;
                    let _objktId = _responseTeia.id;
                }else{
                    console.log("nothing new");
                }
            }
        }

        // FX HASH
        if(_current.structFxhash.users.length > 0 || _current.structFxhash.tags.length > 0){
            console.log("checking: fxhash")
            let _responseFxhash = await FxhashGraphQL(_current.address);
            if(_responseFxhash){
                let _tokenFxhash = _responseFxhash.data.user.generativeTokens[0];
                var _timestampFxhash = Date.parse(_tokenFxhash.createdAt);
                if(_timestampFxhash > Date.parse(_current.structFxhash.timestamp)){
                    // TODO: NEW THING!! NOTIFY!!
                    console.log("new thing just dropped");
                    let _name = _responseFxhash.data.user.name;
                    let _objktId = _tokenFxhash.id;
                }else{
                    console.log("nothing new");
                }
            }
        }

        notifierIndex++;
    }

    // Execute the function again after 8 seconds
    setTimeout(NotifierCheck, 8000);
}