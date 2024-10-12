<template>
  <div class="editor-container">
    <DocumentEditor 
        id='docEditor' 
        documentServerUrl='http://202.118.19.61:40156/'
        :config='config'
    />  
  </div>
</template>

<script lang='ts' setup>
import { DocumentEditor } from '@onlyoffice/document-editor-vue';
import {reactive} from 'vue';
import { useRoute } from 'vue-router';
import { handleDocType } from '@/utils/onlyofficeUtil'
import { useUserStore } from '@/store/modules/user';

defineOptions({ name: 'OnlyOffice' })
const extractFileExtension = (fileName: string) => {
  const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1] : '';
}

const route = useRoute();
const userStore = useUserStore()
const fileType = extractFileExtension(route.query.name as string);
const documentType = handleDocType(fileType);

const config = reactive({
  documentType: documentType,
  document: {
    title: route.query.name as string,
    url: route.query.url as string,
 
    // 当前用户对于当前文档的操作权限
    permissions: {
        print: false,
        download: true //用户是否可以下载
    },
    fileType: fileType,//文件类型
    //onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存
    key: route.query.id as string
  },
  editorConfig: {
    // 编辑器常规配置
    customization: {
      // 自动保存可以关闭，常规ctrl+s更好用
      autosave: true,
      compactToolbar: true,
      forcesave: true,
      toolbarNoTabs: true,
      help: false,
      compactHeader: true,
      hideRightMenu: true,
      // logo: {//自定义logo配置
      //   image: 'xxxx',
      //   imageDark: 'xxx',
      //   url: 'xxx',
      //   visible: false
      // },
    },
    mode: 'view',//view为只能浏览  edit为编辑
    //这个回调及其的重要
    callbackUrl: 'http://192.168.1.94:8080/onlyoffice/callback',
    // 菜单显示语言
    lang: 'zh-CN',
    // 当前操作用户信息
    user: {
      name: userStore.user.nickname as string,
      id: userStore.user.id as unknown as string
    }
  },
  height: '100%',
  width: '100%',
})
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 155px);
}

#docEditor {
  flex-grow: 1;
  height: 100%;
  width: 100%;
}
</style>
