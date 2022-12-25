import React, {useState, useRef, useEffect} from 'react';
import {Col, message, Popconfirm, Row, Tooltip, Badge, Modal} from 'antd';
import {DeleteOutlined, EditOutlined, SearchOutlined, ManOutlined, WomanOutlined, UserDeleteOutlined, UserAddOutlined} from '@ant-design/icons';
import "./index.css";
import {getAreaNameByCode} from "./AreaUtil";
import * as MemberService from "../../service/member";

export default props => {
    const {data, onSearch, openEditModel, showOperation = true, setMatchParams, setShowMatchModel, form} = props;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    useEffect(() => {
        if(data?.image[0]?.originFileObj){
            const reader = new FileReader();
            reader.readAsDataURL(data?.image[0]?.originFileObj);
            reader.onload = () => {
                const src = reader.result;
                setPreviewImage(src);
                setPreviewTitle(data?.image[0]?.name);
            };
        }
    }, [data]);
    //https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png
    const getOtherInfo = data => {
        return `正在寻找一个年龄${data?.otherAge?.join("-")}, 身高${data?.otherHeight?.join("-")}, 收入${data?.otherIncome?.join("-")}合适的另一半...`;
    };
    const getAge = age => {
        return Math.floor(((new Date()).getTime() - age) / (24 * 3600 * 1000 * 365))
    };
    const deleteById = id => {
        MemberService.deleteById(id, () => {
            message.success("删除成功!");
            onSearch && onSearch();
        });
    };
    const settingStatus = status => {
        MemberService.update({...data, status}).onsuccess = e=> {
            message.success("设置成功!");
            onSearch && onSearch();
        }
    };
    const getOtherSex = sex => {
      if(sex === '男'){
          return "女";
      }
      if(sex === '女'){
          return "男";
      }
      return "";
    };
    const handleCancel = () => setPreviewVisible(false);
    return <div className={"memberCard"}>
        <Row>
            <Col span={12}>
                <img onClick={() => {
                    setPreviewVisible(true);
                }} style={{width: "100%", height: "300px"}} alt={"暂无图片"} src={previewImage}/>
            </Col>
            <Col span={12} style={{paddingLeft: "16px", paddingRight: "16px"}}>
                <p className={"mInfoTitle"}>
                    <span>
                        {data?.status === '未匹配' ? <Badge status="success"/> : <Badge status="default"/>}
                    </span>
                    {data?.name}
                    <span style={{fontWeight: 500, color: "#999", marginLeft: "4px"}}>{data?.telephone}</span>


                    <Tooltip title={"匹配度"}><span style={{marginLeft: "8px", color: "#1890ff"}}>{Number((data?.ratio * 100).toFixed(2))}%</span></Tooltip>
                    <span style={{marginLeft: "8px"}}>
                        {
                            data?.sex === '男' ? <Tooltip title={"男"}><ManOutlined style={{color: "#1890ff"}}/></Tooltip> : <Tooltip title={"女"}><WomanOutlined style={{color: "#ff4d4f"}}/></Tooltip>
                        }
                        </span>

                </p>
                <p className={"mInfoContent"}>{getAge(data?.age)}岁&nbsp;&nbsp;{data?.height}cm&nbsp;&nbsp;{data?.weight}kg</p>
                <p className={"mInfoContent"}>目前所在地:<Tooltip placement="topLeft"
                                                           title={data?.location?.map(item => getAreaNameByCode(item))?.join(",")}>{data?.location?.map(item => getAreaNameByCode(item))?.join(",")}</Tooltip>
                </p>
                <p className={"mInfoContent"}>收入:{data?.income}&nbsp;&nbsp;房:{data?.housingSituation}&nbsp;&nbsp;车: {data?.hasCar}&nbsp;&nbsp;小孩:{data?.hasChild}</p>
                <p className={"mInfoContent"}>工作:<Tooltip placement="topLeft" title={data?.work}>{data?.work}</Tooltip></p>
                <p className={"mInfoContent"}>婚姻状况:{data?.maritalStatus}</p>
                <p className={"mInfoContent"}>学历:{data?.educational}</p>
                <p className={"mInfoContent"}>性格:<Tooltip placement="topLeft" title={data?.character}>{data?.character}</Tooltip></p>
                <p className={"mInfoContent"}>家庭成员情况:<Tooltip placement="topLeft" title={data?.familyChildren}>{data?.familyChildren}</Tooltip></p>
                <p className={"mInfoDesc"}>{getOtherInfo(data)}</p>
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                <Tooltip title={"编辑"}>
                    <EditOutlined onClick={() => openEditModel && openEditModel()}
                                  style={{padding: "8px", color: "#000000c9", cursor: "pointer"}}/>
                </Tooltip>
                <Tooltip title={data.status === '未匹配' ? "设置为已匹配" : "设置为未匹配"}>
                    {data.status === '未匹配' ? <UserDeleteOutlined onClick={() => settingStatus("已匹配")} style={{marginLeft: "8px", color: "#7ec1ff", cursor: "pointer"}}/> : <UserAddOutlined onClick={() => settingStatus("未匹配")} style={{marginLeft: "8px", color: "#7ec1ff", cursor: "pointer"}}/>}
                </Tooltip>
                <Popconfirm
                    title="数据删除后不可恢复，确认删除吗？"
                    onConfirm={() => deleteById(data?.id)}
                    okText="确认"
                    cancelText="取消"
                >
                    <Tooltip title={"删除"}><DeleteOutlined style={{padding: "8px", color: "#d9363e", cursor: "pointer"}}/></Tooltip>
                </Popconfirm>
                <Tooltip title={"配对"}><SearchOutlined onClick={() => {
                    setMatchParams({
                        age: data?.otherAge || [],
                        height: data?.otherHeight || [],
                        weight: data?.otherWeight || [],
                        income: data?.otherIncome || [],
                        sex: getOtherSex(data?.sex) ,
                        location: data?.otherLocation,
                        educational: data?.otherEducational || [],
                        hasCar: data?.otherHasCar,
                        housingSituation: data?.otherHousingSituation,
                        maritalStatus: data?.otherMaritalStatus,
                        ratio: form.getFieldValue("ratio"),
                        hasChild: data?.otherHasChild,
                        status: "未匹配",
                        matchInfo: {
                            name: data?.name
                        }
                    });
                    setShowMatchModel(true);
                }} style={{padding: "8px", color: "#40a9ff", cursor: "pointer"}}/></Tooltip>
            </Col>
        </Row>
        <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{width: "100%"}}  src={previewImage} />
        </Modal>
    </div>
}