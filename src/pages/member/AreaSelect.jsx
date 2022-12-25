import React, {useEffect, useState} from 'react';
import {Cascader} from 'antd';
import provinces from "china-division/dist/provinces";
import cities from "china-division/dist/cities";
import areas from "china-division/dist/areas";

export default ({value, onChange}) => {

    const [list, setList] = useState([]);
    useEffect(() => {
        let a = [];
        provinces.forEach(pro => {
            let p = {value: pro.code, label: pro.name, children: []};
            cities.forEach(ct => {
                if(ct.provinceCode === p.value){
                    let c = {value: ct.code, label: ct.name, children: []};
                    areas.forEach(ar => {
                        if(ar.cityCode === c.value && ar.provinceCode === p.value){
                            let a = {value: ar.code, label: ar.name};
                            c.children.push(a);
                        }
                    });
                    p.children.push(c);
                }
            });
            a.push(p);
        });
        setList(a);
    }, []);
    const handleOnChange = value => {
        onChange && onChange(value);
    };
    return <Cascader multiple={true} value={value} allowClear={true} changeOnSelect={true} showSearch={true} options={list} onChange={handleOnChange} placeholder="请选择地址" />
}