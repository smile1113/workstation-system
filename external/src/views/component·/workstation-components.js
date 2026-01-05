// workstation-components.js - 工位组件库
import { fabric } from 'fabric';

class WorkstationComponentLibrary {
  constructor() {
    this.components = new Map();
    this.initializeComponents();
  }

  // 初始化所有组件
  initializeComponents() {
    // L型工位
    this.registerComponent('l-workstation', this.createLWorkstation);
    
    // 长方形工位
    this.registerComponent('square-workstation', this.createSquareWorkstation);
    
    // 椅子
    this.registerComponent('chair', this.createChair);
    
    // 墙
    this.registerComponent('wall', this.createWall);
    
    // 桌子
    this.registerComponent('table', this.createTable);
    
    // 文字
    this.registerComponent('text', this.createText);
    
    // 预设文字标签
    this.registerComponent('main-entrance', this.createMainEntrance);
    this.registerComponent('server-room', this.createServerRoom);
    this.registerComponent('men-restroom', this.createMenRestroom);
    this.registerComponent('women-restroom', this.createWomenRestroom);
    this.registerComponent('meeting-room', this.createMeetingRoom);
    this.registerComponent('office', this.createOffice);
  }

  // 注册组件
  registerComponent(type, creator) {
    this.components.set(type, creator);
  }

  // 获取组件
  getComponent(type, options = {}) {
    const creator = this.components.get(type);
    if (!creator) {
      throw new Error(`Component type '${type}' not found`);
    }
    return creator.call(this, options);
  }

  // 获取所有可用组件类型
  getAvailableComponents() {
    return Array.from(this.components.keys());
  }

  // === 组件创建方法 ===

  createLWorkstation(options = {}) {
    const {
      left = 0,
      top = 0,
      angle = 0,
      workStationName = '',
      name = null,
      floorNumber = 2,
      fill = '#fff',
      stroke = 'black'
    } = options;

    const path1 = new fabric.Path(`
      M 0 0
      L 25 0
      L 25 75
      L 1 75
      L 1 33
      C 1 28, -5 23, -10 23
      L -50 23
      L -50 0
      Z
    `);

    const rect = new fabric.Rect({
      width: 3,
      height: 25,
      angle: -43,
      left: 0,
      top: 7
    });

    const rect1 = new fabric.Path('M 5 7 L 10 8 L 17.5 16 L 18 21 Z');
    
    const jianpan1 = new fabric.Rect({
      width: 7,
      height: 19,
      angle: -42.7,
      left: -6,
      top: 16.5
    });
    
    const jianpan2 = new fabric.Rect({
      width: 4,
      height: 10,
      angle: -42.7,
      left: -4,
      top: 16.5
    });
    
    const jianpan3 = new fabric.Rect({
      width: 4,
      height: 5,
      angle: -42.7,
      left: 3.7,
      top: 24.8
    });
    
    const zuoyi1 = new fabric.Rect({
      width: 20,
      height: 22,
      angle: -42.7,
      rx: 2,
      ry: 2,
      left: -35,
      top: 41
    });
    
    const zuoyi2 = new fabric.Rect({
      width: 15,
      height: 2,
      angle: -42.7,
      rx: 1,
      ry: 1,
      left: -36,
      top: 39
    });
    
    const zuoyi3 = new fabric.Rect({
      width: 15,
      height: 2,
      angle: -42.7,
      rx: 1,
      ry: 1,
      left: -20,
      top: 57
    });
    
    const zuoyi4 = new fabric.Rect({
      width: 3,
      height: 22,
      angle: -42.7,
      rx: 1,
      ry: 1,
      left: -37,
      top: 42.4
    });

    const objects = [path1, rect, rect1, jianpan1, jianpan2, jianpan3, zuoyi1, zuoyi2, zuoyi3, zuoyi4];
    
    objects.forEach(obj => {
      obj.set({ fill, stroke });
    });

    return new fabric.Group(objects, {
      left,
      top,
      angle,
      workStationName,
      name,
      customType: 'l-workstation',
      floorNumber,
      selectable: true,
      hasControls: true,
      evented: true
    });
  }

