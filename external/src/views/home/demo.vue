<template>
  <div class="workstation-manager">
    <div class="left-sidebar">
      

      <!-- 楼层选择 -->
      <div class="section">
        <div class="section-title">楼层选择</div>
        <el-select v-model="searchModel.workStationFloor" @change="ouedrt" size="small" style="width: 100%;">
          <el-option label="二楼工位图" :value="2"></el-option>
          <el-option label="四楼工位图" :value="4"></el-option>
          <el-option label="五楼工位图" :value="5"></el-option>
        </el-select>
      </div>

      <!-- 搜索功能 -->
      <div class="section">
        <div class="section-title">搜索工位</div>
        <el-form :model="searchModel" size="small">
          <el-form-item label="工位编号">
            <el-input v-model="searchModel.workStationName" placeholder="输入工位编号"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-select v-model="searchModel.user_id" placeholder="选择员工" style="width: 100%;">
              <el-option v-for="item in userListDataOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" size="small" style="width: 100%;">搜索</el-button>
          </el-form-item>
<!-- 操作按钮 -->
          <el-button-group class="toolbar-buttons">
          <el-button type="primary" @click="editCanvas" size="small" style="width: 33.333%;">
            <el-icon v-if="!isEditMode"><Edit /></el-icon>
            <el-icon v-else><Check /></el-icon>
            <span style="margin-left: 12px;">{{ isEditMode ? '完成编辑' : '编辑画布' }}</span>
          </el-button>
          <el-button type="success" @click="saveCanvas" size="small" style="width: 33.333%;">
            <el-icon><Document /></el-icon>
            <span style="margin-left: 12px;">保存画布</span>
          </el-button>
          <el-button type="danger" @click="deleteCanvas" size="small" style="width: 33.333%;">
            <el-icon><Delete /></el-icon>
            <span style="margin-left: 12px;">删除选中</span>
          </el-button>
        </el-button-group>
        
        </el-form>
      </div>

      <!-- 组件库 -->
      <div class="section">
        <div class="section-title">组件库</div>
        <el-scrollbar height="300px">
          <!-- 工位组件 -->
          <div class="component-group">
            <div class="group-title">工位组件</div>
            <div class="component-list">
              <div
                class="component-item"
                v-for="(template, index) in workstationComponents"
                :key="index"
                draggable="true"
                @dragstart="onTemplateDragStart(template)"
                @click="addWorkstationFromTemplate(template)">
                <el-icon><OfficeBuilding /></el-icon>
                <span>{{ template }}</span>
              </div>
            </div>
          </div>

          <!-- 家具组件 -->
          <div class="component-group">
            <div class="group-title">家具组件</div>
            <div class="component-list">
              <div
                class="component-item"
                v-for="(template, index) in furnitureComponents"
                :key="index"
                draggable="true"
                @dragstart="onTemplateDragStart(template)"
                @click="addWorkstationFromTemplate(template)">
                <el-icon><Box /></el-icon>
                <span>{{ template }}</span>
              </div>
            </div>
          </div>

          <!-- 文字组件 -->
          <div class="component-group">
            <div class="group-title">文字组件</div>
            <div class="component-list">
              <div
                class="component-item"
                v-for="(template, index) in textComponents"
                :key="index"
                draggable="true"
                @dragstart="onTemplateDragStart(template)"
                @click="addWorkstationFromTemplate(template)">
                <el-icon><Document /></el-icon>
                <span>{{ template }}</span>
              </div>
              <!-- 自定义文字组件 -->
              <div
                class="component-item custom-text"
                @click="showCustomTextDialog = true">
                <el-icon><Edit /></el-icon>
                <span>自定义文字</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 属性编辑 -->
      <div class="section" v-if="currentWorkstation">
        <div class="section-title">属性编辑</div>
        <el-form :model="selectedWorkstation" label-position="top" size="small">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="距左">
                <el-input-number v-model="selectedWorkstation.left" @change="updateWorkstation('left')" :min="0" size="small" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="距上">
                <el-input-number v-model="selectedWorkstation.top" @change="updateWorkstation('top')" :min="0" size="small" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="宽度">
                <el-input-number v-model="selectedWorkstation.width" @change="updateWorkstation('width')" :min="1" size="small" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="高度">
                <el-input-number v-model="selectedWorkstation.height" @change="updateWorkstation('height')" :min="1" size="small" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="旋转角度">
            <el-input-number v-model="selectedWorkstation.angle" @change="updateWorkstation('angle')" :min="0" :max="360" size="small" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item label="组件ID" >
            <el-input v-model="selectedWorkstation.id"  size="small" disabled></el-input>
          </el-form-item>
          <el-form-item label="工位编号">
            <el-input v-model="selectedWorkstation.workStationName" @input="updateWorkstation('workStationName')" size="small"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-select v-model="selectedWorkstation.name" @change="updateWorkstation('name')" size="small" style="width: 100%;">
              <el-option v-for="item in userListDataOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 自定义文字对话框 -->
    <el-dialog
      v-model="showCustomTextDialog"
      title="自定义文字"
      width="400px"
      @close="customText = ''">
      <el-form label-position="top">
        <el-form-item label="输入文字内容">
          <el-input
            v-model="customText"
            type="textarea"
            :rows="4"
            placeholder="请输入要显示的文字内容"
            maxlength="100"
            show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCustomTextDialog = false">取消</el-button>
        <el-button type="primary" @click="addCustomText">确定</el-button>
      </template>
    </el-dialog>
    <!-- @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag"  这三个方法写到 class="canvas-container" 的后面-->
    <div class="canvas-container" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" @dragover.prevent @drop="onCanvasDrop">
      <canvas ref="canvasContainer" ></canvas>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, onUnmounted, nextTick } from 'vue';
