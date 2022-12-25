import provinces from "china-division/dist/provinces";
import cities from "china-division/dist/cities";
import areas from "china-division/dist/areas";

export const getAreaByName = name => {
    if(!name){
        return [];
    }
    let city = cities.find(item => item.name.includes(name));
    if(city){
        return [city.provinceCode, city.code];
    }
    let province = provinces.find(item => item.name.includes(name));
    if(province){
        return [province.code];
    }
    let area = areas.find(item => item.name.includes(name));
    if(area){
        return [area.provinceCode, area.cityCode, area.code];
    }
    return [];
};
export const getAreaNameByCode = codeList => {
    if(!codeList || codeList.length === 0){
        return "-";
    }
    let result = "";
    codeList.map((code, index) => {
        if(index === 0){
            let province = provinces.find(item => item.code.includes(code));
            result += province.name;
        }
        if(index === 1){
            let city = cities.find(item => item.code.includes(code));
            result += "/" + city.name;
        }
        if(index === 2){
            let area = areas.find(item => item.code.includes(code));
            result += "/" + area.name;
        }
    });
    return result;
};