  createSquareWorkstation(options = {}) {
    const {
      left = 0,
      top = 0,
      angle = 0,
      workStationName = '',
      name = null,
      floorNumber = 2,
      fill = '#fff',
      stroke = 'black'
    } = options;

    const table = new fabric.Rect({
      width: 62,
      height: 24,
      angle: 0,
      left: 0,
      top: 0
    });

    const rect = new fabric.Rect({
      width: 25,
      height: 3,
      angle: 0,
      left: 18.5,
      top: 7
    });

    const rect1 = new fabric.Path('M 5 7 L 10 8 L 17.5 16 L 18 21 Z', {
      left: 21,
      top: 7,
      angle: -47
    });

    const jianpan1 = new fabric.Rect({
      width: 7,
      height: 19,
      left: 41.5,
      top: 13.5,
      angle: 90
    });

    const jianpan2 = new fabric.Rect({
      width: 4,
      height: 10,
      left: 33.8,
      top: 15,
      angle: 90
    });

    const jianpan3 = new fabric.Rect({
      width: 4,
      height: 5,
      left: 40.2,
      top: 15,
      angle: 90
    });

    const zuoyi1 = new fabric.Rect({
      width: 20,
      height: 22,
      rx: 2,
      ry: 2,
      left: 43,
      top: 37,
      angle: 90
    });

    const zuoyi2 = new fabric.Rect({
      width: 15,
      height: 2,
      rx: 1,
      ry: 1,
      left: 45.5,
      top: 41.5,
      angle: 90
    });

    const zuoyi3 = new fabric.Rect({
      width: 15,
      height: 2,
      rx: 1,
      ry: 1,
      left: 20.5,
      top: 41.5,
      angle: 90
    });

    const zuoyi4 = new fabric.Rect({
      width: 3,
      height: 22,
      rx: 1,
      ry: 1,
      left: 43,
      top: 56,
      angle: 90
    });

    const objects = [table, rect, rect1, jianpan1, jianpan2, jianpan3, zuoyi1, zuoyi2, zuoyi3, zuoyi4];
    
    objects.forEach(obj => {
      obj.set({ fill, stroke });
    });

    return new fabric.Group(objects, {
      left,
      top,
      angle,
      workStationName,
      name,
      customType: 'square-workstation',
      floorNumber,
      selectable: true,
      hasControls: true,
      evented: true
    });
  }

  createChair(options = {}) {
    const {
      left = 0,
      top = 0,
      angle = 0,
      workStationName = '',
      name = null,
      floorNumber = 2,
      fill = '#fff',
      stroke = 'black'
    } = options;

    const zuoyi1 = new fabric.Rect({
      width: 20,
      height: 22,
      rx: 2,
      ry: 2,
      left: 49.3,
      top: 37,
      angle: 90
    });

    const zuoyi2 = new fabric.Rect({
      width: 15,
      height: 2,
      rx: 1,
      ry: 1,
      left: 51.5,
      top: 41.5,
      angle: 90
    });

    const zuoyi3 = new fabric.Rect({
      width: 15,
      height: 2,
      rx: 1,
      ry: 1,
      left: 27,
      top: 41.5,
      angle: 90
    });

    const zuoyi4 = new fabric.Rect({
      width: 3,
      height: 22,
      rx: 1,
      ry: 1,
      left: 49.3,
      top: 56,
      angle: 90
    });

    const objects = [zuoyi1, zuoyi2, zuoyi3, zuoyi4];
    
    objects.forEach(obj => {
      obj.set({ fill, stroke });
    });

    return new fabric.Group(objects, {
      left,
      top,
      angle,
      workStationName,
      name,
      customType: 'chair',
      floorNumber,
      selectable: true,
      hasControls: true,
      evented: true
    });
  }

  createWall(options = {}) {
    const {
      left = 0,
      top = 0,
      angle = 0,
      width = 200,
      height = 10,
      workStationName = '',
      name = null,
      floorNumber = 2,
      fill = '#000'
    } = options;

    return new fabric.Rect({
      left,
      top,
      width,
      height,
      angle,
      fill,
      workStationName,
      name,
      customType: 'wall',
      floorNumber,
      selectable: true,
      hasControls: true,
      evented: true
    });
  }

