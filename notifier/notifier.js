import mongoose from 'mongoose'

import notifySchema from "../schemas/notify-schema.js"

const NotificationList = mongoose.model("notification", notifySchema)

// NotifyAdd Command
export async function NotifierAdd(_user, _platform, _address, _tag = ""){
    let _hasAddress = false;
    notifierAddresses.forEach(_not => {
        if(_not.address === _address){
            _hasAddress = true;
        }
    })
    if(!_hasAddress){
        console.log("adding: new index");
        await NotifierCreate(_user, _platform, _address, _tag);
    }else{
        let _notifier = await NotificationList.find({address: _address});
        console.log("adding: updating");
        console.log(_notifier);
    }
}

// First-time Notifier Creation
export async function NotifierCreate(_user, _platform, _address, _tag = null){
    let _timestamp = new Date(Date.now()).toISOString();
    let _structTeia = { timestamp: _timestamp, users: [], tags: [] };
    let _structFxhash = { timestamp: _timestamp, users: [], tags: [] };
    if(_tag !== null){
        if(_platform === "teia") _structTeia.users.push(_user);
        else _structFxhash.users.push(_user);
    }else{
        let _tagStruct = {
            tag: _tag,
            users: [_user]
        }
        if(_platform === "teia") _structTeia.tags.push(_tagStruct);
        else _structFxhash.tags.push(_tagStruct);
    }
    const _notifier = new NotificationList({
        address: _address,
        structTeia: JSON.stringify(_structTeia),
        structFxhash: JSON.stringify(_structFxhash),
    })
    await _notifier.save();
}