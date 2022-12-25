import * as IndexedDB from "../../util/IndexedDB";

const tableName = "member";
const dataList = [];
export const save = (params, callback) => {

    let request = IndexedDB.insert(tableName, params);
    request.onsuccess = (event) => {
        params.creatTime = new Date();
        params.id = event.target.result;
        dataList.push(params);
        callback && callback();
    };
};

export const batchInsert = params => {
   let num  = 20000;
   for(let i = 0; i < num; i++){
       delete  params.id;
       params.sex = (i % 2 === 1) ? "男" : "女";
       params.telephone = i + 1 + "";
       let request = IndexedDB.insert(tableName, params);
       request.onsuccess = event => {
           console.log("插入数据成功" + (i + 1));
       }
   }
};

export const update = params => {
    dataList.forEach((item, index) => {
       if(params.id === item.id){
           dataList[index] = params;
       }
    });
    return IndexedDB.update(tableName, params);
};

export const deleteById = (id, callback) => {
    let currentIndex = 0;
    dataList.forEach((item, index) => {
       if(id === item.id){
           currentIndex = index;
       }
    });
    dataList.splice(currentIndex, 1);
    return IndexedDB.deleteByKeyPath(tableName, id, callback);
};

export const findByDynamic = (params, callback) => {
    let resultList = [];
    let startTime = (new Date()).getTime();
    //如果初始化数据走缓存
    if(dataList.length > 0){
        dataList.forEach(item => {
            if(itemMatch(item, params)){
                resultList.push(item);
            }
        });
        let endTime = (new Date()).getTime();
        console.log("查询耗时==", endTime - startTime);
        let pageList = getPageInfo(params.page, params.pageSize, resultList);
        callback(pageList);
    } else {
        //第一次加载
        IndexedDB.findAll(tableName).onsuccess = event => {
            let cursor = event.target.result;
            if(cursor){
                let data = cursor.value;
                //历史location 数据兼容 支持多选
                adaptLocation(data);
                adaptInterval(data);
                dataList.push(data);
                if(itemMatch(data, params)){
                    resultList.push(data);
                }
                cursor.continue();
            }else{
                let endTime = (new Date()).getTime();
                console.log("查询耗时==", endTime - startTime);
                let pageList = getPageInfo(params.page, params.pageSize, resultList);
                callback(pageList);
            }
        };
    }

};




export const clearDB = () => {
    IndexedDB.clearDB(tableName);
};


const itemMatch = (item, params) => {
    if(!item){
        return false;
    }
    let matchTracker = {
        successNum: 0,
        failNum: 0
    };
    if (params.sex && item.sex !== params.sex) {
        return false;
    }
    if(params.maritalStatus && item.maritalStatus !== params.maritalStatus){
        return false;
    }
    if(params.name && item.name !== params.name){
        return false;
    }
    if(params.telephone && Number(item.telephone) !== params.telephone){
        return false;
    }
    if(params.status && item.status !== params.status){
        return false;
    }
    if(params.hasChild && item.hasChild !== params.hasChild){
        return false;
    }
    //年龄比较
    matchInterval(Math.floor(((new Date()).getTime() - item.age) / (24 * 3600 * 1000 * 365)), params.age, matchTracker, compareInterval, 1);
    //身高比较
    matchInterval(item.height, params.height, matchTracker, compareInterval, isMan(item) ? 1 : 2);
    //体重比较
    matchInterval(item.weight, params.weight, matchTracker, compareInterval, 1);
    //收入比较
    matchInterval(item.income, params.income, matchTracker, compareInterval, isMan(item) ? 1 : 2);
    //学历比较
    matchInterval(item.educational, params.educational, matchTracker, compareIncludes, 1);
    //婚姻状况比较
    matchInterval(item.maritalStatus, params.maritalStatus, matchTracker, compareEquals, 1);
    //车比较
    matchInterval(item.hasCar, params.hasCar, matchTracker, compareEquals, isMan(item) ? 1 : 2);
    //房比较
    matchInterval(item.housingSituation, params.housingSituation, matchTracker, compareEquals, isMan(item) ? 1 : 2);
    //地址比较
    matchInterval(item.location, params.location, matchTracker, compareMultipleLocation);
    //有无小孩
    matchInterval(item.hasChild, params.hasChild, matchTracker, compareEquals);
    item.ratio = matchTracker.successNum / (matchTracker.successNum + matchTracker.failNum);
    item.ratio = Number(item.ratio.toFixed(2));
    return (!params.ratio) || (item.ratio > 0 && Number(item.ratio.toFixed(2)) >= params.ratio / 100);
};

