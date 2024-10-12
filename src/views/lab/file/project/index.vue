<template>
  <el-row :gutter="20">
    <!-- 左侧部门树 -->
    <el-col :span="4" :xs="24">
      <ContentWrap class="h-1/1">
        <ProjectTree @node-click="handleDeptNodeClick" />
      </ContentWrap>
    </el-col>
    <el-col :span="20" :xs="24">
      <!-- 搜索 -->
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="文件名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入文件名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-160px"
            />
          </el-form-item>
          <el-form-item label="文件类型" prop="type">
            <el-input
              v-model="queryParams.type"
              placeholder="请输入文件类型"
              clearable
              @keyup.enter="handleQuery"
              class="!w-140px"
            />
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="queryParams.createTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="!w-200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
            <el-button
              type="primary"
              plain
              @click="openForm()"
              v-hasPermi="['system:user:create']"
            >
              <Icon icon="ep:upload" class="mr-5px" /> 上传文件
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <el-table v-loading="loading" :data="list">
      <el-table-column label="文件名" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column
        label="文件大小"
        align="center"
        prop="size"
        width="120"
        :formatter="fileSizeFormatter"
      />
      <el-table-column label="文件类型" align="center" prop="type" width="180px" />
      <el-table-column label="文件内容" align="center" prop="url" width="110px">
        <template #default="{ row }">
          <el-image
            v-if="row.type.includes('image')"
            class="h-80px w-80px"
            lazy
            :src="row.url"
            :preview-src-list="[row.url]"
            preview-teleported
            fit="cover"
          />
          <el-link
            v-else-if="row.type.includes('pdf')"
            type="primary"
            :href="row.url"
            :underline="false"
            target="_blank"
            >预览</el-link
          >
          <el-link v-else type="primary" download :href="row.url" :underline="false" target="_blank"
            >下载</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" width="160">
            <template #default="scope">
              <div class="flex items-center justify-center">
                <el-button
                  type="primary"
                  link
                  @click="openOnlyOffice(scope.row)"
                  v-hasPermi="['system:user:update']"
                >
                  <Icon icon="ep:edit" />查看
                </el-button>
                <el-button
                  type="danger"
                  link
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['system:user:update']"
                >
                  <Icon icon="ep:delete" />删除
                </el-button>
              </div>
            </template>
          </el-table-column>
    </el-table>
      <ContentWrap>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </ContentWrap>
    </el-col>
  </el-row>

  <!-- 添加或修改用户对话框 -->
  <FileForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { fileSizeFormatter } from '@/utils'
import { dateFormatter } from '@/utils/formatTime'
import * as FileProjectApi from '@/api/lab/file'
import FileForm from './FileForm.vue'
import ProjectTree from './ProjectTree.vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'LabProjectFile' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const router = useRouter()// 路由跳转

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  type: undefined,
  projectId: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FileProjectApi.getFileProjectPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 处理部门被点击 */
const handleDeptNodeClick = async (row) => {
  queryParams.projectId = row.id
  await getList()
}

/** 添加 */
const formRef = ref()
const openForm = () => {
  formRef.value.open()
}

const openOnlyOffice = (row) => {
  router.push({
    name: 'OnlyOffice',
    query: {
      openType: 'edit',
      name: row.name,
      type: row.type,
      url: row.url
    }
  })
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FileProjectApi.deleteFile(id)
    await FileProjectApi.deleteFileProject(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
