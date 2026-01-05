const db = require('../db/index')

// 存入工位
exports.setData = (req, res) => {
  console.log("保存数据");
  console.log(req.body.data);
  
  if (!req.body.data || !Array.isArray(req.body.data) || req.body.data.length === 0) {
    return res.status(400).send('数据格式错误或数据为空');
  }

  try {
    // 获取楼层编号（假设所有数据都是同一楼层）
    const floorNumber = req.body.data[0].floorNumber;
    if (!floorNumber) {
      return res.status(400).send('楼层编号不能为空');
    }

    // 将数据库操作包装成 Promise
    const saveItem = (item) => {
      return new Promise((resolve, reject) => {
        const scaleX = item.scaleX !== undefined ? item.scaleX : null;
        const scaleY = item.scaleY !== undefined ? item.scaleY : null;
        
        if (item.id !== null && item.id !== undefined) {
          // 如果有id，执行更新操作
          const sqlUpdate = `UPDATE workstations
              SET left_position = ?, top_position = ?, width = ?, height = ?, angle = ?, workStationName = ?, user_id = ?, customType = ?, floorNumber = ?, scaleX = ?, scaleY = ?
              WHERE id = ?;`;
          db.query(sqlUpdate, [
            item.left,
            item.top,
            item.width,
            item.height,
            item.angle,
            item.workStationName,
            item.name,
            item.customType,
            item.floorNumber,
            scaleX,
            scaleY,
            item.id
          ], (err, result) => {
            if (err) {
              // 如果更新失败，可能是数据库没有 scaleX/scaleY 字段，尝试不带这些字段的更新
              const sqlUpdateOld = `UPDATE workstations
                  SET left_position = ?, top_position = ?, width = ?, height = ?, angle = ?, workStationName = ?, user_id = ?, customType = ?, floorNumber = ?
                  WHERE id = ?;`;
              db.query(sqlUpdateOld, [
                item.left,
                item.top,
                item.width,
                item.height,
                item.angle,
                item.workStationName,
                item.name,
                item.customType,
                item.floorNumber,
                item.id
              ], (err2, result2) => {
                if (err2) {
                  console.log('修改错误', err2);
                  reject(err2);
                } else {
                  console.log('修改成功', result2);
                  resolve(result2);
                }
              });
            } else {
              console.log('修改成功', result);
              resolve(result);
            }
          });
        } else {
          // 如果没有id，执行添加操作
          const sqlInsert = `INSERT INTO workstations
              (left_position, top_position, width, height, angle, workStationName, user_id, customType, floorNumber, scaleX, scaleY)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          db.query(sqlInsert, [
            item.left,
            item.top,
            item.width,
            item.height,
            item.angle,
            item.workStationName,
            item.name,
            item.customType,
            item.floorNumber,
            scaleX,
            scaleY
          ], (err, result) => {
            if (err) {
              // 如果插入失败，可能是数据库没有 scaleX/scaleY 字段，尝试不带这些字段的插入
              const sqlInsertOld = `INSERT INTO workstations
                  (left_position, top_position, width, height, angle, workStationName, user_id, customType, floorNumber)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
              db.query(sqlInsertOld, [
                item.left,
                item.top,
                item.width,
                item.height,
                item.angle,
                item.workStationName,
                item.name,
                item.customType,
                item.floorNumber
              ], (err2, result2) => {
                if (err2) {
                  console.log('添加错误', err2);
                  reject(err2);
                } else {
                  console.log('添加成功', result2);
                  resolve(result2);
                }
              });
            } else {
              console.log('添加成功', result);
              resolve(result);
            }
          });
        }
      });
    };

    // 使用 Promise.all 等待所有操作完成
    Promise.all(req.body.data.map(item => saveItem(item)))
      .then(() => {
        // 只保存修改过的对象，不删除其他对象
        res.status(200).json({
          success: true,
          message: `成功保存 ${req.body.data.length} 个工位`,
          savedCount: req.body.data.length
        });
      })
      .catch((error) => {
        console.error('保存失败:', error);
        res.status(500).json({
          success: false,
          message: `Database error: ${error.message}`
        });
      });
  } catch (error) {
    console.error('保存过程出错:', error);
    res.status(500).json({
      success: false,
      message: `Database error: ${error.message}`
    });
  }
};

// 返回工位
exports.getData = (req, res) => {
  const floorNumber = req.body.data
  db.query('SELECT * FROM workstations WHERE floorNumber = ?',[floorNumber], (err, rows, fields) => {
    if (err) {
      console.error(err);
      return res.status(500).send('数据库查询错误');
    }
    res.json(rows)
  });
}

// 删除工位
exports.delData = (req, res) => {
  const id = req.body.data
  db.query('DELETE FROM workstations WHERE id = ?;', [id], (err, ) => {
    if (err) {
      console.error(err);
      return res.status(500).send('删除失败');
    }
    res.status(200).send('删除成功');
  });
}

// 搜索
exports.searchData = (req, res) => {
  const { workStationName, user_id, workStationFloor } = req.body.data;
  console.log(user_id);

  // 确保workStationFloor总是提供的
  if (workStationFloor === undefined || workStationFloor === null) {
    return res.status(400).send('必须提供workStationFloor');
  }

  // 初始化SQL查询语句和参数数组
  let sql = 'SELECT w.id';
  let params = [workStationFloor];  // 始终将workStationFloor添加到参数中

  // 动态构建JOIN和WHERE条件
  sql += `
    FROM workstations w
    LEFT JOIN users u ON w.user_id = u.id
    WHERE w.floorNumber = ?`;  // 始终包含workStationFloor条件

  // 添加其他条件
  let conditions = [];
  if (workStationName) {
    conditions.push('w.workStationName = ?');
    params.push(workStationName);
  }
  if (user_id !== undefined && user_id !== null) {
    conditions.push('w.user_id = ?');
    params.push(parseInt(user_id, 10));  // 确保user_id是整数
  }

  if (conditions.length > 0) {
    sql += ' AND (' + conditions.join(' OR ') + ')';  // 使用OR连接额外的条件
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('服务器错误，请稍后再试');
    }
    res.status(200).json(result);  // 使用JSON格式返回结果
  });
};

exports.getUserList = (req, res) => {
  const sqlQuery = 'SELECT id AS value, name AS label FROM users;';

  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('查询失败');
    }
    res.status(200).json(result);
  });
}