import { setworkdata, getworkdata, delworkdata, searchdata, getUserListData } from '@/api/demo'
import { fabric } from 'fabric';
import { ElNotification } from 'element-plus'
import { OfficeBuilding, Box, Document, Edit, Check, Delete } from '@element-plus/icons-vue'
import workstationLibrary from '@/views/component·/workstation-components';

const canvasContainer = ref(null);
let canvas = null;
const isDragging = ref(false);
const isEditMode = ref(false);
const userListDataOption = ref([])
const startX = ref(0)
const startY = ref(0)
// 组件分类
const workstationComponents = [
  '工位(L型)',
  '工位(长方形)'
];

const furnitureComponents = [
  '椅子',
  '墙',
  '桌子'
];

const textComponents = [
  '文字',
  '主入口大门(文字)',
  '机房(文字)',
  '男厕(文字)',
  '女厕(文字)',
  '会议室(文字)',
  '办公室(文字)'
];

// 自定义文字相关
const showCustomTextDialog = ref(false)
const customText = ref('')

// 拖拽相关
const draggingTemplate = ref(null)
const selectedWorkstation = reactive({
  id: '',
  left: '',
  top: '',
  width: '',
  height: '',
  angle: null,
  workStationName: '',
  name: null
});

// 搜索表单
const searchModel = reactive({
  workStationName: '',
  user_id: null,
  workStationFloor: 2
})

// 点击某个工位的数据（使用响应式引用）
const currentWorkstation = ref(null)

// === customType 映射函数（兼容新旧格式） ===
// 将数据库的旧 customType 映射到组件库类型
const mapDbTypeToComponentType = (dbType) => {
  const typeMap = {
    'lworkstation': 'l-workstation',
    'squareworkstation': 'square-workstation',
    'chairworkstation': 'chair',
    'wall': 'wall',
    'table': 'table',
    'text': 'text'
  };
  return typeMap[dbType] || dbType;
}

// 将组件库类型映射到数据库保存的格式（保持向后兼容）
const mapComponentTypeToDbType = (componentType) => {
  const typeMap = {
    'l-workstation': 'lworkstation',
    'square-workstation': 'squareworkstation',
    'chair': 'chairworkstation',
    'wall': 'wall',
    'table': 'table',
    'text': 'text'
  };
  return typeMap[componentType] || componentType;
}

// === 模板名称到组件类型的映射 ===
const templateToComponentType = {
  '工位(L型)': 'l-workstation',
  '工位(长方形)': 'square-workstation',
  '椅子': 'chair',
  '墙': 'wall',
  '桌子': 'table',
  '文字': 'text',
  '主入口大门(文字)': 'main-entrance',
  '机房(文字)': 'server-room',
  '男厕(文字)': 'men-restroom',
  '女厕(文字)': 'women-restroom',
  '会议室(文字)': 'meeting-room',
  '办公室(文字)': 'office'
}

// === 已移除旧的组件创建函数，现在使用组件库 workstationLibrary ===

// 工位点击按钮 - 使用组件库创建组件
const addWorkstationFromTemplate = (template) => {
  try {
    // 确保在编辑模式下才能添加组件
    if (!isEditMode.value) {
      ElNotification({
        title: '提示',
        message: '请先点击"编辑画布"按钮进入编辑模式',
        type: 'warning',
        duration: 2000
      });
      return;
    }

    // 获取组件类型
    const componentType = templateToComponentType[template];
    
    if (!componentType) {
      console.warn(`未找到模板 "${template}" 对应的组件类型`);
      return;
    }

    // 使用组件库创建组件
    const workstation = workstationLibrary.getComponent(componentType, {
      left: 10,
      top: 10,
      angle: 0,
      workStationName: '',
      name: null,
      floorNumber: searchModel.workStationFloor
    });

    // 设置组件的编辑状态
    workstation.set({
      selectable: isEditMode.value,
      hasControls: isEditMode.value,
      evented: isEditMode.value,
      floorNumber: searchModel.workStationFloor // 确保楼层正确
    });

    // 标记为已修改
    markAsModified(workstation);
    
    // 添加到画布
    canvas.add(workstation);
    
    // 设置工位颜色（新工位没有 user_id，应该是红色）
    setWorkstationColor(workstation);
    
    canvas.renderAll();
  } catch (error) {
    console.error('创建组件失败:', error);
    ElNotification({
      title: '创建失败',
      message: `创建组件时发生错误: ${error.message}`,
      type: 'error',
      duration: 3000
    });
  }
}

