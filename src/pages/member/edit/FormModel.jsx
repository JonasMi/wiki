import React, {useState} from 'react';
import {Col, Form, Row, Slider, Select, Button, Modal, Card, Radio, DatePicker, Input, InputNumber, message, Tooltip} from 'antd';
import ZodiacSelect from "../ZodiacSelect"
import EducationalSelect from "../EducationalSelect";
import AreaSelect from "../AreaSelect";
import {ageMarks, heightMarks, weightMarks, incomeMarks} from "../Marks";
import moment from 'moment';
import ImageUpload from "../ImageUpload";
import FieldEnum from "../FieldEnum";
import {getAreaByName} from  "../AreaUtil";
import * as MemberService from "../../../service/member";
import {QuestionCircleOutlined} from '@ant-design/icons';
const { Option } = Select;
const {TextArea} = Input;
export default props => {
    const {close, visible, data, onSearch} = props;
    const [isFormMode, setIsFormModel] = useState(true);
    const [form] = Form.useForm();
    const isUpdate = !!data;
    const dateFormat = 'YYYY-MM-DD';
    const onOk = ()=> {
        if(!isFormMode){
            message.warn("请切换为表单模式，确认信息后再提交!")
            return;
        }
        form.validateFields().then(values => {
            values.age = values.age.valueOf();
            if(isUpdate){
                MemberService.update({...values, id: data?.id}).onsuccess = event => {
                    message.success("更新成功");
                    close();
                    onSearch();
                }
            }else{
                MemberService.save(values, ()=> {
                    message.success("添加成功");
                    close();
                    onSearch();
                });
            }
        });
    };
    const transformInfoToValues= info => {
        if(!info){
            return undefined;
        }
        let allList = info.split("\n");
        if(!allList ||allList?.length === 0){
            return undefined;
        }
        let isOther = false;
        let values = {};
        allList.filter(item => item).map(item => {
            try{
                if(item.includes("对另一半的要求")){
                    isOther = true;
                }
                let keyValue = item.split("：");
                if(keyValue && keyValue?.length === 1){
                    let keyValue1 = item.split(":");
                    if(keyValue1 && keyValue1?.length === 2){
                        keyValue = keyValue1;
                    }
                }
                if(keyValue && keyValue?.length > 0){
                    let key = getCode(keyValue[0], isOther);
                    if(key){
                        let value = keyValue?.length == 2 ? keyValue[1] : undefined;
                        if(value){
                            if(isOther){
                                if(key === 'otherAge' || key === 'otherHeight' || key === 'otherWeight' || key === 'otherIncome'){
                                    value = value?.trim();
                                    if(value === ''){
                                        return;
                                    }
                                    let valueList = value?.split("-");
                                    if(valueList?.length === 2){
                                        values[key] = valueList?.map(v => Number(v.trim()));
                                    }
                                    if(valueList?.length === 1){
                                        if(key === 'otherAge'){
                                            values[key] = [Number(valueList[0].trim()), 90]
                                        }
                                        if(key === 'otherHeight'){
                                            values[key] = [Number(valueList[0].trim()), 220]
                                        }
                                        if(key === 'otherWeight'){
                                            values[key] = [Number(valueList[0].trim()), 150]
                                        }
                                        if(key === 'otherIncome'){
                                            values[key] = [Number(valueList[0].trim()), 100]
                                        }
                                    }
                                }else if(key === 'otherLocation'){
                                    values[key] = value?.split(",").map(v => getAreaByName(v.trim()));
                                }else if(key === "otherEducational"){
                                    values[key] = value ? value.trim().split(",") : [];
                                }else {
                                    values[key] = value.trim();
                                }
                            }else{
                                if(key === 'height' || key === 'weight' || key === 'income'){
                                    values[key] = Number(value.trim());
                                }else if(key === 'age'){
                                    try{
                                        values[key] = moment(value.trim(), dateFormat);
                                    }catch (e) {
                                        values[key] = value.trim();
                                    }
                                }else if(key === 'location'){
                                    values[key] = value?.split(",").map(v => getAreaByName(v.trim()));
                                }else{
                                    values[key] = value.trim();
                                }
                            }
                        }else{
                            values[key] = undefined;
                        }
                    }
                }
            }catch (e) {
            }
        });
        return values;
    };

    const getCode = (desc, isOther) => {
        return FieldEnum.getCodeByDesc(isOther ? `${desc}1` : desc);
    };

    const modeOnChange = e => {
        let val = e.target.value;
        setIsFormModel(val);
        if(val){
            let info = form.getFieldValue("info");
            if(info){
                let values = transformInfoToValues(info);
                form.setFieldsValue(values);
            }
        }
    };



    return <Modal width={860} okText={"提交"} cancelText={"取消"} title={`会员${isUpdate ? "编辑" : "新增"}`} visible={visible} onOk={onOk} onCancel={() => {
        close();
        form.resetFields();
    }} destroyOnClose={true}>
        <Form name="basic" form={form}>
            <Form.Item name={"mode"} label={"模式选择"} initialValue={isFormMode}>
                <Radio.Group onChange={modeOnChange} options={[{ label: '表单模式', value: true },{ label: '文本模式', value: false }]} optionType="button" />
            </Form.Item>
            <Form.Item valuePropName={"fileList"} name={"image"} label={<span><span>照片上传</span><Tooltip title={"支持照片复制粘贴"}><QuestionCircleOutlined style={{marginLeft:"4px", color: "#1890ff"}}/></Tooltip></span>} initialValue={data?.image}  rules={[{required: true, message: "请上传照片"}]}>
                <ImageUpload form={form}/>
            </Form.Item>
            {isFormMode ? <>
                <Card title={"自身情况"}>
                    <Row>
                        <Col span={7}>
                            <Form.Item name={"name"} label={"姓名"} rules={[{required: true, message: "姓名为必填项"}]} initialValue={data?.name}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"sex"} label={"性别"} rules={[{required: true, message: "性别为必填项"}]} initialValue={data?.sex}>
                                <Radio.Group>
                                    <Radio value={"男"}>男</Radio>
                                    <Radio value={"女"}>女</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"age"} label={"出生年月"} rules={[{required: true, message: "出生年月为必填项"}]} initialValue={data?.age ? moment(data?.age) : undefined}>
                                <DatePicker format={dateFormat} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <Form.Item name={"zodiac"} label={"生肖"} initialValue={data?.zodiac}>
                                <ZodiacSelect />
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"height"} label={"身高"} initialValue={data?.height} rules={[{required: true, message: "身高为必填项"}]}>
                                <InputNumber  addonAfter={"cm"}/>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"weight"} label={"体重"} initialValue={data?.weight} rules={[{required: true, message: "身高为必填项"}]}>
                                <InputNumber  addonAfter={"kg"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <Form.Item name={"work"} label={"工作"} initialValue={data?.work} rules={[{required: true, message: "身高为必填项"}]}>
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"educational"} label={"文化程度"} initialValue={data?.educational} rules={[{required: true, message: "文化程度为必填项"}]}>
                                <EducationalSelect />
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"income"} label={"月收入"} initialValue={data?.income} rules={[{required: true, message: "月收入为必填项"}]}>
                                <InputNumber  addonAfter={"k"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <Form.Item name={"location"} label={"目前所在地"} initialValue={data?.location} rules={[{required: true, message: "目前所在地为必填项"}]}>
                                <AreaSelect />
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3}>
                            <Form.Item  name={"hasCar"} label={"车"} initialValue={data?.hasCar} rules={[{required: true, message: "车为必填项"}]}>
                                <Select allowClear={true}>
                                    <Option value="有">有</Option>
                                    <Option value="无">无</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3}>
                            <Form.Item name={"housingSituation"} label={"房"} initialValue={data?.housingSituation} rules={[{required: true, message: "房为必填项"}]}>
                                <Select allowClear={true}>
                                    <Option value="有">有</Option>
                                    <Option value="无">无</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"maritalStatus"} label={"婚史"} initialValue={data?.maritalStatus} rules={[{required: true, message: "婚史为必填项"}]}>
                                <Select allowClear={true} placeholder={"请选择"}>
                                    <Option value="未婚">未婚</Option>
                                    <Option value="离婚">离婚</Option>
                                    <Option value="丧偶">丧偶</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <Form.Item rules={[{required: true, message: "电话号码为必填项"}]} name={"telephone"} label={"电话"} initialValue={data?.telephone}>
                                <InputNumber style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item rules={[{required: true, message: "状态为必填项"}]} name={"status"} label={"状态"} initialValue={!data?.status ? "未匹配" : data?.status}>
                                <Select allowClear={true} placeholder={"请选择"} >
                                    <Option value="未匹配">未匹配</Option>
                                    <Option value="已匹配">已匹配</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item rules={[{required: true, message: "有无小孩为必填项"}]} name={"hasChild"} label={"有无小孩"} initialValue={!data?.hasChild ? "无" : data?.hasChild}>
                                <Select allowClear={true} placeholder={"请选择"} >
                                    <Option value="无">无</Option>
                                    <Option value="有">有</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item name={"character"} label={"性格"} initialValue={data?.character}>
                                <TextArea style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name={"familyChildren"} label={"家庭成员情况"} initialValue={data?.familyChildren}>
                                <TextArea style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card title={"对另一半要求"}>
                    <Row>
                        <Col span={11}>
                            <Form.Item name={"otherAge"} label={"年龄段"} initialValue={data?.otherAge ? data?.otherAge:  [22, 90]}>
                                <Slider min={18} max={90} range marks={ageMarks}/>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name={"otherHeight"} label={"身高"} initialValue={data?.otherHeight ? data?.otherHeight : [165, 220]}>
                                <Slider min={130} max={220} range marks={heightMarks}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item name={"otherWeight"} label={"体重"} initialValue={data?.otherWeight ? data?.otherWeight : [40, 150]}>
                                <Slider min={30} max={150} range marks={weightMarks}/>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item name={"otherIncome"} label={"月收入"} initialValue={data?.otherIncome ? data?.otherIncome : [6, 100]}>
                                <Slider min={0} max={100} range marks={incomeMarks}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7}>
                            <Form.Item name={"otherMaritalStatus"} label={"婚史"} initialValue={data?.otherMaritalStatus}>
                                <Select allowClear={true} placeholder={"请选择"}>
                                    <Option value="未婚">未婚</Option>
                                    <Option value="离婚">离婚</Option>
                                    <Option value="丧偶">丧偶</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3}>
                            <Form.Item  name={"otherHasCar"} label={"车"} initialValue={data?.otherHasCar}>
                                <Select allowClear={true}>
                                    <Option value="有">有</Option>
                                    <Option value="无">无</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3}>
                            <Form.Item name={"otherHousingSituation"} label={"房"} initialValue={data?.otherHousingSituation}>
                                <Select allowClear={true}>
                                    <Option value="有">有</Option>
                                    <Option value="无">无</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={7}>
                            <Form.Item name={"otherLocation"} label={"目前所在地"} initialValue={data?.otherLocation}>
                                <AreaSelect />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item name={"otherEducational"} initialValue={data?.otherEducational} label={"文化程度"}>
                                <EducationalSelect mode={"multiple"} allowClear={true} placeholder={"请选择"} />
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item  name={"otherHasChild"} label={"有无小孩"} initialValue={data?.otherHasChild}>
                                <Select allowClear={true} placeholder={"请选择"} >
                                    <Option value="无">无</Option>
                                    <Option value="有">有</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </> : <Form.Item name={"info"} label={<span>征婚信息
                <Tooltip title={<TextArea style={{width: "400px"}} value={"姓名：张三\n" +
                "性别： 男\n" +
                "出生年月：1995-10-12\n" +
                "生肖：猴\n" +
                "身高(cm)：170\n" +
                "体重(kg)：60\n" +
                "工作： 律师\n" +
                "文化程度：高中\n" +
                "性格：---123\n" +
                "月收入（k）：18\n" +
                "婚史：未婚\n" +
                "家庭成员情况：sdafas\n" +
                "房（有/无）：有\n" +
                "车（有/无）： 有\n" +
                "目前所在地： 成都\n" +
                "电话：12222212129\n" +
                "有无小孩：有\n" +
                "★☆对另一半的要求☆★\n" +
                "年龄：22-25\n" +
                "身高（cm）：165-180\n" +
                "体重（kg）：50-70\n" +
                "月收入（k）： 10 - 20\n" +
                "婚史： 未婚\n" +
                "房（有/无）：有\n" +
                "车（有/无）： 有\n" +
                "目前所在地：成都\n" +
                "文化程度：高中,本科\n" +
                "有无小孩：有"} rows={22}/>}><QuestionCircleOutlined style={{marginLeft:"4px", color: "#1890ff"}}/></Tooltip></span>}>
                <TextArea rows={22}/>
            </Form.Item>}
        </Form>
    </Modal>;
}