  createTable(options = {}) {
    const {
      left = 0,
      top = 0,
      angle = 0,
      width = 200,
      height = 10,
      workStationName = '',
      name = null,
      floorNumber = 2,
      fill = '#fff',
      stroke = 'black'
    } = options;

    return new fabric.Rect({
      left,
      top,
      width,
      height,
      angle,
      fill,
      stroke,
      workStationName,
      name,
      customType: 'table',
      floorNumber,
      selectable: true,
      hasControls: true,
      evented: true
    });
  }

  createText(options = {}) {
    const {
      left = 0,
      top = 0,
      angle = 0,
      text = '文字',
      fontSize = 15,
      workStationName = '',
      name = null,
      floorNumber = 2,
      fill = '#000',
      fontFamily = 'Arial'
    } = options;

    return new fabric.Text(text, {
      left,
      top,
      angle,
      fontSize,
      fill,
      fontFamily,
      workStationName: workStationName || text,
      name,
      customType: 'text',
      floorNumber,
      selectable: true,
      hasControls: true,
      evented: true
    });
  }

  // 预设文字组件
  createMainEntrance(options = {}) {
    return this.createText({
      text: '主入口\n大门',
      workStationName: '主入口\n大门',
      ...options
    });
  }

  createServerRoom(options = {}) {
    return this.createText({
      text: '机房',
      workStationName: '机房',
      ...options
    });
  }

  createMenRestroom(options = {}) {
    return this.createText({
      text: '男\n厕',
      workStationName: '男\n厕',
      ...options
    });
  }

  createWomenRestroom(options = {}) {
    return this.createText({
      text: '女\n厕',
      workStationName: '女\n厕',
      ...options
    });
  }

  createMeetingRoom(options = {}) {
    return this.createText({
      text: '会议室',
      workStationName: '会议室',
      ...options
    });
  }

  createOffice(options = {}) {
    return this.createText({
      text: '办公室',
      workStationName: '办公室',
      ...options
    });
  }

  // === JSON 序列化/反序列化 ===

  // 将组件序列化为JSON
  serializeComponent(component) {
    const baseProps = {
      type: component.customType,
      left: Math.floor(component.left),
      top: Math.floor(component.top),
      angle: Math.floor(component.angle),
      workStationName: component.workStationName || '',
      name: component.name || null,
      floorNumber: component.floorNumber || 2
    };

    // 根据组件类型添加特定属性
    switch (component.customType) {
      case 'text':
        return {
          ...baseProps,
          text: component.text,
          fontSize: component.fontSize,
          fill: component.fill,
          fontFamily: component.fontFamily
        };
      
      case 'wall':
      case 'table':
        return {
          ...baseProps,
          width: Math.floor(component.width),
          height: Math.floor(component.height),
          fill: component.fill,
          stroke: component.stroke
        };
      
      case 'l-workstation':
      case 'square-workstation':
      case 'chair':
        return {
          ...baseProps,
          width: Math.floor(component.getScaledWidth()),
          height: Math.floor(component.getScaledHeight()),
          scaleX: component.scaleX || 1,
          scaleY: component.scaleY || 1,
          fill: component.fill,
          stroke: component.stroke
        };
      
      default:
        return baseProps;
    }
  }

  // 从JSON创建组件
  deserializeComponent(jsonData) {
    const { type, ...options } = jsonData;
    return this.getComponent(type, options);
  }

  // 批量序列化画布上的所有组件
  serializeCanvas(canvas, floorNumber = null) {
    const objects = canvas.getObjects().filter(obj => 
      obj.customType && (floorNumber === null || obj.floorNumber === floorNumber)
    );
    
    return objects.map(obj => this.serializeComponent(obj));
  }

  // 批量从JSON数据加载到画布
  deserializeToCanvas(canvas, jsonArray) {
    jsonArray.forEach(item => {
      try {
        const component = this.deserializeComponent(item);
        canvas.add(component);
      } catch (error) {
        console.error('Failed to load component:', item, error);
      }
    });
    canvas.renderAll();
  }
}

// 创建单例实例
const workstationLibrary = new WorkstationComponentLibrary();

// 导出单例和类
export { workstationLibrary as default, WorkstationComponentLibrary };