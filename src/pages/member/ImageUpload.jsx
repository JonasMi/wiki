import React, {useState, useRef, useEffect} from 'react';
import {Modal, Upload} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import "./index.css";
const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
const buildImage = (src, file) => {
        return {
            originFileObj: file,
            thumbUrl: src,
            uid: (new Date()).toDateString(),
            lastModified: (new Date()).getTime(),
            lastModifiedDate: new Date(),
            size: file.size,
            name: file.name,
            type: "image/png",
            percent: 100,
            status: "done",
            response: true,
        }
};
export default props => {
    const {form} = props;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const pasteImageRef = useRef(null);
    const [pasteImage, setPasteImage] = useState(undefined);
    useEffect(() => {
        pasteImageRef.current?.addEventListener('paste', e => {
            console.log("粘贴事件", e);
            console.log("sadf", e.clipboardData.items.length);
            console.log("文本===", e.clipboardData.getData("text/plain"));
            if(e?.clipboardData?.items?.length === 1){
                let item = e?.clipboardData?.items[0];
                let files = e?.clipboardData?.files;
                if(item.kind === 'file' && item.type.startsWith("image/")){
                    let file = files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const src = reader.result;
                        form.setFieldsValue({
                            image: [buildImage(src, file)]
                        })
                    };
                }
            }
        });
    }, []);
    const handleCancel = () => setPreviewVisible(false);
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );
    const onChange = (value)  => {
        props.onChange && props.onChange(value?.fileList);
    };
    return <div tabindex="1" id={"uploadDiv"} ref={pasteImageRef}>
        <Upload
            listType="picture-card"
            onPreview={handlePreview}
            maxCount={1}
            customRequest={props => {
                props.onSuccess(true, null);
            }}
            {...props}
            onChange={onChange}
        >
            {uploadButton}
        </Upload>
        <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </div>


}