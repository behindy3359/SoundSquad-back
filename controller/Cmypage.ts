import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import * as pagination from '../utils/pagination';

dotenv.config();

//testapi 아직 개발되지 않은 api의 endpoint, 요청이 제대로 도달하는지 확인 가능
export const testApi = async (req: Request, res: Response) => {
  try {
    console.log('req >>>> ', req);  
  } catch (err) {
    console.error(err);
  }
};

/** 마이페이지에서 유저 정보를 요청하는 함수
 * get : /mypage/user?user_num= 의 도달점
 * @param req 
 * @param res 
 * @returns 
 */
export const getMypageUserInfo = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user_num);
    
    if(targetUserNum !== nowUser){
      return res.status(403).json({ msg : '접근 권한이 없습니다.' });
    }

    const result = await db.User.findOne({ 
      where : { user_num : targetUserNum, activate : true},
      attributes:['user_num','user_id','user_gender','user_bd','introduce','profile_img','prefer_genre','mbti','user_rating'], 
    });

    if(!result){
      return res.status(404).json({ msg : '정보를 조회하던 중 오류가 발생했습니다. ' });
    }

    return res.status(200).json({ msg : '정보를 성공적으로 조회했습니다.', data : result });
  } catch (err) {
    console.error('Mypage 유저 정보를 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Mypage 유저 정보를 불러오는 중 오류가 발생했습니다.' });
  }
};

/** 마이페이지에서 사용자가 작성한 게시글 목록을 조회
 * get : /mypage/community?user_num=&page= 의 도달점
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getMypagePost = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user_num);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;
    
    if(targetUserNum !== nowUser){
      return res.status(403).json({ msg : '접근 권한이 없습니다.' });
    }

    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.Community.findAndCountAll({
      where: { user_num: targetUserNum , activate: true },
      include: [{
        model: db.User,
        attributes: ['user_id'],
      }],
      attributes: ['article_num', 'article_title', 'user_num', 'created_at'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if( page > totalPages ){
      return res.status(404).json({msg : '게시글이 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'posts');

    return res.status(200).json({msg : '게시글 목록을 성공적으로 불러왔습니다.', data : result });

  } catch (err) {
    console.error('Mypage 게시글 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Mypage 게시글 목록을  불러오는 중 오류가 발생했습니다.' });
  }
};

/** 마이페이지에서 사용자가 작성한 댓글 목록을 조회하는 요청
 * get : /mypage/comment?user_num=&page=
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getMypageComment = async (req: Request, res: Response) => {
  try {
    const targetUserNum = parseInt(req.query.user_num as string);
    const nowUser = parseInt((req.session as any).user_num);
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.limit as string) || 10;

    if(targetUserNum !== nowUser){
      return res.status(403).json({ msg : '접근 권한이 없습니다.' });
    }

    const offset = pagination.offsetPagination(page, pageSize);

    const { count, rows } = await db.Comment.findAndCountAll({
      where: { user_num: targetUserNum , activate: true },
      include: [{
        model: db.User,
        attributes: ['user_id'],
      }],
      attributes: ['comment_num', 'comment_content', 'user_num', 'created_at'],
      offset,
      limit: pageSize,
    });

    const totalPages = Math.ceil(count / pageSize);
    if( page > totalPages ){
      return res.status(404).json({msg : '댓글이 존재하지 않는 페이지 입니다.'});
    };

    const result = pagination.responsePagination(rows, count, page, pageSize, 'comments');

    return res.status(200).json({msg : '댓글 목록을 성공적으로 불러왔습니다.', data : result });

  } catch (err) {
    console.error('Mypage 댓글 목록을 불러오는 중 오류 발생했습니다.', err);
    return res.status(500).json({ msg: 'Mypage 댓글 목록을 불러오는 중 오류가 발생했습니다.' });
  }
};