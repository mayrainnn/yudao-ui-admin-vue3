import request from '@/config/axios'

export interface ProjectVO {
  id?: number
  name: string
  parentId: number
  status: number
  sort: number
  leaderUserId: number
  phone: string
  email: string
  address: String
  logo: String
  description: String
  createTime: Date
}

// 查询部门（精简)列表
export const getSimpleProjectList = async (): Promise<ProjectVO[]> => {
  return await request.get({ url: '/lab/project/simple-list' })
}

// 查询部门列表
export const getProjectPage = async (params: PageParam) => {
  return await request.get({ url: '/lab/project/list', params })
}

// 查询部门详情
export const getProject = async (id: number) => {
  return await request.get({ url: '/lab/project/get?id=' + id })
}

// 新增部门
export const createProject = async (data: ProjectVO) => {
  return await request.post({ url: '/lab/project/create', data: data })
}

// 修改部门
export const updateProject = async (params: ProjectVO) => {
  return await request.put({ url: '/lab/project/update', data: params })
}

// 删除部门
export const deleteProject = async (id: number) => {
  return await request.delete({ url: '/lab/project/delete?id=' + id })
}
