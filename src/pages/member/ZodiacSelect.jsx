import {Select} from 'antd';

const { Option } = Select;
export default props => {

    return <Select {...props}>
        <Option value="鼠">鼠</Option>
        <Option value="牛">牛</Option>
        <Option value="虎">虎</Option>
        <Option value="兔">兔</Option>
        <Option value="龙">龙</Option>
        <Option value="蛇">蛇</Option>
        <Option value="马">马</Option>
        <Option value="羊">羊</Option>
        <Option value="猴">猴</Option>
        <Option value="鸡">鸡</Option>
        <Option value="狗">狗</Option>
        <Option value="猪">猪</Option>
    </Select>
}