// 添加自定义文字
const addCustomText = () => {
  // 确保在编辑模式下才能添加组件
  if (!isEditMode.value) {
    ElNotification({
      title: '提示',
      message: '请先点击"编辑画布"按钮进入编辑模式',
      type: 'warning',
      duration: 2000
    });
    showCustomTextDialog.value = false;
    return;
  }

  if (!customText.value || !customText.value.trim()) {
    ElNotification({
      title: '提示',
      message: '请输入文字内容',
      type: 'warning',
      duration: 2000
    });
    return;
  }

  try {
    // 使用组件库创建文字组件
    const workstation = workstationLibrary.getComponent('text', {
      left: 10,
      top: 10,
      angle: 0,
      text: customText.value.trim(),
      workStationName: customText.value.trim(),
      name: null,
      floorNumber: searchModel.workStationFloor,
      fontSize: 15
    });

    // 设置组件的编辑状态
    workstation.set({
      selectable: isEditMode.value,
      hasControls: isEditMode.value,
      evented: isEditMode.value,
      floorNumber: searchModel.workStationFloor // 确保楼层正确
    });

    // 标记为已修改
    markAsModified(workstation);
    
    // 添加到画布
    canvas.add(workstation);
    canvas.renderAll();

    // 关闭对话框并清空输入
    showCustomTextDialog.value = false;
    customText.value = '';

    ElNotification({
      title: '成功',
      message: '自定义文字已添加到画布',
      type: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('创建自定义文字失败:', error);
    ElNotification({
      title: '创建失败',
      message: `创建自定义文字时发生错误: ${error.message}`,
      type: 'error',
      duration: 3000
    });
  }
}

// 模板拖拽 - 开始
const onTemplateDragStart = (template) => {
  draggingTemplate.value = template
}

// 画布放置
const onCanvasDrop = (event) => {
  if (!draggingTemplate.value) return
  
  // 确保在编辑模式下才能添加组件
  if (!isEditMode.value) {
    ElNotification({
      title: '提示',
      message: '请先点击"编辑画布"按钮进入编辑模式',
      type: 'warning',
      duration: 2000
    });
    draggingTemplate.value = null;
    return;
  }
  
  event.preventDefault();
  event.stopPropagation();
  
  const rect = canvasContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  // 将屏幕坐标转为画布坐标（考虑缩放和平移）
  const vpt = canvas.viewportTransform;
  const left = Math.floor((x - vpt[4]) / vpt[0]);
  const top = Math.floor((y - vpt[5]) / vpt[3]);

  // 基于模板创建并定位
  let created;
  // 复用创建逻辑：先创建，再设置坐标
  const beforeCount = canvas.getObjects().length
  addWorkstationFromTemplate(draggingTemplate.value)
  const afterObjs = canvas.getObjects()
  if (afterObjs.length > beforeCount) {
    created = afterObjs[afterObjs.length - 1]
    // 确保设置正确的楼层和位置，以及所有必要属性
    created.set({ 
      left, 
      top,
      floorNumber: searchModel.workStationFloor, // 确保楼层正确
      workStationName: created.workStationName || '', // 确保工位编号
      name: created.name || null, // 确保员工姓名
      customType: created.customType // 确保类型正确
    })
    
    // 标记为已修改，确保会被保存
    markAsModified(created)
    
    // 设置工位颜色（新工位没有 user_id，应该是红色）
    setWorkstationColor(created)
    
    console.log('拖拽创建的组件:', {
      customType: created.customType,
      floorNumber: created.floorNumber,
      left: created.left,
      top: created.top,
      id: created.id
    });
    
    canvas.renderAll()
  } else {
    console.error('拖拽创建组件失败，对象数量未增加');
  }
  draggingTemplate.value = null
}

// 设置元素信息
const updateWorkstation = (property) => {
  if (currentWorkstation.value) {
    switch (property) {
      case 'left':
        currentWorkstation.value.set('left', Math.floor(selectedWorkstation.left) || 0);
        break;
      case 'top':
        currentWorkstation.value.set('top', Math.floor(selectedWorkstation.top) || 0);
        break;
      case 'width':
        // 检查是否为可缩放类型（Group 或 Text）
        const isScalableForWidth = [
          'l-workstation', 'square-workstation', 'chair', 'text',
          'lworkstation', 'squareworkstation', 'chairworkstation' // 兼容旧格式
        ].includes(currentWorkstation.value.customType);
        
        if (isScalableForWidth) {
          const desiredWidth = Math.floor(selectedWorkstation.width) || Math.floor(currentWorkstation.value.getScaledWidth());
          const baseWidth = currentWorkstation.value.getScaledWidth() / (currentWorkstation.value.scaleX || 1) || 1;
          const scaleX = desiredWidth / baseWidth;
          currentWorkstation.value.set('scaleX', scaleX);
        } else {
          const width = Math.floor(selectedWorkstation.width || currentWorkstation.value.width || currentWorkstation.value.getScaledWidth());
          currentWorkstation.value.set('width', width);
        }
        break;
      case 'height':
        // 检查是否为可缩放类型（Group 或 Text）
        const isScalableForHeight = [
          'l-workstation', 'square-workstation', 'chair', 'text',
          'lworkstation', 'squareworkstation', 'chairworkstation' // 兼容旧格式
        ].includes(currentWorkstation.value.customType);
        
        if (isScalableForHeight) {
          const desiredHeight = Math.floor(selectedWorkstation.height) || Math.floor(currentWorkstation.value.getScaledHeight());
          const baseHeight = currentWorkstation.value.getScaledHeight() / (currentWorkstation.value.scaleY || 1) || 1;
          const scaleY = desiredHeight / baseHeight;
          currentWorkstation.value.set('scaleY', scaleY);
        } else {
          const height = Math.floor(selectedWorkstation.height || currentWorkstation.value.height || currentWorkstation.value.getScaledHeight());
          currentWorkstation.value.set('height', height);
        }
        break;
      case 'angle':
        currentWorkstation.value.set('angle', Math.floor(selectedWorkstation.angle) || 0);
        break;
      case 'workStationName':
        currentWorkstation.value.set('workStationName', selectedWorkstation.workStationName || '');
        break;
      case 'name':
        currentWorkstation.value.set('name', selectedWorkstation.name || null);
        // 更新工位颜色（根据是否有 user_id）
        setWorkstationColor(currentWorkstation.value);
        break;
    }
    markAsModified(currentWorkstation.value)
    canvas.renderAll();
  }
}

const prepareDataForSave = (objects) => {
  return objects.map(obj => {
    let width, height, scaleX, scaleY;
    const componentType = obj.customType;
    
    // 检查是否为 Group 或 Text 类型（需要处理缩放）
    const isScalableType = [
      'text',
      'l-workstation', 'square-workstation', 'chair',
      'lworkstation', 'squareworkstation', 'chairworkstation' // 兼容旧格式
    ].includes(componentType);
    
    if (isScalableType) {
      // 对于 Group 和 Text 类型，保存缩放后的尺寸和缩放比例
      width = Math.floor(obj.getScaledWidth())
      height = Math.floor(obj.getScaledHeight())
      scaleX = obj.scaleX || 1
      scaleY = obj.scaleY || 1
    } else if (componentType === 'table' || componentType === 'wall') {
      // 对于 Rect 类型，直接使用 width 和 height
      width = obj.width
      height = obj.height
    } else if (componentType === 'circle') {
      width = height = obj.radius * 2
    } else {
      width = height = 0
    }
    
    // 将组件库的 customType 转换为数据库格式（保持向后兼容）
    const dbType = mapComponentTypeToDbType(componentType);
    
    const result = {
      left: Math.floor(obj.left),
      top: Math.floor(obj.top),
      width: width,
      height: height,
      angle: Math.floor(obj.angle),
      workStationName: obj.workStationName || '',
      name: Number(obj.name) || null,
      customType: dbType, // 保存为数据库格式
      id: obj.id || null,
      floorNumber: obj.floorNumber
    }
    
    // 如果有缩放比例，也保存（用于更精确的恢复）
    if (scaleX !== undefined && scaleY !== undefined && isScalableType) {
      result.scaleX = scaleX
      result.scaleY = scaleY
    }
    
    return result
  })
}

// 鼠标按下（用于画布拖拽）
const startDrag = (event) => {
  if (isEditMode.value) {
    return;
  }
  
  // 如果点击的是画布上的对象，不进行画布拖拽（让 canvas 的 mouse:down 事件处理）
  // 这个事件是在 canvas-container 的 div 上触发的，不是 canvas 本身
  // 所以如果点击的是 canvas 区域，才进行画布拖拽
  const target = event.target;
  if (target && target.tagName === 'CANVAS') {
    // 点击的是 canvas 本身（空白区域），可以进行画布拖拽
    if (event.target && event.target.style) {
      event.target.style.cursor = 'grabbing';
    }
    isDragging.value = true;
    startX.value = event.clientX;
    startY.value = event.clientY;
  }
  // 如果点击的不是 canvas，可能是点击了其他元素，不处理
}
// 鼠标移动
const drag = (event) => {
  if (isEditMode.value) {
    return;
  }
  if (!isDragging.value) return;
  
  const dx = event.clientX - startX.value;
  const dy = event.clientY - startY.value;

  canvas.relativePan({ x: dx, y: dy });

  startX.value = event.clientX;
  startY.value = event.clientY;
};
// 鼠标抬起
const endDrag = (event) => {
  if (isEditMode.value) {
    return;
  }
  if (event.target && event.target.style) {
    event.target.style.cursor = 'grabbing';
  }
  isDragging.value = false;
};

// 根据屏幕尺寸设置元素默认缩放比例
const setDefaultZoom = () => {
  const screenWidth = window.innerWidth;
  let defaultZoom = 1.0;

  if (screenWidth <= 1440) {
    defaultZoom = 0.75; // 笔记本屏幕的默认缩放比例
  } else {
    defaultZoom = 1.0; // 台式机屏幕的默认缩放比例
  }

  canvas.setZoom(defaultZoom);
  canvas.renderAll();
};

let currentNotification = ref(null); // 用于存储当前通知的引用
// 搜索工位显示工位信息
const showNotification = (title, message) => {
  if (currentNotification.value) {
    // 如果已经有通知，则先关闭它
    currentNotification.value.close();
    // 通知关闭后清除引用
    currentNotification.value = null;
  }

  currentNotification.value = ElNotification({
    title: title,
    message: message,
    dangerouslyUseHTMLString: true,
    duration: 0,
    type: 'success'
  })
};


// 保存画布按钮
const saveCanvas = async () => {
  try {
    // 取消当前选中状态
    canvas.discardActiveObject()
    canvas.renderAll()
    
    // 保存画布上的所有对象（不仅仅是修改过的），确保所有更改都被保存
    const allObjects = canvas.getObjects().filter(obj => {
      // 只保存有 customType 的对象（排除可能存在的其他元素）
      if (!obj.customType) {
        console.log('跳过无 customType 的对象:', obj);
        return false;
      }
      
      // 如果对象没有设置楼层，设置为当前楼层
      if (!obj.floorNumber) {
        console.log('对象缺少楼层信息，设置为当前楼层:', obj.customType, searchModel.workStationFloor);
        obj.set('floorNumber', searchModel.workStationFloor);
      }
      
      // 只保存当前楼层的对象
      const shouldSave = obj.floorNumber === searchModel.workStationFloor;
      if (!shouldSave) {
        console.log('跳过不同楼层的对象:', obj.customType, '楼层:', obj.floorNumber, '当前楼层:', searchModel.workStationFloor);
      }
      return shouldSave;
    })
    
    console.log('画布上的所有对象:', canvas.getObjects().map(obj => ({
      customType: obj.customType,
      floorNumber: obj.floorNumber,
      id: obj.id,
      left: obj.left,
      top: obj.top
    })));
    
    console.log('过滤后的对象数量:', allObjects.length);
    
    const workstationData = prepareDataForSave(allObjects)
    
    // 如果没有数据，提示用户
    if (workstationData.length === 0) {
      ElNotification({
        title: '提示',
        message: '画布上没有需要保存的工位',
        type: 'warning'
      })
      return
    }

    console.log('准备保存的数据:', workstationData);

    // 保存到数据库
    const response = await setworkdata(workstationData)
    
    // 检查响应是否成功
    if (response && response.data && !response.data.success) {
      throw new Error(response.data.message || '保存失败')
    }

    // 保存成功后，立即重新加载画布，完全替换页面布局
    await loadCanvas()
    
    // 重置当前选中的工位
    currentWorkstation.value = null
    selectedWorkstation.id = ''
    selectedWorkstation.left = ''
    selectedWorkstation.top = ''
    selectedWorkstation.width = ''
    selectedWorkstation.height = ''
    selectedWorkstation.angle = null
    selectedWorkstation.workStationName = ''
    selectedWorkstation.name = null
    
    // 显示保存成功提示
    ElNotification({
      title: '保存成功',
      message: `已保存 ${workstationData.length} 个工位到数据库，页面已刷新`,
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    console.error('保存失败:', error)
    ElNotification({
      title: '保存失败',
      message: error.message || '保存工位时发生错误，请重试',
      type: 'error',
      duration: 3000
    })
  }
}

// 编辑画布
const editCanvas = () => {
  if (isEditMode.value) {
    disableEditing()
  } else {
    enableEditing()
  }
};

// 开启选项
const enableEditing = () => {
  isEditMode.value = true;
  canvas.selection = true;
  canvas.defaultCursor = 'default';
  canvas.skipTargetFind = false;
  canvas.getObjects().forEach(obj => {
    if (obj.customType) {
      obj.set({
        selectable: true,
        hasControls: true,
        evented: true,
        lockMovementX: false, // 允许X轴移动
        lockMovementY: false, // 允许Y轴移动
        lockRotation: false, // 允许旋转
        lockScalingX: false, // 允许X轴缩放
        lockScalingY: false // 允许Y轴缩放
      });
    }
  });
  canvas.renderAll();
};

// 禁用选项
const disableEditing = () => {
  isEditMode.value = false;
  canvas.selection = true; // 保持选择功能，但禁用编辑
  canvas.defaultCursor = 'grab';
  canvas.skipTargetFind = false; // 允许选择对象查看属性
  canvas.getObjects().forEach(obj => {
    if (obj.customType) {
      obj.set({
        selectable: true, // 允许选择查看属性
        hasControls: false, // 禁用控制点
        evented: true, // 允许事件
        lockMovementX: true, // 锁定X轴移动
        lockMovementY: true, // 锁定Y轴移动
        lockRotation: true, // 锁定旋转
        lockScalingX: true, // 锁定X轴缩放
        lockScalingY: true // 锁定Y轴缩放
      });
    }
  });
  // 清除当前选择，但保留选择功能
  canvas.discardActiveObject();
  currentWorkstation.value = null;
  selectedWorkstation.id = '';
  selectedWorkstation.left = '';
  selectedWorkstation.top = '';
  selectedWorkstation.width = '';
  selectedWorkstation.height = '';
  selectedWorkstation.angle = null;
  selectedWorkstation.workStationName = '';
  selectedWorkstation.name = null;
  canvas.renderAll();
};

// 加载画布信息 - 使用组件库加载组件
const loadCanvas = async () => {
  // 加载前移除画布上的所有对象
  canvas.getObjects().forEach(obj => canvas.remove(obj))

  try {
    const res = await getworkdata(searchModel.workStationFloor)
    const datas = res.data
    
    datas.forEach(item => {
      try {
        // 将数据库的 customType 转换为组件库类型
        const componentType = mapDbTypeToComponentType(item.customType);
        
        // 准备组件选项
        const componentOptions = {
          left: item.left_position,
          top: item.top_position,
          angle: item.angle,
          workStationName: item.workStationName || '',
          name: item.user_id || null,
          floorNumber: item.floorNumber,
          id: item.id
        };

        // 根据组件类型添加特定选项
        if (componentType === 'wall') {
          componentOptions.width = item.width;
          componentOptions.height = item.height;
          componentOptions.fill = '#000';
        } else if (componentType === 'table') {
          componentOptions.width = item.width;
          componentOptions.height = item.height;
          componentOptions.fill = '#fff';
          componentOptions.stroke = 'black';
        } else if (componentType === 'text') {
          componentOptions.text = item.workStationName || '文字';
          componentOptions.fontSize = 15;
          componentOptions.fontFamily = 'Arial';
        }

        // 使用组件库创建组件
        let workstation = workstationLibrary.getComponent(componentType, componentOptions);
        
        // 设置 ID 和其他属性（组件库创建后设置）
        if (item.id) {
          workstation.set('id', item.id);
        }
        
        // 确保 customType 正确（组件库已设置，但确保一致性）
        workstation.set('customType', componentType);

        // 处理缩放比例
        const isScalableType = ['l-workstation', 'square-workstation', 'chair', 'text'].includes(componentType);
        
        if (isScalableType) {
          // 优先使用保存的缩放比例
          if (item.scaleX !== null && item.scaleX !== undefined && item.scaleY !== null && item.scaleY !== undefined) {
            workstation.set({ scaleX: item.scaleX, scaleY: item.scaleY });
          } else {
            // 如果没有保存的缩放比例，需要计算
            canvas.add(workstation);
            canvas.renderAll();
            // 获取对象的原始尺寸（确保 scaleX 和 scaleY 为 1）
            workstation.set({ scaleX: 1, scaleY: 1 });
            canvas.renderAll();
            const originalRect = workstation.getBoundingRect();
            const originalWidth = originalRect.width;
            const originalHeight = originalRect.height;
            // 计算缩放比例
            if (originalWidth > 0 && originalHeight > 0) {
              const scaleX = item.width / originalWidth;
              const scaleY = item.height / originalHeight;
              workstation.set({ scaleX, scaleY });
            }
          }
        }
        
        // 设置组件的编辑状态
        if (isEditMode.value) {
          workstation.set({
            selectable: true,
            hasControls: true,
            evented: true,
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            modified: false
          });
        } else {
          workstation.set({
            selectable: true,
            hasControls: false,
            evented: true,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            modified: false
          });
        }
        
        // 添加到画布（如果还没添加）
        if (!isScalableType || (item.scaleX !== null && item.scaleX !== undefined)) {
          canvas.add(workstation);
        }
      } catch (error) {
        console.error('加载组件失败:', item, error);
      }
    });

    // 设置所有工位的颜色（根据是否有 user_id）
    canvas.getObjects().forEach(obj => {
      if (obj.customType === 'lworkstation' || obj.customType === 'l-workstation') {
        setWorkstationColor(obj, true); // 跳过渲染，批量处理
      }
    });

    canvas.renderAll(); // 统一更新画布显示
    disableEditing()
  } catch (error) {
    console.error('加载画布失败:', error);
    ElNotification({
      title: '加载失败',
      message: `加载画布数据时发生错误: ${error.message}`,
      type: 'error',
      duration: 3000
    });
  }
};

// 下拉选择
const ouedrt = (data) => {
  if (currentNotification.value) {
    // 如果已经有通知，则先关闭它
    currentNotification.value.close();
    // 通知关闭后清除引用
    currentNotification.value = null;
  }
  canvas.getObjects().forEach(object => {
    canvas.remove(object);
  });
  loadCanvas()
}

// 删除画布
const deleteCanvas = async () => {
  if (currentWorkstation.value) {
    const res = await delworkdata(currentWorkstation.value.id)
    canvas.remove(currentWorkstation.value);
    loadCanvas()
    // canvas.renderAll(); // 更新画布显示
    currentWorkstation.value = null;
  } else {
    ElNotification({
      title: '提示',
      message: '没有选中任何画布对象，或对象已不存在于画布中',
      type: 'warning',
      duration: 2000
    });
  }
}

// 搜索
const search = async () => {
  if (searchModel.workStationName === '' && searchModel.user_id === null) {
    return false
  }

  const res = await searchdata(searchModel)
  console.log(res);
  if (res.data.length === 0) {
    alert('未找到匹配的工作站');
  } else {
    // 关闭现有的通知
    if (currentNotification.value) {
      currentNotification.value.close();
    }
    // 检查是否为 Group 类型（工位组件）
    const isGroupType = (type) => {
      return [
        'l-workstation', 'square-workstation', 'chair',
        'lworkstation', 'squareworkstation', 'chairworkstation' // 兼容旧格式
      ].includes(type);
    };

    // 重置所有对象的颜色
    canvas.getObjects().forEach(obj => {
      if (isGroupType(obj.customType) && obj._objects) {
        // 对于 lworkstation 类型，先恢复为根据 user_id 设置的颜色
        if (obj.customType === 'lworkstation' || obj.customType === 'l-workstation') {
          setWorkstationColor(obj, true); // 跳过渲染，批量处理
        } else {
          // 其他 Group 类型，设置内部对象颜色为白色
          obj._objects.forEach((item) => {
            item.set({
              fill: '#FFF', // 恢复默认颜色 (白色)
              stroke: '#000', // 边框颜色
            });
          });
        }
      } else if (obj.customType === 'wall') {
        obj.set({ fill: '#000' }); // 恢复默认颜色 (黑色)
      } else if (obj.customType === 'table') {
        obj.set({ fill: '#fff' }); // 恢复默认颜色 (白色)
      }
    });

    const matchedIds = res.data.map(item => item.id);
    let firstMatchedObj = null;

    canvas.getObjects().forEach(obj => {
      if (isGroupType(obj.customType) && obj._objects) {
        // Group 类型，设置内部对象颜色
        obj._objects.forEach((item) => {
          if (matchedIds.includes(obj.id)) {
            item.set({
              fill: '#FFFF00', // 高亮颜色 (黄色)
              stroke: '#000', // 边框颜色
            });
            if (!firstMatchedObj) {
              firstMatchedObj = obj;
            }
          } else {
            item.set({
              fill: '#FFF', // 恢复默认颜色 (白色)
              stroke: '#000', // 边框颜色
            });
          }
        });
      } else if (obj.customType === 'wall') {
        if (matchedIds.includes(obj.id)) {
          obj.set({ fill: '#FFFF00' });
          if (!firstMatchedObj) {
            firstMatchedObj = obj;
          }
        } else {
          obj.set({ fill: '#000' });
        }
      } else if (obj.customType === 'table') {
        if (matchedIds.includes(obj.id)) {
          obj.set({ fill: '#FFFF00' });
          if (!firstMatchedObj) {
            firstMatchedObj = obj;
          }
        } else {
          obj.set({ fill: '#fff' });
        }
      }
    });

    // 刷新画布以显示颜色变化
    canvas.renderAll();

    if (firstMatchedObj) {
      const message = `
        <div>
          <p>工位编号: ${ firstMatchedObj.workStationName }</p>
          <p>员工姓名: ${ firstMatchedObj.name }</p>
        </div>`
      showNotification(`${ firstMatchedObj.floorNumber }层`, message);
    }
  }
}

// 更新workstation选择信息
const updateSelectedWorkstation = (workstation) => {
  if (!workstation) {
    console.warn('updateSelectedWorkstation: workstation 为空');
    return;
  }
  
  console.log('更新选中组件属性:', {
    customType: workstation.customType,
    left: workstation.left,
    top: workstation.top,
    width: workstation.getScaledWidth(),
    height: workstation.getScaledHeight()
  });
  
  selectedWorkstation.id = workstation.id || '';
  selectedWorkstation.left = Math.floor(workstation.left || 0);
  selectedWorkstation.top = Math.floor(workstation.top || 0);
  selectedWorkstation.width = Math.floor(workstation.getScaledWidth() || 0);
  selectedWorkstation.height = Math.floor(workstation.getScaledHeight() || 0);
  selectedWorkstation.angle = Math.floor(workstation.angle || 0);
  selectedWorkstation.workStationName = workstation.workStationName || '';
  selectedWorkstation.name = workstation.name || null;
  
  console.log('更新后的 selectedWorkstation:', { ...selectedWorkstation });
};

const markAsModified = (object) => {
  if (object) {
    object.set('modified', true); // 标记元素为已修改
  }
};

// 设置工位颜色（根据是否有 user_id）
const setWorkstationColor = (workstation, skipRender = false) => {
  if (!workstation) return;
  
  // 检查是否为 lworkstation 类型（兼容新旧格式）
  const isLWorkstation = workstation.customType === 'lworkstation' || workstation.customType === 'l-workstation';
  
  if (!isLWorkstation) return;
  
  // 检查是否有 user_id（name 字段）
  const hasUserId = workstation.name !== null && workstation.name !== undefined && workstation.name !== '';
  
  // 设置颜色：有 user_id 为绿色，没有为红色
  const fillColor = hasUserId ? '#4CAF50' : '#FF6B6B'; // 绿色或红色
  
  // 如果是 Group 类型，设置内部对象的颜色
  if (workstation._objects && Array.isArray(workstation._objects)) {
    workstation._objects.forEach((item) => {
      item.set({
        fill: fillColor,
        stroke: '#000', // 边框保持黑色
      });
    });
    // 如果不跳过渲染，则刷新画布以显示颜色变化
    if (!skipRender) {
      canvas.renderAll();
    }
  }
};

const getUserListDataFunc = async () => {
  const res = await getUserListData()
  userListDataOption.value = res.data
}

onMounted(() => {
  getUserListDataFunc()

  canvas = new fabric.Canvas(canvasContainer.value, {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#e5e5e5',
    selection: false
  });
  canvas.defaultCursor = 'grab';
  canvas.skipTargetFind = true;
  loadCanvas()

   // 设置默认缩放比例
   setDefaultZoom();

    // 监听窗口大小变化，调整默认缩放比例
    window.addEventListener('resize', setDefaultZoom);

  // 缩放
  canvas.on('mouse:wheel', (opt) => {
    let delta = opt.e.deltaY
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 5) zoom = 5
    if (zoom < 0.5) zoom = 0.5
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
    opt.e.preventDefault()
    opt.e.stopPropagation()
  })

  // 监听选择创建事件
  canvas.on('selection:created', (e) => {
    console.log('selection:created 触发', e);
    if (e.selected && e.selected.length > 0) {
      currentWorkstation.value = e.selected[0];
      updateSelectedWorkstation(currentWorkstation.value);
      console.log('选择创建，更新属性显示');
    }
  });

  // 监听选择更新事件
  canvas.on('selection:updated', (e) => {
    console.log('selection:updated 触发', e);
    if (e.selected && e.selected.length > 0) {
      currentWorkstation.value = e.selected[0];
      updateSelectedWorkstation(currentWorkstation.value);
      console.log('选择更新，更新属性显示');
    }
  });
  
  // 监听对象被选中事件（更直接的方式）
  canvas.on('object:selected', (e) => {
    console.log('object:selected 触发', e.target);
    if (e.target && e.target.customType) {
      currentWorkstation.value = e.target;
      updateSelectedWorkstation(e.target);
      console.log('对象被选中，更新属性显示');
    }
  });

  // 监听选择清除事件
  canvas.on('selection:cleared', () => {
    currentWorkstation.value = null;
    selectedWorkstation.id = '';
    selectedWorkstation.left = '';
    selectedWorkstation.top = '';
    selectedWorkstation.width = '';
    selectedWorkstation.height = '';
    selectedWorkstation.angle = null;
    selectedWorkstation.workStationName = '';
    selectedWorkstation.name = null;
  });

  // 监听鼠标点击事件（用于在非编辑模式下也能选择对象查看属性）
  canvas.on('mouse:down', (e) => {
    // 在编辑模式下，让 fabric 自己处理选择
    if (isEditMode.value) {
      return;
    }
    
    // 非编辑模式下，如果点击的是对象，选中它来查看属性
    if (e.target && e.target.customType) {
      // 阻止默认行为，避免触发画布拖拽
      e.e.preventDefault();
      e.e.stopPropagation();
      
      // 选中对象并更新属性显示
      canvas.setActiveObject(e.target);
      currentWorkstation.value = e.target;
      updateSelectedWorkstation(e.target);
      canvas.renderAll();
      
      console.log('点击选中组件:', e.target.customType, 'currentWorkstation.value:', currentWorkstation.value);
    } else if (!e.target) {
      // 点击空白处，清除选择
      canvas.discardActiveObject();
      currentWorkstation.value = null;
      selectedWorkstation.id = '';
      selectedWorkstation.left = '';
      selectedWorkstation.top = '';
      selectedWorkstation.width = '';
      selectedWorkstation.height = '';
      selectedWorkstation.angle = null;
      selectedWorkstation.workStationName = '';
      selectedWorkstation.name = null;
      canvas.renderAll();
    }
  });

  canvas.on('object:moving', (e) => {
    // 只在编辑模式下允许移动
    if (!isEditMode.value) {
      e.e.preventDefault();
      return;
    }
    
    if (e.target) {
      let activeObject = e.target;
      markAsModified(activeObject)

      selectedWorkstation.left = Math.floor(e.target.left);
      selectedWorkstation.top = Math.floor(e.target.top);

      // 获取画布的宽度和高度
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;

      const objectWidth = activeObject.getScaledWidth();
      const objectHeight = activeObject.getScaledHeight();

      // 限制对象的左侧边界
      if (activeObject.left <= 0) {
        activeObject.left = 0;
        selectedWorkstation.left = 0
      }

      // 限制对象的右侧边界
      if (activeObject.left + objectWidth >= canvasWidth) {
        activeObject.left = (canvasWidth - objectWidth);
        selectedWorkstation.left = (canvasWidth - objectWidth)
      }

      // 限制对象的上侧边界
      if (activeObject.top <= 0) {
        activeObject.top = 0;
        selectedWorkstation.top = 0
      }

      // 限制对象的下侧边界
      if (activeObject.top + objectHeight > canvasHeight) {
        activeObject.top = (canvasHeight - objectHeight);
        selectedWorkstation.top = (canvasHeight - objectHeight)
      }
    }
  });

  // 缩放
  canvas.on('object:scaling', (e) => {
    if (e.target) {
      const obj = e.target
      markAsModified(obj)
      selectedWorkstation.width = Math.floor(obj.getScaledWidth());
      selectedWorkstation.height = Math.floor(obj.getScaledHeight());
    }
  });

  // 旋转
  canvas.on('object:rotating', (e) => {
    if (e.target) {
      markAsModified(e.target)
      selectedWorkstation.angle = Math.floor(e.target.angle);
    }
  });
})
onUnmounted(() => {
  if (canvas) {
    canvas.dispose(); // 清理canvas资
  }
  window.removeEventListener('resize', setDefaultZoom);
});
</script>
<style scoped lang="scss">
.workstation-manager {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;

  .left-sidebar {
    width: 320px;
    height: 100%;
    background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 10;

    // 工具栏区域
    .toolbar-section {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(0, 0, 0, 0.2);

      .toolbar-buttons {
        width: 100%;
        display: flex;
        gap: 8px;

        :deep(.el-button) {
          flex: 1;
        }
      }
    }

    // 通用区块样式
    .section {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #ecf0f1;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      }

      :deep(.el-form-item) {
        margin-bottom: 12px;

        .el-form-item__label {
          color: #bdc3c7;
          font-size: 12px;
          font-weight: 500;
        }

        .el-input,
        .el-select,
        .el-input-number {
          :deep(.el-input__inner),
          :deep(.el-input__wrapper) {
            background-color: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            color: #ecf0f1;

            &:focus {
              background-color: rgba(255, 255, 255, 0.15);
              border-color: #3498db;
            }
          }
        }
      }
    }

    // 组件库样式
    .component-group {
      margin-bottom: 20px;

      .group-title {
        font-size: 13px;
        font-weight: 600;
        color: #95a5a6;
        margin-bottom: 10px;
        padding-left: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .component-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .component-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #ecf0f1;
        font-size: 13px;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #3498db;
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
        }

        &:active {
          transform: translateX(2px);
        }

        .el-icon {
          font-size: 16px;
          color: #3498db;
        }

        span {
          flex: 1;
        }

        &.custom-text {
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(155, 89, 182, 0.2) 100%);
          border-color: rgba(52, 152, 219, 0.3);

          &:hover {
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.3) 0%, rgba(155, 89, 182, 0.3) 100%);
            border-color: #3498db;
          }

          .el-icon {
            color: #9b59b6;
          }
        }
      }
    }

    // 滚动条样式
    :deep(.el-scrollbar__bar) {
      &.is-vertical {
        right: 4px;
        width: 6px;

        .el-scrollbar__thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;

          &:hover {
            background-color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }

  .canvas-container {
    flex: 1;
    height: 100%;
    overflow: hidden;
    background: #e8e8e8;
    position: relative;

    canvas {
      display: block;
    }
  }
}

// 对话框样式优化
:deep(.el-dialog) {
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    margin: 0;

    .el-dialog__title {
      color: white;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: white;
        font-size: 20px;

        &:hover {
          color: #f0f0f0;
        }
      }
    }
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .workstation-manager {
    .left-sidebar {
      width: 280px;
    }
  }
}

#tooltip {
  position: absolute;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  display: none;
  pointer-events: none;
}
</style>