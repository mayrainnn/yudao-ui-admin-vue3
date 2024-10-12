import request from '@/config/axios'

export interface FileWithProjectVO {
  projectId: number
  filePath: string
}
export interface FileWithProjectPageReqVO extends PageParam {
  name?: string
  type?: string
  createTime?: Date[]
}

// 查询文件列表
export const getFileProjectPage = (params: FileWithProjectPageReqVO) => {
  return request.get({ url: '/lab/file/page', params })
}

// 删除文件
export const deleteFile = (id: number) => {
  return request.delete({ url: '/infra/file/delete?id=' + id })
}

// 用项目绑定文件
export const assign = (data: any) => {
  return request.post({ url: '/lab/file/assign-file-project', data })
}

// 删除文件和项目绑定关系
export const deleteFileProject = (id: number) => {
  return request.delete({ url: '/lab/file/delete?id=' + id })
}