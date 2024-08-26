const CommentReport = (Sequelize, DataTypes) => {
    const model = Sequelize.define('COMMENT_REPORT',
        {
            comment_report_num: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            article_num: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            writer_num: {
                type: DataTypes.INT,
                allowNull: false
            }
        },
        // param3: 모델 옵션 정의
        {
            freezeTableName: true, // 테이블 명 고정
            timestamps: false, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
        }
    );
    return model;
}

module.exports = CommentReport;