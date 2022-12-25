import { useRoutes } from 'react-router-dom';
import React, {useState} from 'react';
import {Spin } from 'antd';
import routers from './router'
import * as IndexedDB from "./util/IndexedDB";
import styles from "./App.css";

export default props => {
    const [started, setStarted] = useState(false);
    IndexedDB.openDB(setStarted);
    return started ? useRoutes(routers) : <div><Spin style={{width: "100%", marginTop: "15%"}} tip={"系统启动中..."}/></div>;
}