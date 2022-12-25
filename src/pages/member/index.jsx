import React, {useEffect, useState} from 'react';
import {Card, Form, PageHeader, Pagination, Row, Tabs, Spin, Button,Empty } from 'antd';
import MemberCard from "./MemberCard";
import SearchForm from "./SearchForm";
import FormModel from "./edit/FormModel";
import * as MemberService from "../../service/member";
import MatchModel from "./MatchModel";
const { TabPane } = Tabs;

export default props => {
    const [form] = Form.useForm();
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [showModel, setShowModel]  = useState(false);
    const [data, setData] = useState(undefined);
    const [activeKey, setActiveKey] = useState("男");
    const [params, setParams] = useState({page: 1, pageSize: 8, sex: activeKey});
    const [matchParams, setMatchParams] = useState(undefined);
    const [showMatchModel, setShowMatchModel] = useState(false);
    useEffect(() => {
        search({...params, ...form.getFieldsValue()});
    }, [params]);
    const search = params => {
        setSpinning(true);
        console.log("params=", params);
        MemberService.findByDynamic(params, result => {
            setList(result?.list || []);
            setTotal(result?.total);
            setSpinning(false);
        });
    };
    const onParamsChange = values => {
        setParams({...params,...form.getFieldsValue(), ...values});
    };
    const close = ()=> {
        setShowModel(false);
        setData(undefined);
    };
    const openEditModel = item => {
        setData(item);
        setShowModel(true);
    };
    return <div>
        <PageHeader
            className="site-page-header"
            title="会员管理"
        />
        <Card title={"查询表单"}>
            <SearchForm form={form} onSearch={onParamsChange}/>
        </Card>
        <Card title={"人员列表"} style={{marginTop: "16px"}} extra={<Button onClick={() => {
            setData(undefined);
            setShowModel(true);
        }} type={"primary"}>添加</Button>}>
            <Spin delay={200} spinning={spinning} tip={"查询中，请稍后..."}>
                <Tabs activeKey={activeKey} onChange={sex => {
                    setActiveKey(sex);
                    onParamsChange({sex});
                }} size={"large"}>
                    <TabPane tab="男" key="男">
                        {
                            list?.length > 0 ? list.map(item => (<MemberCard form={form} setMatchParams={setMatchParams} setShowMatchModel={setShowMatchModel} openEditModel={() => {
                                openEditModel(item);
                            }} onSearch={onParamsChange} data={item}/>)) : <Empty/>
                        }
                        <Row></Row>
                        <Pagination style={{marginTop: "16px", float:"right", marginRight: "24px"}}
                                    current={params.page}
                                    pageSize={params.pageSize}
                                    total={total}
                                    onChange={(page, pageSize) => {
                                        setParams({...params, page, pageSize});
                                    }}/>
                    </TabPane>
                    <TabPane tab="女" key="女">
                        {
                            list?.length > 0 ? list.map(item => (<MemberCard  form={form} setMatchParams={setMatchParams} setShowMatchModel={setShowMatchModel} openEditModel={() => {
                                openEditModel(item);
                            }} onSearch={onParamsChange}  data={item}/>)) : <Empty/>
                        }
                        <Row></Row>
                        <Pagination style={{marginTop: "16px", float:"right", marginRight: "24px"}}
                                    current={params.page}
                                    pageSize={params.pageSize} total={total}
                                    onChange={(page, pageSize) => {
                                        setParams({...params, page, pageSize});
                                    }}/>
                    </TabPane>
                </Tabs>
            </Spin>
        </Card>
        {showModel ? <FormModel onSearch={onParamsChange} visible={showModel} close={close} data={data}/> : ""}
        {showMatchModel ? <MatchModel openEditModel={openEditModel}
                                      setMatchParams={setMatchParams} form={form} close={() => {
            setShowMatchModel(false);
            setMatchParams(undefined);
        }} visible={showMatchModel} params={matchParams}/> : ""}
    </div>;
}