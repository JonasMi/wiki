import {Select} from 'antd';
const { Option } = Select;
export default props => {

    return <Select {...props}>
        <Option value="小学">小学</Option>
        <Option value="初中">初中</Option>
        <Option value="高中">高中</Option>
        <Option value="中专">中专</Option>
        <Option value="大专">大专</Option>
        <Option value="本科">本科</Option>
        <Option value="硕士">硕士</Option>
        <Option value="博士">博士</Option>
    </Select>
}