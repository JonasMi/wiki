import React from 'react';
import {Col, Form, Row, Slider, Select, Button, Input, InputNumber} from 'antd';
import AreaSelect from "./AreaSelect";
import EducationalSelect from "./EducationalSelect";
import {ageMarks, heightMarks, weightMarks, incomeMarks} from "./Marks";
const { Option } = Select;
export default props => {
    const {form, onSearch} = props;

    return <Form form={form} layout={"horizontal"} className="ant-advanced-search-form">
        <Row>
            <Col span={7}>
                <Form.Item name={"age"} label={"年龄段"} initialValue={[18, 90]}>
                    <Slider min={18} max={90} range marks={ageMarks}/>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={7}>
                <Form.Item name={"height"} label={"身高"} initialValue={[130, 220]}>
                    <Slider min={130} max={220} range marks={heightMarks}/>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={8}>
                <Form.Item name={"weight"} label={"体重"} initialValue={[30, 150]}>
                    <Slider min={30} max={150} range marks={weightMarks}/>
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={7}>
                <Form.Item name={"income"} label={"月收入"} initialValue={[0, 100]}>
                    <Slider min={0} max={100} range marks={incomeMarks}/>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item name={"location"} label={"目前所在地"}>
                    <AreaSelect />
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item name={"educational"} label={"文化程度"}>
                    <EducationalSelect mode={"multiple"} allowClear={true} placeholder={"请选择"} />
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item  name={"hasCar"} label={"车"}>
                    <Select allowClear={true} placeholder={"是否有车"}>
                        <Option value="有">有</Option>
                        <Option value="无">无</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
                <Form.Item name={"housingSituation"} label={"房"}>
                    <Select allowClear={true} placeholder={"是否有房"}>
                        <Option value="有">有</Option>
                        <Option value="无">无</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={3}>
                <Form.Item name={"maritalStatus"} label={"婚史"}>
                    <Select allowClear={true} placeholder={"请选择"}>
                        <Option value="未婚">未婚</Option>
                        <Option value="离婚">离婚</Option>
                        <Option value="丧偶">丧偶</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item name={"name"} label={"姓名"}>
                    <Input />
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item name={"telephone"} label={"电话"}>
                    <InputNumber style={{width: "100%"}}/>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item name={"status"} label={"状态"} initialValue={"未匹配"}>
                    <Select allowClear={true} placeholder={"请选择"} >
                        <Option value="未匹配">未匹配</Option>
                        <Option value="已匹配">已匹配</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={3}>
                <Form.Item name={"hasChild"} label={"有无小孩"}>
                    <Select allowClear={true} placeholder={"请选择"} >
                        <Option value="无">无</Option>
                        <Option value="有">有</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={1}></Col>
            <Col span={4}>
                <Form.Item name={"ratio"} label={"匹配度大于"} initialValue={65}>
                    <InputNumber  addonAfter="%" min={0} max={100} />
                </Form.Item>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <span style={{float:"right"}}>
                    <Button style={{marginLeft: "8px"}} onClick={() => form.reset()}>重置</Button>
                    <Button type="primary" style={{marginLeft: "8px"}} onClick={() => {
                        onSearch && onSearch({page: 1, pageSize: 8});
                    }}>查询</Button>
                </span>
            </Col>
        </Row>
    </Form>
};