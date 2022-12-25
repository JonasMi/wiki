//db config
import {message} from 'antd';
let DB_NAME = "Index_DB";
let DB = undefined;
let DB_VERSION = 1;
export const openDB = callback => {
    if(DB){
        return;
    }
    let request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = event => {
        DB = event.target.result;
        setTimeout(() => {
            console.log("系统启动成功...")
            callback && callback(true);
        },500);
    };
    request.onerror = event => {
        message.error("open db error")
    };
    request.onupgradeneeded = event => {
        DB = event.target.result;
        if(!DB.objectStoreNames.contains("member")){
            let objectStore = DB.createObjectStore("member", { keyPath : "id", autoIncrement: true });
            objectStore.createIndex("name", "name", {unique: false});
            objectStore.createIndex("telephone", "telephone", {unique: true});
        }
    };
};

export const insert = (tableName, params) => {
    if(!tableName || !params){
        return;
    }
    let transaction = DB.transaction([tableName], "readwrite");
    transaction.onerror = function(event) {
        console.log("新增数据出错=", event);
        message.error("添加数据错误,请检查电话号码是否已经注册过");
    };
    let objectStore = transaction.objectStore(tableName);
    return objectStore.add(params);
};
export const update = (tableName, params) => {
    if(!tableName || !params){
        return;
    }
    let transaction = DB.transaction([tableName], "readwrite");
    transaction.onerror = function(event) {
        console.log("更新数据出错=", event);
        message.error("更新数据错误，请检查电话号码是否已经注册过");
    };
    let objectStore = transaction.objectStore(tableName);
    return objectStore.put(params);
};
export const deleteByKeyPath = (tableName, keyPath, callback) => {
    if(!keyPath){
        return;
    }
    let request = DB.transaction([tableName], "readwrite")
        .objectStore(tableName)
        .delete(keyPath);
    request.onsuccess = function(event) {
        callback && callback();
    };
    request.onerror = function(event) {
        console.log("删除失败:", event);
        message.error("删除数据失败");
    }
};

export const findByKeyPath = (tableName, keyPath) => {
    if(!keyPath){
        return;
    }
    return DB.transaction(tableName).objectStore(tableName).get(keyPath);
};

export const findAll = (tableName, callback) => {
    if(!tableName){
        return;
    }
    let objectStore = DB.transaction(tableName).objectStore(tableName);
    let request = objectStore.openCursor();
    console.log("request==", request);
    return request;
};

export const clearDB = tableName => {
    if(!tableName){
        return;
    }
    let objectStore = DB.transaction([tableName], "readwrite").objectStore(tableName);
    let request = objectStore.clear();
    request.onsuccess = event => {
        message.success(`清空表${tableName}成功!`);
    }
    request.onerror = event => {
        console.log("event", event);
        message.error(`清空表${tableName}失败!`);
    }
}

