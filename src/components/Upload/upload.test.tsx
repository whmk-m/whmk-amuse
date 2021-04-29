import React from 'react'
import {render, RenderResult, fireEvent, waitFor, createEvent} from '@testing-library/react'
import Upload, {IUploadProps} from "./index";
import axios from "axios";
import { ManualUpload} from './Upload.stories'

// 模拟Icon组件为一个span标签
jest.mock('../Icon/index', () => {
  // @ts-ignore
  return ({icon, onClick}) => {
    return <span onClick={onClick}>{icon}</span>
  }
})
// 模拟axios请求
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const defaultProps: IUploadProps = {
  action: "fakeurl.com",
}

const beforeDealProps:IUploadProps = {
  beforeRemove:jest.fn().mockImplementationOnce(() => false),
  beforeUpload:jest.fn((files)=> {
    // console.log('files:',files)
    return true
  })
}

let wrapper: RenderResult,
  fileInput: HTMLInputElement,
  uploadArea: HTMLElement
const testFile = new File(['xyz'], 'test.png', {type: 'image/png'})
describe('测试 Upload 组件', () => {
  it('测试最基本的上传组件', async function () {
    wrapper = render(<Upload {...defaultProps}/>)
    uploadArea = wrapper.getByText('上传文件')
    fileInput = wrapper.container.getElementsByTagName('input')[0]
    // 模拟文件上传的POST请求并且成功返回
    mockedAxios.post.mockResolvedValue({'data': 'cool'})

    expect(uploadArea).toBeInTheDocument()
    expect(fileInput).not.toBeVisible()
    // input change 事件
    fireEvent.change(fileInput, {target: {files: [testFile]}})
    await waitFor(() => {
      // 上传的图片出现
      expect(wrapper.queryByText('test.png')).toBeInTheDocument()
    })
    // 上传中的icon
    expect(wrapper.queryByText('spinner')).toBeInTheDocument()

    // 延迟一秒后，上传成功的icon出现
    setTimeout(() => {
      expect(wrapper.queryByText('check-circle')).toBeInTheDocument()
      // 点击删除
      const deleteIcon = wrapper.queryByText('times-circle')?.parentNode
      deleteIcon && fireEvent.click(deleteIcon)
      // 文件消失
      expect(wrapper.queryByText('test.png')).not.toBeInTheDocument()
    }, 1000)
  });
  it('上传前、删除前的处理', function () {
    wrapper = render(<Upload {...defaultProps} {...beforeDealProps}/>)
    uploadArea = wrapper.getByText('上传文件')
    fileInput = wrapper.container.getElementsByTagName('input')[0]
    // 模拟文件上传的POST请求并且成功返回
    mockedAxios.post.mockResolvedValue({'data': 'cool'})
    // input change 事件
    fireEvent.change(fileInput, {target: {files: [testFile]}})
    // 调用beforeUpload 返回true 继续上传
    expect(beforeDealProps.beforeUpload).toHaveBeenCalled()

    // 延迟一秒后，上传成功的icon出现
    setTimeout(() => {
      expect(wrapper.queryByText('check-circle')).toBeInTheDocument()
      // 点击删除
      const deleteIcon = wrapper.queryByText('times-circle')?.parentNode
      deleteIcon && fireEvent.click(deleteIcon)
      // 调用beforeRemove 返回false
      expect(beforeDealProps.beforeRemove).toHaveBeenCalled()
      // 文件没有被删除
      expect(wrapper.queryByText('test.png')).toBeInTheDocument()
    }, 1000)
  });
  it('手动上传', async function () {
    wrapper = render(<ManualUpload/>)
    uploadArea = wrapper.getByText('上传文件')
    const submitUpload = wrapper.getByText('点击上传')
    fileInput = wrapper.container.getElementsByTagName('input')[0]

    // input change 事件
    fireEvent.change(fileInput, {target: {files: [testFile]}})

    // 手动上传
    fireEvent.click(submitUpload)
    await waitFor(() => {
      // 上传的图片出现
      expect(wrapper.queryByText('test.png')).toBeInTheDocument()
    })
    // 上传中的icon
    expect(wrapper.queryByText('spinner')).toBeInTheDocument()

    setTimeout(() => {
      // 延迟一秒后，上传失败的icon出现
      expect(wrapper.queryByText('exclamation-circle')).toBeInTheDocument()
    }, 1000)
  });
  it('自定义的上传按钮', function () {
    wrapper = render(<Upload {...defaultProps}>自定义的上传</Upload>)
    uploadArea = wrapper.getByText('自定义的上传')
    // 模拟文件上传的POST请求并且成功返回
    mockedAxios.post.mockResolvedValue({'data': 'cool'})
    expect(uploadArea).toBeInTheDocument()
  });
  it('拖拽文件上传', async function () {
    wrapper = render(<Upload {...defaultProps} drag={true}/>)
    uploadArea = wrapper.getByText('拖动文件到此处上传')
    // 模拟文件上传的POST请求并且成功返回
    mockedAxios.post.mockResolvedValue({'data': 'cool'})
    if (!uploadArea.parentNode) return
    expect(uploadArea.parentNode).toBeInTheDocument()
    expect(uploadArea.parentNode).toHaveClass('whmk-upload-dragger-wrapper')
    // 移入
    fireEvent.dragOver(uploadArea.parentNode)
    expect(uploadArea.parentNode).toHaveClass('is-dragover')

    // 移出
    fireEvent.dragLeave(uploadArea.parentNode)
    expect(uploadArea.parentNode).not.toHaveClass('is-dragover')

    // 创建 drop 事件
    const mockDropEvent = createEvent.drop(uploadArea.parentNode)
    Object.defineProperty(mockDropEvent,'dataTransfer',{
      value:{
        files:[testFile]
      }
    })
    // 触发drop事件
    fireEvent(uploadArea,mockDropEvent)
    await waitFor(()=>{
      // 图片文件出现
      expect(wrapper.queryByText('test.png')).toBeInTheDocument()
    })
    // 延迟一秒后，上传成功的icon出现
    setTimeout(() => {
      expect(wrapper.queryByText('check-circle')).toBeInTheDocument()
      // 点击删除
      const deleteIcon = wrapper.queryByText('times-circle')?.parentNode
      deleteIcon && fireEvent.click(deleteIcon)
      // 文件消失
      expect(wrapper.queryByText('test.png')).not.toBeInTheDocument()
    }, 1000)
  });
})
