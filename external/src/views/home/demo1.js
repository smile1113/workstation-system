// 页面加载完成后触发（打开详情页必执行）
export async function didMount() {
    console.log("表单详情页加载完成，开始更新发货状态");
    const that = this; // 保存this上下文，避免异步回调中丢失
    // 显示加载提示（提升用户体验）
    try {
      // 流程实例ID（详情页URL参数中获取）
      const processInstanceId = that.state.urlParams.procInsId || "";
      console.log("流程ID:", processInstanceId);
  
      if (!processInstanceId) {
        return
      }
  
      // 快递单号（从表单字段获取，需替换为你的快递单号字段编码）
      const expressNo = that.$("textField_mfby4pqf").getValue() || "";
      console.log("当前快递单号:", expressNo);
      if (!expressNo) {
        return
      }
  
      const company = that.$("textField_mi2pp8jb").getValue() || "";
      console.log("当前快递单公司:", company);
      if (!company) {
        return
      }
      const response = queryKuaidi100(company, expressNo);
      // -------------------------- 4. 解析接口响应 --------------------------
      // if (!response.ok) {
      //   throw new Error(`接口请求失败：HTTP状态码=${response.status}`);
      // }
  
      // const resData = await response.json();
      // console.log("发货状态查询结果：", JSON.stringify(resData, null, 2));
  
      // -------------------------- 5. 提取发货状态并更新到表单（核心步骤）--------------------------
      const resData = '';
      const kuaidi100Status = resData.status;
      const dataStr = resData.data || "";
      if (!dataStr) {
        throw new Error("接口未返回发货状态数据");
      }
      const ischeck = resData.ischeck || '';
      // 4. 若ischeck="1"，提取data数组第一个元素的ftime
      if (ischeck === '1') {
        // 校验data是否为非空数组
        const dataList = Array.isArray(resData.data) ? rawData.data : [];
        if (dataList.length > 0) {
          // 取第一个元素的ftime（优先字符串类型，无则为空）
          const firstData = dataList[0];
          const ftime = typeof firstData.ftime === 'string'
            ? firstData.ftime
            : String(firstData.ftime || '');
          console.log('解析data第一个元素的ftime：', ftime);
        } else {
          console.warn('ischeck="1"但data数组为空，无法获取ftime');
        }
      } else {
        console.log(`ischeck=${ischeck}，无需获取ftime`);
      }
  
      // 更新表单字段（页面会实时展示最新状态）
      that.$('textField_mfby4pqg').setValue(kuaidi100Status);
      that.$('textField_mi2hkpkt').setValue(ftime)
  
      // 成功提示
      that.utils.toast({ title: "发货状态更新成功", type: "success" });
  
    } catch (error) {
      // -------------------------- 6. 错误处理 --------------------------
      const errorMsg = `发货状态更新失败：${error.message}`;
      console.error(errorMsg, error.stack);
      // 错误提示（用户可见）
      that.utils.toast({ title: errorMsg, type: "error" });
    }
  }
  
  // 函数加 async：支持 await 等待接口响应，宜搭会自动处理 Promise 结果
  export async function onProcessActionValidate({ formDataMap, action }) {
    // 初始化返回结果（默认允许执行动作）
    let result = { valid: true, message: "校验通过" };
    console.log("formDataMap:", JSON.stringify(formDataMap));
  
    try {
      // -------------------------- 1. 基础参数校验（空值防护，避免无效调用）--------------------------
      const processInstanceId = this.state.urlParams.procInsId || '';
      console.log("流程ID:", processInstanceId);
  
      if (!processInstanceId) {
        return {
          valid: false,
          message: "未获取到流程实例ID/表单实例ID，无法执行动作"
        };
      }
  
      const expressNo = this.$('textField_mfby4pqf').getValue() || '';
      console.log("快递单号:", expressNo);
  
      if (!action) {
        return {
          valid: false,
          message: "未指定动作标识（action），无法调用接口"
        };
      }
  
      // -------------------------- 2. 构造接口URL（特殊字符编码，避免URL失效）--------------------------
      const apiUrl = `https://7a900d59.r36.cpolar.top/admin-api/dingtalk/formAction?` +
        `formId=${encodeURIComponent(processInstanceId)}&` +
        `procInsId=${encodeURIComponent(processInstanceId)}&` +
        `action=${encodeURIComponent(action)}&` +
        `expressNo=${encodeURIComponent(expressNo)}`;
      console.log('即将调用的接口地址：', apiUrl);
  
      // -------------------------- 3. 异步调用接口（核心：await等待结果，处理超时）--------------------------
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('接口调用超时（5秒）')), 5000);
      });
  
      const response = await Promise.race([
        fetch(apiUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }),
        timeoutPromise
      ]);
  
      // -------------------------- 4. 解析接口响应（处理HTTP状态码 + 响应体）--------------------------
      if (!response.ok) {
        throw new Error(`接口请求失败：HTTP状态码=${response.status}（${response.statusText}）`);
      }
  
      const resData = await response.json();
      console.log("接口返回原始数据：", JSON.stringify(resData, null, 2));
  
      // -------------------------- 5. 业务逻辑判断 + 延迟异步更新（核心修改）--------------------------
      if (resData) { // 按你的接口code=0判断成功
        console.log("接口调用成功，允许执行流程动作");
        result = { valid: true, message: resData.msg || "接口调用成功，校验通过" };
  
        const dataStr = resData.data || '';
        if (dataStr) {
          try {
            // 验证dataStr是合法JSON（避免传给updateProcessInstance无效数据）
            JSON.parse(dataStr);
            console.log("dataStr格式合法，将延迟执行更新");
  
            // -------------------------- 关键：延迟异步执行更新（不阻塞宜搭流程）--------------------------
            // 延迟时间：1500ms（可根据实际调整，给宜搭足够时间保存表单数据）
            setTimeout(async () => {
              try {
                console.log("开始执行延迟更新，流程ID：", processInstanceId);
                // 执行局部更新（此时宜搭已完成自身的表单保存，不会覆盖填写的字段）
                const updateRes = await this.utils.yida.updateProcessInstance({
                  processInstanceId: processInstanceId,
                  updateFormDataJson: dataStr, // 只更新dataStr中的指定字段，不影响其他字段
                });
                console.log("延迟更新快递状态成功：", updateRes);
                this.utils.toast({ title: "延迟更新快递状态成功", type: 'success' });
              } catch (updateError) {
                console.error("延迟更新快递状态失败：", updateError.message);
                this.utils.toast({ title: `延迟更新快递状态失败：${updateError.message}`, type: 'error' });
              }
            }, 5000); // 延迟时间（毫秒）：1-2秒足够，可根据宜搭响应速度调整
  
          } catch (parseError) {
            console.error("dataStr格式非法，无法更新：", parseError.message, "原始数据：", dataStr);
            throw new Error(`数据格式错误：${parseError.message}`);
          }
        } else {
          console.warn("接口data字段为空，不执行更新");
        }
      } else {
        throw new Error(`接口业务失败：${resData.msg || '未知错误'}`);
      }
  
    } catch (error) {
      // -------------------------- 6. 全局异常捕获 --------------------------
      const errorMsg = `校验失败：${error.message}`;
      console.error("onProcessActionValidate 执行异常：", errorMsg, error.stack);
      result = {
        valid: false,
        message: errorMsg
      };
    }
  
    // -------------------------- 7. 返回校验结果（立即返回，不等待延迟更新）--------------------------
    console.log("校验结果：", JSON.stringify(result));
    return result;
  }
  
  // 快递100查询方法（集成签名生成）
  async function queryKuaidi100(com, num) {
    const KUAIDI100_CONFIG = {
      key: 'CNULULFv3058',
      customer: '660703C0C2032641D39870B038391713'
    };
  
    // 构造param
    const param = {
      com: com, // 快递公司编码（已从表单获取）
      num: num,  // 快递单号
      phone: "",       // 手机号（可选，部分快递需要）
      from: "",        // 寄件地址（可选）
      to: "",          // 收件地址（可选）
      resultv2: "0",   // 结果版本（0=精简版，1=详细版）
      show: "0",       // 显示详情（0=不显示，1=显示）
      order: "desc"    // 排序方式（降序）
    };

    // 生成签名
    const sign = generateKuaidi100Sign(param, KUAIDI100_CONFIG.key, KUAIDI100_CONFIG.customer);
    console.log("生成签名" + JSON.stringify(sign));
  
    // 编码param
    const encodedParam = encodeURIComponent(JSON.stringify(param).replace(/\s/g, ''));
    // 3. 构造请求体（form-data格式，核心修改！）
    const inputs = JSON.stringify({
      // header：按快递100接口要求配置（Content-Type需与连接器一致）
      header: {
        "Content-Type": "application/x-www-form-urlencoded", // 若连接器配置为form-data则改为multipart/form-data
      },
      // body：快递100接口必填参数（customer+sign+param）
      query: {
        customer: KUAIDI100_CONFIG.customer,
        sign: sign,
        param: encodedParam // 直接传对象（连接器会自动处理序列化）
      }
    });
    const response = await that.dataSourceMap.kuaidi100Query.load({ inputs });
      return response;
}
  
  
  /**
   * 快递100签名生成方法
   */
  function generateKuaidi100Sign(param, key, customer) {
    // 1. 校验必填参数
    if (!param || !key || !customer) {
      throw new Error('签名参数缺失：param、key、customer均为必填项');
    }
  
    // 2. 处理param：转为无空格的JSON字符串（避免空格导致签名错误）
    let paramStr;
    if (typeof param === 'object') {
      // 若param是对象，转为JSON字符串并去除所有空格
      paramStr = JSON.stringify(param).replace(/\s/g, '');
    } else if (typeof param === 'string') {
      // 若param是字符串，直接去除空格（防止传入带空格的JSON字符串）
      paramStr = param.replace(/\s/g, '');
    } else {
      throw new Error('param参数格式错误：仅支持JSON对象或字符串');
    }
  
    // 3. 按规则拼接字符串（paramStr + key + customer，无"+"号）
    const signSource = paramStr + key + customer;
    console.log('签名原始字符串：', signSource);
  
    // 4. MD5加密 → 32位大写（宜搭内置CryptoJS，无需额外引入）
    //   const md5Result = CryptoJS.MD5(signSource);
    //   const sign = md5Result.toString().toUpperCase(); // 转为32位大写（CryptoJS.MD5默认输出32位）
  
    console.log('生成的快递100签名：', signSource);
    return '596175E6A794A6054AB5932EF196F1E5';
  }