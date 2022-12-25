import React, {useState} from 'react';
import {Col, Layout, Menu, Row} from 'antd';
import {Link, Outlet} from "react-router-dom";
import {TeamOutlined,FontSizeOutlined} from '@ant-design/icons';
import logo from "../image/logo.jpeg";
import incomeImage from "../image/income.jpeg";
import travelImage from "../image/travel.jpeg";
import lifeImage from "../image/life.jpeg";
import artImage from "../image/art.jpeg";
import technologyImage from "../image/technology.jpeg";
import "./index.css";
const {Content, Sider, Header} = Layout;
const items = [
    {
        label: <Link to='/technology'><span>技术百科</span></Link>,
        key: "/technology",
        icon: <img style={{width: "8px", height: "15px", borderRadius: "35px"}} src={technologyImage}/>
    },
    {
        label: <Link to='/economics'><span>经济百科</span></Link>,
        key: "/economics",
        icon: <img style={{width: "8px", height: "15px", borderRadius: "35px"}} src={incomeImage}/>
    },
    {
        label: <Link to='/travel'><span>旅游百科</span></Link>,
        key: "/travel",
        icon: <img style={{width: "8px", height: "15px", borderRadius: "35px"}} src={travelImage}/>
    },
    {
        label: <Link to='/life'><span>生活百科</span></Link>,
        key: "/life",
        icon: <img style={{width: "8px", height: "15px", borderRadius: "35px"}} src={lifeImage}/>
    },{
        label: <Link to='/art'><span>艺术百科</span></Link>,
        key: "/art",
        icon: <img style={{width: "8px", height: "15px", borderRadius: "35px"}} src={artImage}/>
    }
];
export default props => {
    const [collapsed, setCollapsed] = useState(false);
    const getImgs = num => {
        let imgs = [];
        if (num && num > 0) {
            for(let i = 0; i < num; i++){
                imgs.push(<img style={{height: "60px"}} src={"https://media1.giphy.com/media/kLMfRZwHtzr7a/source.gif"}/>);
            }
        }
        return imgs;
    };
    return <Layout style={{minHeight: '100vh'}}>
        <Header style={{padding: 0}}>
            <Row>
                <Col span={4}>
                    <span><img style={{width: "70px", height: "65px", borderRadius: "35px", marginTop: "-6px"}}
                               src={logo}/></span>
                    <span style={{color: "#fff", fontSize: "16px", marginLeft: '16px'}}>知识百科</span>
                </Col>
                <Col span={20} style={{overflow: "hidden", height: "65px"}}>
                    <img style={{height: "60px"}} src={"https://media1.giphy.com/media/kLMfRZwHtzr7a/source.gif"}/>
                    {getImgs(20)}
                </Col>
            </Row>
        </Header>
        <Layout className="site-layout">
            <Sider theme={"light"} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <Menu defaultSelectedKeys={['/technology']} mode="inline" items={items}/>
            </Sider>
            <Content style={{margin: '0 16px'}}>
                <Outlet/>
            </Content>
        </Layout>
    </Layout>
}