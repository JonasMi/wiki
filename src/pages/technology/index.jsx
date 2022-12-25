import React, {useEffect, useState} from 'react';
import {Card, Form, PageHeader, Pagination, Row, Tabs, Spin, Button,Empty, Col, Tree} from 'antd';

const Technology = props => {
    return <div>
        <PageHeader title={"技术百科"}/>
        <Row>
            <Col span={4}>

            </Col>
            <Col span={20}>
                <Card title={"简介"} bordered={false}>

                </Card>
                <Card title={"安装"} bordered={false}>

                </Card>
                <Card title={"配置"} bordered={false}>

                </Card>
                <Card title={"命令"} bordered={false}>

                </Card>
                <Card title={"知识点"} bordered={false}>

                </Card>
            </Col>
        </Row>
    </div>;
}

export default Technology;