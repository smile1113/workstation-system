-- =====================================================
-- 为 workstations 表添加 scaleX 和 scaleY 字段
-- 这些字段用于精确保存工位的缩放比例，解决拖动后大小不一致的问题
-- =====================================================

-- 方案1：MySQL 5.7+ 支持 IF NOT EXISTS（推荐）
ALTER TABLE workstations 
ADD COLUMN IF NOT EXISTS scaleX DECIMAL(10, 4) DEFAULT NULL COMMENT 'X轴缩放比例';

ALTER TABLE workstations 
ADD COLUMN IF NOT EXISTS scaleY DECIMAL(10, 4) DEFAULT NULL COMMENT 'Y轴缩放比例';

-- 方案2：如果 MySQL 版本不支持 IF NOT EXISTS，使用以下方式
-- 注意：如果字段已存在会报错，可以先检查表结构
/*
ALTER TABLE workstations 
ADD COLUMN scaleX DECIMAL(10, 4) DEFAULT NULL COMMENT 'X轴缩放比例';

ALTER TABLE workstations 
ADD COLUMN scaleY DECIMAL(10, 4) DEFAULT NULL COMMENT 'Y轴缩放比例';
*/

-- 方案3：使用存储过程安全添加字段（适用于生产环境）
/*
DELIMITER $$
CREATE PROCEDURE AddScaleColumnsIfNotExists()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'workstations' 
        AND COLUMN_NAME = 'scaleX'
    ) THEN
        ALTER TABLE workstations 
        ADD COLUMN scaleX DECIMAL(10, 4) DEFAULT NULL COMMENT 'X轴缩放比例';
    END IF;
    
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'workstations' 
        AND COLUMN_NAME = 'scaleY'
    ) THEN
        ALTER TABLE workstations 
        ADD COLUMN scaleY DECIMAL(10, 4) DEFAULT NULL COMMENT 'Y轴缩放比例';
    END IF;
END$$
DELIMITER ;

-- 执行存储过程
CALL AddScaleColumnsIfNotExists();

-- 删除存储过程（可选）
DROP PROCEDURE IF EXISTS AddScaleColumnsIfNotExists;
*/

-- 验证字段是否添加成功
-- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
-- FROM INFORMATION_SCHEMA.COLUMNS
-- WHERE TABLE_SCHEMA = DATABASE() 
-- AND TABLE_NAME = 'workstations'
-- AND COLUMN_NAME IN ('scaleX', 'scaleY');

