
const FieldEnum = {
    //自身情况
    name: {
        code: "name",
        desc: "姓名"
    },
    sex: {
        code: "sex",
        desc: "性别"
    },
    age: {
        code: "age",
        desc: "出生年月"
    },
    zodiac: {
        code: "zodiac",
        desc: "生肖"
    },
    height: {
        code: "height",
        desc: "身高(cm)"
    },
    weight: {
        code: "weight",
        desc: "体重(kg)"
    },
    work: {
        code: "work",
        desc: "工作"
    },
    educational: {
        code: "educational",
        desc: "文化程度"
    },
    income: {
        code: "income",
        desc: "月收入（k）"
    },
    character: {
        code: "character",
        desc: "性格"
    },
    maritalStatus: {
        code: "maritalStatus",
        desc: "婚史"
    },
    familyChildren: {
        code: "familyChildren",
        desc: "家庭成员情况"
    },
    housingSituation: {
        code: "housingSituation",
        desc: "房（有/无）"
    },
    hasCar: {
        code: "hasCar",
        desc: "车（有/无）"
    },
    hasChild:{
        code: "hasChild",
        desc: "有无小孩"
    },
    location: {
        code: "location",
        desc: "目前所在地"
    },
    telephone: {
        code: "telephone",
        desc: "电话"
    },
    image: {
        code: "image",
        desc: "照片"
    },
    //另一个的要求
    otherAge: {
        code: "otherAge",
        desc: "年龄1"
    },
    otherHeight: {
        code: "otherHeight",
        desc: "身高（cm）1"
    },
    otherWeight: {
        code: "otherWeight",
        desc: "体重（kg）1"
    },
    otherIncome: {
        code: "otherIncome",
        desc: "月收入（k）1"
    },
    otherMaritalStatus: {
        code: "otherMaritalStatus",
        desc: "婚史1"
    },
    otherFamilyChildren: {
        code: "otherFamilyChildren",
        desc: "家庭成员情况1"
    },
    otherHousingSituation: {
        code: "otherHousingSituation",
        desc: "房（有/无）1"
    },
    otherHasCar: {
        code: "otherHasCar",
        desc: "车（有/无）1"
    },
    otherLocation: {
        code: "otherLocation",
        desc: "目前所在地1"
    },
    otherEducational: {
        code: "otherEducational",
        desc: "文化程度1"
    },otherHasChild : {
        code: "otherHasChild",
        desc: "有无小孩1"
    },

    getCodeByDesc: desc => {
        if(!desc){
            return "";
        }
        return Object.values(FieldEnum).filter(item => typeof(item) !== 'function').find(item => desc.trim().endsWith(item.desc))?.code;
    }

}
export default FieldEnum;