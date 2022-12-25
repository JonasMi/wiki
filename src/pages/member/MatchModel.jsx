import React, {useEffect, useState} from 'react';
import {Col, message, Popconfirm, Row, Tooltip, Modal, Pagination, Empty} from 'antd';
import MemberCard from "./MemberCard";
import * as MemberService from "../../service/member";
export default props => {
    const {params, visible, close, form, openEditModel, setMatchParams} = props;
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    useEffect(() => {
        search({...params, page, pageSize});
    }, [params]);
    const search = params => {
        MemberService.findByDynamic(params, result => {
            setList(result?.list || []);
            setTotal(result?.total);
        });
    };
    return <Modal destroyOnClose onCancel={close} title={`【${params?.matchInfo?.name}】匹配到的异性`} visible={visible} width={1600} footer={null}>
        {
            list?.length > 0 ? list.map(item => (<MemberCard onSearch={() => search({...params, page, pageSize})} setMatchParams={setMatchParams} form={form} openEditModel={() => openEditModel(item)} showOperation={false} data={item}/>)) : <Empty/>
        }
        <Row></Row>
        <Row>
            <Pagination style={{marginTop: "16px", float:"right", marginRight: "24px"}}
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        onChange={(page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                            search({...params, page, pageSize});
                        }}/>
        </Row>
    </Modal>
}