const isMan = (item)=> {
    return item.sex === '男';
};


/**
 * 区间比较
 * @param value
 * @param standardValue
 * @param matchTracker
 * @param compare
 */
const matchInterval = (value, standardValue, matchTracker, compare, weight) => {
    if(!standardValue && standardValue?.length === 0){
        matchTracker.successNum += weight ? weight : 1;
        return;
    }
    if (compare(value, standardValue)) {
        matchTracker.successNum += weight ? weight : 1;
    } else {
        matchTracker.failNum += weight ? weight : 1;
    }
};


const getPageInfo = (page, pageSize, list) => {
    let startTime = (new Date()).getTime();
    list.sort((x, y) => y.ratio - x.ratio);
    let endTime = (new Date()).getTime();
    console.log("排序耗时==", endTime - startTime);
    let from = (page - 1) * pageSize;
    let to = page * pageSize - 1;
    if(!list || list?.length < from){
        return empty(list);
    }
    let result = [];
    for(let i = from; i <= to && i < list.length; i++ ){
        result.push(list[i]);
    }
    let length = list.length;
    list = null;
    return {
        total: length,
        list: result
    }
};
const empty = (list)=> {
    return {
        total: list.length,
        list: []
    }
}
/**
 * 区间比较
 * @param a
 * @param b
 * @returns {boolean}
 */
const compareInterval = (a, b) => {
    if (!b || b.length === 0) {
        return true;
    }
    if (b.length === 1) {
        return a >= b[0];
    }
    return a >= b[0] && a <= b[1];
};

const compareIncludes = (a, b) => {
    if (!b || b.length === 0) {
        return true;
    }
    return b.includes(a);
};
const compareEquals = (a, b) => {
    if (!b) {
        return true;
    }
    return a === b;
};

const compareMultipleLocation = (a, b) => {
    let flag = false;
    if (!b || b.length === 0) {
        return true;
    }
    if (!a || a.length === 0) {
        return false;
    }
    b.forEach(_b => {
        a.forEach(_a => {
            //有一个条件能匹配上，就匹配
            if(compareLocation(_a, _b)){
                flag = true;
            }
        })
    });
    return flag;
};

const compareLocation = (a, b) => {
    if (!b || b.length === 0) {
        return true;
    }
    if (!a || a.length === 0) {
        return false;
    }
    if (b.length > a.length) {
        return false;
    }
    let match = true;
    b.forEach(code => {
        if(!a.includes(code)){
            match = false;
        }
    });
    return match;
};

const adaptLocation = item => {
    if(item?.location?.length > 0 && isString(item?.location[0])){
        item.location = [item.location];
    }
    if(item?.otherLocation?.length > 0 && isString(item?.otherLocation[0])){
        item.otherLocation = [item.otherLocation];
    }
};
const adaptInterval = item => {
    if(item?.otherAge?.length === 1 || (item?.otherAge?.length === 2 && !item?.otherAge[1])){
        item.otherAge = [item.otherAge[0], 90];
    }
    if(item?.otherHeight?.length === 1 || (item?.otherHeight?.length === 2 && !item?.otherHeight[1])){
        item.otherHeight = [item.otherHeight[0], 220];
    }
    if(item?.otherWeight?.length === 1 || (item?.otherWeight?.length === 2 && !item?.otherWeight[1])){
        item.otherWeight = [item.otherWeight[0], 150];
    }
    if(item?.otherIncome?.length === 1 || (item?.otherIncome?.length === 2 && !item?.otherIncome[1])){
        item.otherIncome = [item.otherIncome[0], 100];
    }
};

const isString = value => {
    if(!value){
        return false;
    }
    return typeof value === 'string'
};